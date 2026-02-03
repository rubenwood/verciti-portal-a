import { NextRequest, NextResponse } from 'next/server';
//import { createServerTestClient } from '@/lib/server';
//import { supabaseTest } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

// called by auth webhook
export async function POST(req: Request) {
    const supabaseService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_TEST_URL!,
        process.env.SUPABASE_SEC_KEY!,
    )

    const request = await req.json();
    console.log("API call to check-email-access with request:", request);

    const userId = request.record.data.id;
    const email = request.record.data.email;
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
        // add content_tags to acc
        // using first result for now
        const contentTags = ["Production"]; // must always have prod
        contentTags.push(suffixMatch.data[0].content_tags);
        console.log("content tags: ", contentTags)
        // update the user account with these content tags
        const {data, error} = await supabaseService
        .from('user_profiiles')
        .update({content_visiblity:contentTags})
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