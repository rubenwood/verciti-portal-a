import type { SupabaseClient } from '@supabase/supabase-js';

export type SupabaseClientWithKey = {
    key: string
    client: SupabaseClient
};
