import { SupabaseClient } from "@supabase/supabase-js";

export async function attributeLicence(request: any, supabaseService: SupabaseClient){
    const userId = request.record.id;
    const {data, error} = await supabaseService
        .from('user_profiles')
        .update({content_visibility:["Free"]}) // force the free content tag
        .eq('id', userId);

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
        );

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
            return {licRemain:licRemain};
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

    if(emailAddressMatch.data){

    }


    const {data:flagData, error:flagError} = await supabaseService
        .from('user_profiles')
        .update({has_server_set_data:true})
        .eq('id', userId);

    if(flagError){
        console.error("Error setting account flag: ", flagError);
    }else{
        console.error("Success setting account flag: ", flagData);
    }

    return {suffMatch:suffixMatch, addrMatch:emailAddressMatch};
}