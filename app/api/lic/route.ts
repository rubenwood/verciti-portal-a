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

    const response = {suffMatch:suffixMatch, addrMatch:emailAddressMatch};
    return NextResponse.json({ response });
}