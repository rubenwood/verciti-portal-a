import { NextRequest, NextResponse } from 'next/server';
import { createServerTestClient } from '@/lib/server';

import { supabaseTest } from '@/lib/supabase';

// called by auth webhook
export async function POST(req: Request) {
    const request = await req.json();
    console.log("API call to check-email-access with request:", request);

    const email = request.record.data.email;
    const suffix = email.split('@')[1];
    
    const orgTableName = process.env.ORG_TABLE_NAME!;
    const sufColName = process.env.SUFF_COL!;
    const addrColName = process.env.ADDR_COL!;

    // will need to update this to use live
    const suffixMatch = supabaseTest.from(orgTableName).select('*').contains(sufColName, [suffix]);
    const emailAddressMatch = supabaseTest.from(orgTableName).select('*').contains(addrColName, [email]);
    console.log("suf match: ", suffixMatch);
    console.log("addr match:", emailAddressMatch);

    const response = {suffMatch:suffixMatch, addrMatch:emailAddressMatch};
    return NextResponse.json({ response });
}