import { SupabaseClient } from "@supabase/supabase-js";

export type SupabaseStage = {
  id: string;
  type: string;
  [key: string]: any;
};

export type SupabaseQuizAttempt = {
  id: string;
  course_activity_id: string;
  activity_attempt_id: string;
  stage_id: string;
  score: number;
  all_viewed: boolean;
};

export type SupabaseActivity = {
  id: string;
  params: Record<string, any>;
};

export type SupabaseCourseActivity = {
  id: string;
  activity_id: string;
};

export type ActivityStageIdsRelation = {
  cajId?: string;
  activityId: string;
  stageIds: string[];
};

// Get stages by IDs
export async function getStagesById(supabase: SupabaseClient, stageIds: string[], type?: string): Promise<SupabaseStage[]> {
  if (!stageIds || stageIds.length === 0) {
    console.warn('No stage IDs provided.');
    return [];
  }

  let query = supabase.from('stages').select('*').in('id', stageIds);

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;
  if (error) throw error;

  // reorder stages to match input IDs
  const lookup = Object.fromEntries((data || []).map(stage => [stage.id, stage]));
  return stageIds.map(id => lookup[id]).filter(Boolean);
}

// Get attempts by score threshold for a specific user
export async function getAttemptsByScoreThreshold(supabase: SupabaseClient, userId: string, scoreThreshold = 1.0, allViewed = true) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .gte('score', scoreThreshold)
    .eq('all_viewed', allViewed)
    .eq('user_id', userId);

  if (error) throw error;
  return data || [];
}

// Get quizzes for a list of course activities
export async function getQuizzesForCourseActivities(supabase: SupabaseClient, cajIds: string[]): Promise<ActivityStageIdsRelation[]> {
  const { data: courseActivities, error } = await supabase
    .from('courses_activities_join')
    .select('*')
    .in('id', cajIds);

  if (error) throw error;
  const activityIds = (courseActivities || []).map(ca => ca.activity_id);

  const activityStageRelations = await getQuizzesForActivities(supabase, activityIds);

  // attach CAJ IDs
  activityStageRelations.forEach(relation => {
    const matchingCAJ = (courseActivities || []).find(ca => ca.activity_id === relation.activityId);
    if (matchingCAJ) relation.cajId = matchingCAJ.id;
  });

  return activityStageRelations;
}

// Get quizzes for a list of activities
export async function getQuizzesForActivities(supabase: SupabaseClient, activityIds: string[]): Promise<ActivityStageIdsRelation[]> {
  const { data: activities, error } = await supabase
    .from('activities')
    .select('*')
    .in('id', activityIds);

  if (error) throw error;

  const results: ActivityStageIdsRelation[] = [];

  for (const activity of activities || []) {
    const stageIds: string[] = activity.params?.stage_ids || [];
    const quizStages = await getStagesById(supabase, stageIds, 'quiz');
    results.push({
      activityId: activity.id,
      stageIds: quizStages.map(stage => stage.id),
    });
  }

  return results;
}

// Get mastered course activity IDs for a user
export async function getMasteredCourseActivityIds(supabase: SupabaseClient, userId: string): Promise<string[]> {
    const userAttempts = await getAttemptsByScoreThreshold(supabase, userId);

    type InternalUserAttempt = {
        cajId: string;
        sessionId: string;
        stageIdsAttempted: string[];
        mastered?: boolean;
    };

    const internalAttempts: InternalUserAttempt[] = [];
    const grouped = new Map<string, InternalUserAttempt>();

    userAttempts.forEach((a, index) => {
        if (!a.caj_id) {
            console.warn(`Warning: userAttempt at index ${index} has undefined caj_id`, a);
        }
        if (!a.stage_id) {
            console.warn(`Warning: userAttempt at index ${index} has undefined stage_id`, a);
        }

        const key = `${a.caj_id}_${a.activity_attempt_id}`;
        if (!grouped.has(key)) {
            grouped.set(key, {
                cajId: a.caj_id!,
                sessionId: a.activity_attempt_id,
                stageIdsAttempted: [],
            });
        }
        if (a.stage_id) {
            grouped.get(key)!.stageIdsAttempted.push(a.stage_id);
        }
    });

    internalAttempts.push(...grouped.values());

    const cajIds = internalAttempts.map(a => a.cajId).filter(Boolean);
    console.log('Filtered CAJ IDs for query:', cajIds);

    const cajStageRelations = await getQuizzesForCourseActivities(supabase, cajIds);

    // Mark mastered
    internalAttempts.forEach(att => {
    const relation = cajStageRelations.find(r => r.cajId === att.cajId);
    if (relation) {
            att.mastered = relation.stageIds.every(stageId =>
            att.stageIdsAttempted.includes(stageId)
        );
    }
    });

    const masteredCajIds = internalAttempts
        .filter(a => a.mastered)
        .map(a => a.cajId);

    const uniqueMasteredCajIds = Array.from(new Set(masteredCajIds));

    console.log('Mastered CAJ IDs:', masteredCajIds);
    return uniqueMasteredCajIds;
}