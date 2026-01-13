import { PostgrestError, SupabaseClient, User } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';
import type { RefObject } from 'react';

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

export async function getUsersProgressByVisibility(client: SupabaseClient, contentVisibility: string) {
    // this query gets the user profiles that have a specific content visibility
    // and it also gets their associated generic activity progress
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

export async function getUserAttempts(client: SupabaseClient, user_ids: string[], page: number = 0) {
    const { count, error: errorCount } = await client
        .from('generic_activity_attempts')
        .select('*',  { count: 'exact', head: true });

    if (errorCount) {
        console.error("Error fetching attempts count:", errorCount);
        return [];
    }
    console.log("Total attempts count:", count);

    const pageSize = 1000; // this may change, check supabase
    const pageCount = Math.ceil((count || 0) / 1000);
    

    const { data, error } = await client
        .from('generic_activity_attempts')
        .select('*')
        .in('user_id', user_ids)
        .range(0, 1000);

    if (error) {
        console.error("Error fetching user attempts:", error);
        return [];
    }
    return data as any[];
}