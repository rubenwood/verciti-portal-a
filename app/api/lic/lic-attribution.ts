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

    const suffixMatch = await supabaseService.from(orgTableName).select('*').contains(sufColName, [suffix]);
    const emailAddressMatch = await supabaseService.from(orgTableName).select('*').contains(addrColName, [email]);
    console.log("suf match: ", suffixMatch);
    console.log("addr match:", emailAddressMatch);

    if(suffixMatch.data){
        // add content_tags to acc, using first result for now
        const orgId = suffixMatch.data[0].id;
        const tagsFromOrg = suffixMatch.data[0].content_tags ?? [];
        const newContentTags = Array.from(
            new Set(["Free", "Premium", ...tagsFromOrg])
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

        // update the remaining licence count
        const {data:licRemainData, error:licRemainError} = await supabaseService
            .from(`${process.env.ORG_TABLE_NAME}`)
            .select('lic_remain')
            .eq('id', orgId);

        if(licRemainError){
            console.error("Error getting  lic count: ", licRemainError);
        }else{
            console.log("Success getting lic count: ", licRemainData);
        }

        const licRemain = licRemainData?.[0]?.lic_remain;
        
        if(licRemain === null || licRemain === undefined){
            console.error("Error: lic_remain is null or undefined");
            return {suffMatch:suffixMatch, addrMatch:emailAddressMatch};
        }

        const {data:licData, error:licError} = await supabaseService
            .from(`${process.env.ORG_TABLE_NAME}`)
            .update({lic_remain:(licRemain-1)})
            .eq('id', orgId);

        if(licError){
            console.error("Error updating lic count: ", licError);
        }else{
            console.log("Success updating lic count: ", licData);
        }
    }

    return {suffMatch:suffixMatch, addrMatch:emailAddressMatch};
}