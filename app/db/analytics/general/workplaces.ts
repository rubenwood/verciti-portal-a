import { PostgrestError, SupabaseClient, User } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';


export async function getWorkPlaces(client: SupabaseClient, org_id: string): Promise<Workplace[]>{
    const { data, error } = await client.from('workplaces').select('*');

    if (error) {
        console.error('Error fetching workplaces:', error);
        throw error;
    }

    return data as Workplace[];
}