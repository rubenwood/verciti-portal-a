import { SupabaseClient } from "@supabase/supabase-js";

export async function getTotals(client: SupabaseClient, orgName:string){
    const { data, error } = await client.from(process.env.ORG_DATA_TABLE_NAME!)
        .select('*')
        .eq('id',orgName.toLowerCase())
        .single();

    if (error) {
        console.error("Error fetching totals:", error);
        return null;
    }

    console.log(data);

    return data;

}