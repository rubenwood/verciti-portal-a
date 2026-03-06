import { SupabaseClient } from "@supabase/supabase-js";

export async function attributeLicence(req: Request, supabaseService: SupabaseClient){
    const request = await req.json();
    const userId = request.record.id;
    const email = request.record.data.email.toLowerCase();
    console.log("email: ", email);
    const suffix = email.split('@')[1];
    
    const orgTableName = process.env.ORG_TABLE_NAME!;
    const sufColName = process.env.SUFF_COL!;
    const addrColName = process.env.ADDR_COL!;

    // will need to update this to use live
    const suffixMatch = await supabaseService.from(orgTableName).select('*').contains(sufColName, [suffix]);
    const emailAddressMatch = await supabaseService.from(orgTableName).select('*').contains(addrColName, [email]);
    console.log("suf match: ", suffixMatch);
    console.log("addr match:", emailAddressMatch);

    if(suffixMatch.data){
        // add content_tags to acc, using first result for now
        const orgId = suffixMatch.data[0].id;
        const tagsFromOrg = suffixMatch.data[0].content_tags ?? [];
        const newContentTags = Array.from(
            new Set(["Production", ...tagsFromOrg])
        ); // must always have production

        // update the user account with these content tags
        const {data, error} = await supabaseService
        .from('user_profiles')
        .update({content_visibility:newContentTags, org_id: orgId})
        .eq('id', userId);

        if(error){
            console.error("Error updating content tags: ", error);
        }else{
            console.log("Success updating content tags: ", data);
        }
    }

    return {suffMatch:suffixMatch, addrMatch:emailAddressMatch};
}