import { SupabaseClient } from "@supabase/supabase-js";

export async function updatePlatformTotals(client: SupabaseClient) {

    const now = new Date();

    // start of today (UTC)
    const startOfToday = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
    ));

    // start of yesterday (UTC)
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setUTCDate(startOfYesterday.getUTCDate() - 1);


    const { count: totalUsers, error: userError } = await client
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

    if (userError) {
        console.error(userError);
        return;
    }

    const { count: totalActivityAttempts, error: attemptsError } = await client
        .from('generic_activity_attempts')
        .select('*', { count: 'exact', head: true });

    if (attemptsError) {
        console.error(attemptsError);
        return;
    }


    const { count: activityAttemptsToday, error:activityAttemptsTodayError } = await client
        .from('generic_activity_attempts')
        .select('*', { count: 'exact', head: true })
        .gte('attempted_at', startOfYesterday.toISOString())
        .lt('attempted_at', startOfToday.toISOString());

    const { count: quizAttemptsToday, error:quizAttemptsTodayError } = await client
        .from('quiz_attempts')
        .select('*', { count: 'exact', head: true })
        .gte('attempted_at', startOfYesterday.toISOString())
        .lt('attempted_at', startOfToday.toISOString());



    const { data: lastEntry, error: lastEntryError } = await client
        .from('platform_wide_data')
        .select('total_users')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (lastEntryError) {
        console.error(lastEntryError);
        return;
    }

    let newUsers = 0;

    if (lastEntry) {
        newUsers = (totalUsers || 0) - (lastEntry.total_users || 0);
    } else {
        // first run
        newUsers = totalUsers || 0;
    }

    // prevent negative (just in case of data resets)
    if (newUsers < 0) newUsers = 0;


    const { data: result, error: insertError } = await client
        .from('platform_wide_data')
        .insert({
            total_users: totalUsers,
            total_activity_attempts: totalActivityAttempts,
            daily_activity_attempts:activityAttemptsToday,
            daily_quiz_attempts:quizAttemptsToday,
            new_users: newUsers,
        })
        .select();

    if (insertError) {
        console.error(insertError);
        return;
    }

    console.log(result);

    return result;
}