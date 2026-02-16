import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// called by auth webhook (user profile created / sign up)
export async function POST(req: Request) {
    const sec = req.headers.get('x-webhook-secret');
    if (sec !== process.env.API_SEC_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_TEST_URL!,
        process.env.SUPABASE_SEC_KEY!,
    )

    const request = await req.json();
    console.log("API call to check-email-access with request:", request);

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

    

    const response = {suffMatch:suffixMatch, addrMatch:emailAddressMatch};
    return NextResponse.json({ response });
}