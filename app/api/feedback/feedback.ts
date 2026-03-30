import { createClient, SupabaseClient } from '@supabase/supabase-js';

export async function addFeedback(client: SupabaseClient, formData: any){

    const inputData = {
        type: formData.type,
        email_address: formData.email,
        content: formData.content,
    }

    const { data, error } = await client
        .from('bug_reports')
        .insert(inputData);

    if(error){
        console.error("Error adding feedback:", error);
        return { success: false, error };
    }

    return { success: true, data };
}