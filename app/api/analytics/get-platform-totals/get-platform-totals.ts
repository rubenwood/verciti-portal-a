import { SupabaseClient } from "@supabase/supabase-js";


export async function getPlatformTotals(client: SupabaseClient){

    const {count:userTableCount, error:userTableError} = await client
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

    if(userTableError){
        console.error(userTableError);
    }

    console.log(userTableCount);


    // get all activities
    const { data: activities, error: activitiesError } = await client
        .from('activities')
        .select('id, external_title');

    if (activitiesError) {
        console.error(activitiesError);
        return;
    }

    // get all attempts
    const { data: attempts, error: attemptsError } = await client
        .from('generic_activity_attempts')
        .select('activity_id, user_id');

    if (attemptsError) {
        console.error(attemptsError);
        return;
    }

    // aggregate
    const activityStats = activities.map(activity => {
        const activityAttempts = attempts.filter(
            a => a.activity_id === activity.id
        );

        const uniqueUsers = new Set(
            activityAttempts.map(a => a.user_id)
        );

        return {
            activityId: activity.id,
            activityTitle: activity.external_title,
            totalAttempts: activityAttempts.length,
            numUsers: uniqueUsers.size
        };
    });

    const output = {
        totalUsers: userTableCount,
        activityStats
    };

    //console.log(output);

    return output;
}