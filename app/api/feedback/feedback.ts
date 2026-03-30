import { createClient, SupabaseClient } from '@supabase/supabase-js';

export async function addFeedback(client: SupabaseClient, formData: any){
    const inputData = {
        type: formData.get("type"),
        email_address: formData.get("email"),
        content: formData.get("content"),
        page: formData.get("page")
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