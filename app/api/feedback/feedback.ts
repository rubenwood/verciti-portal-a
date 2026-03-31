import { createClient, SupabaseClient } from '@supabase/supabase-js';

export async function addFeedback(client: SupabaseClient, formData: any){
    const inputData = {
        type: formData.get("feedback-type"),
        email_address: formData.get("email"),
        operating_system: formData.get("operating-system"),
        content: formData.get("content"),
        page: formData.get("page"),
        activity_name: formData.get("module-name"),
    }

    const { data, error } = await client
        .from('bug_reports')
        .insert(inputData);

    if(error){
        console.error("Error adding feedback:", error);
        return { success: false, error };
    }

    return { success: true };
}