import { PostgrestError, SupabaseClient, User } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';


export async function getTalentSources(client: SupabaseClient, org_id: string){
    const { data, error } = await client.from('talent_source').select('*');

    if (error) {
        console.error('Error fetching talent sources:', error);
        return error;
    }

    return data as TalentSource[];
}