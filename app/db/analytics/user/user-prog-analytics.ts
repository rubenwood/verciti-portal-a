import { SupabaseClient} from '@supabase/supabase-js';

export async function getUsersProgress(client: SupabaseClient, user_ids: string[]){
    const { data, error } = await client
        .from('generic_activity_progress')
        .select('*')
        .in('user_id', user_ids);

    if (error) {
        console.error("Error fetching user progress:", error);
        return [];
    }
    return data as any[];
}

export async function getUsersProfilesByOrgId(client: SupabaseClient, orgId: string){
    const { data, error } = await client
    .from('user_profiles')
    .select(`
        *,
        generic_activity_progress (*)
    `)
    .eq('org_id', orgId);

    if (error) {
        console.error('Error fetching users with progress:', error);
        throw error;
    }

    return data ?? [];

}

export async function getUsersProfilesByVisibility(client: SupabaseClient, contentVisibility: string) {
    // this query gets the user profiles that have a specific content visibility
    // and it also gets their associated generic activity progress

    // TODO: split out the generic_activity_progress or this will return too much data
    const { data, error } = await client
    .from('user_profiles')
    .select(`
        *,
        generic_activity_progress (*)
    `)
    .contains('content_visibility', [contentVisibility]);

    if (error) {
        console.error('Error fetching users with progress:', error);
        throw error;
    }

    return data ?? [];
}

export async function getUserAttempts(client: SupabaseClient, user_ids: string[], page: number = 0, pageSize: number = 1000) {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { count, error: errorCount } = await client
        .from('generic_activity_attempts')
        .select('*', { count: 'exact', head: true })
        .in('user_id', user_ids)
        .gt('duration', 4); // need attempts that are greater than 0 duration

    if (errorCount) {
        console.error('Error fetching attempts count:', errorCount);
        return {
            data: [],
            page,
            pageSize,
            totalCount: 0,
            pageCount: 0,
        };
    }

    const pageCount = Math.ceil((count || 0) / pageSize);
    const { data, error } = await client
        .from('generic_activity_attempts')
        .select('*')
        .in('user_id', user_ids)
        .gt('duration', 4)
        .range(from, to);

    if (error) {
        console.error('Error fetching user attempts:', error);
        return {
            data: [],
            page,
            pageSize,
            totalCount: count || 0,
            pageCount,
        };
    }

    return {
        data: data as any[],
        page,
        pageSize,
        totalCount: count || 0,
        pageCount,
    };
}

export async function getMasteredActivities(client: SupabaseClient, userIds: string[], page: number = 0, pageSize: number = 1000) {

    if (!userIds.length) return {};

    // Get all 100% quiz attempts for the given users (paginated)
    const { data: attempts100, error: attemptsError } = await client
        .from("quiz_attempts")
        .select("user_id, activity_attempt_id, caj_id, stage_id, score")
        .in("user_id", userIds)
        .eq("score", 1)
        .range(page * pageSize, (page + 1) * pageSize - 1);

    if (attemptsError) throw new Error(`Failed to fetch quiz attempts: ${attemptsError.message}`);
    if (!attempts100?.length) return Object.fromEntries(userIds.map(id => [id, { masteredCajIds: [], masteredStageIds: [] }]));

    // Group attempts by user -> session (activity_attempt_id) -> stages
    const sessionsByUser: Record<string, { activityAttemptId: string; cajId: string; masteredStageIds: Set<string> }[]> = {};

    for (const attempt of attempts100) {
    if (!sessionsByUser[attempt.user_id]) sessionsByUser[attempt.user_id] = [];

    const existing = sessionsByUser[attempt.user_id].find(s => s.activityAttemptId === attempt.activity_attempt_id);
    if (existing) {
        existing.masteredStageIds.add(attempt.stage_id);
    } else {
        sessionsByUser[attempt.user_id].push({
            activityAttemptId: attempt.activity_attempt_id,
            cajId: attempt.caj_id,
            masteredStageIds: new Set([attempt.stage_id]),
        });
    }
    }

    // Fetch required quiz stages for all attempted CAJs across all users
    const allCajIds = [...new Set(attempts100.map(a => a.caj_id))];

    const { data: quizStageMappings, error: mappingsError } = await client
        .from("stage_activity_join")
        .select("caj_id, stage_id, stages!inner(type)")
        .eq("stages.type", "quiz")
        .in("caj_id", allCajIds);

    if (mappingsError) throw new Error(`Failed to fetch stage mappings: ${mappingsError.message}`);
    if (!quizStageMappings?.length) return Object.fromEntries(userIds.map(id => [id, { masteredCajIds: [], masteredStageIds: [] }]));

    // Build required stages per CAJ
    const requiredStagesPerCaj: Record<string, Set<string>> = {};
    for (const mapping of quizStageMappings) {
        if (!requiredStagesPerCaj[mapping.caj_id]) requiredStagesPerCaj[mapping.caj_id] = new Set();
        requiredStagesPerCaj[mapping.caj_id].add(mapping.stage_id);
    }

    // For each user, check which CAJs are mastered in a single session
    const results: Record<string, { masteredCajIds: string[]; masteredStageIds: string[] }> = {};

    for (const userId of userIds) {
        const sessions = sessionsByUser[userId] ?? [];
        const masteredCajIds: string[] = [];
        const masteredStageIds = new Set<string>();

        for (const [cajId, requiredStages] of Object.entries(requiredStagesPerCaj)) {
            // Find a single session that covers all required stages for this CAJ
            const masteringSession = sessions.find(
            s => s.cajId === cajId && [...requiredStages].every(id => s.masteredStageIds.has(id))
            );

            if (masteringSession) {
            masteredCajIds.push(cajId);
            masteringSession.masteredStageIds.forEach(id => masteredStageIds.add(id));
            }
        }

        results[userId] = {
            masteredCajIds,
            masteredStageIds: [...masteredStageIds],
        };
    }
    return results;
}

// =============== Metrics Calculations ===============
export function calcTotalModulesCompleted(userProgressData: any[]): number {
    let totalCompleted = 0;
    for(let user of userProgressData) {
        for(const activity of user.generic_activity_progress){
            if(activity.completion >= 1){
                totalCompleted += 1;
            }
        }
    }
    return totalCompleted;
}

export function calcTotalUniqueModulesCompleted(userProgressData: any[]): number {
    //console.log("Calculating total modules completed from user progress data:", userProgressData);

    const completedModules = new Set<string>();

    for (const user of userProgressData) {
        for (const activity of user.generic_activity_progress ?? []) {
            if (activity.completion >= 1) {
                completedModules.add(activity.activity_id);
            }
        }
    }

    return completedModules.size;
}

export function calcTotalUsageTimeForUserProg(userProgressData: any[]): number {
    let totalUsageTime = 0;
    for(let user of userProgressData) {
        totalUsageTime += user.total_usage_time;
    }
    return totalUsageTime;
}

export function calcMostPopularByUserCount(userProgressData: any[]): {moduleTitles: string[] | null, userCount: number} {
    const activityUserMap: {[key: string]: Set<any>} = {};
    for (const user of userProgressData) {
        const userId = user.id;
        for(const activity of user.generic_activity_progress){
            if(!(activity.activity_id in activityUserMap)){
                activityUserMap[activity.activity_id] = new Set<any>();
            }
            activityUserMap[activity.activity_id].add({userId, activity});
        }
    }

    const highestUserCount = Math.max(...Object.values(activityUserMap).map(set => set.size));
    // create a list of module that have the highest user count
    let mostFrequentActivities = Object.keys(activityUserMap).filter(key => activityUserMap[key].size === highestUserCount);
    let mostPlayedActivityTitles = [];
    for(const activityId of mostFrequentActivities){
        const firstEntry = activityUserMap[activityId].values().next().value;
        mostPlayedActivityTitles.push(firstEntry.activity.external_title);
    }
    //console.log("Most played activity titles:", mostPlayedActivityTitles);
    
    return {
        moduleTitles: mostPlayedActivityTitles,
        userCount: highestUserCount
    }
}

export function calcMostPlayed(userProgressData: any[]): {moduleTitle: string | null, playCount: number} {
    const playCounts: {[key: string]: number} = {};
    for (const user of userProgressData) {
        for(const activity of user.generic_activity_progress){
            if(!(activity.activity_id in playCounts)){
                playCounts[activity.activity_id] = 0;
            }
            playCounts[activity.activity_id] += activity.attempts.length;
        }
    }
    const mostPlayedActivityId = Object.keys(playCounts).reduce((a, b) => playCounts[a] > playCounts[b] ? a : b);
    const mostPlayedActivity = userProgressData[0].generic_activity_progress.find(
        (activity: any) => activity.activity_id === mostPlayedActivityId);
    
    return {
        moduleTitle: mostPlayedActivity ? mostPlayedActivity.external_title : null,
        playCount: mostPlayedActivity ? playCounts[mostPlayedActivityId] : 0
    };       
}

export function calcMostPlayedTime(userAttemptsData: any[]): {moduleTitle: string | null, playTime: number} {
    //console.log("Calculating most played time from attempts data:", userAttemptsData);

    const playTimes: {[key: string]: number} = {};
    for (const attempt of userAttemptsData) {
        if(!(attempt.activity_id in playTimes)){
            playTimes[attempt.activity_id] = 0;
        }
        playTimes[attempt.activity_id] += attempt.duration;
    }
    //console.log("Accumulated play times:", playTimes);

    const mostPlayedActivityId = Object.keys(playTimes).reduce((a, b) => playTimes[a] > playTimes[b] ? a : b, '');
    //console.log("Most played activity ID by time:", mostPlayedActivityId);
    const mostPlayedActivity = userAttemptsData.find((attempt: any) => attempt.activity_id === mostPlayedActivityId);
    return {
        moduleTitle: mostPlayedActivity ? mostPlayedActivity.external_title : null,
        playTime: mostPlayedActivity ? playTimes[mostPlayedActivityId] : 0
    }
}