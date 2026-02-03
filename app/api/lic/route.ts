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
    console.log("check for email:", email, "Result:", emailAddressMatch, suffixMatch);

    const response = {suffMatch:suffixMatch, addrMatch:emailAddressMatch};
    return NextResponse.json({ response });
}
/*

API call to check-email-access with request: {
  type: 'INSERT',
  table: 'user_profiles',
  record: {
    id: 'e0b7d3eb-8f24-4526-b308-07aa7ebd3300',
    data: { email: 'test123@test.com' },
    org_id: null,
    devices: null,
    created_at: '2026-02-03T13:44:06.871046+00:00',
    last_login: '0001-01-01T00:00:00+00:00',
    login_streak: null,
    total_logins: 0,
    current_course: '00000000-0000-0000-0000-000000000000',
    activity_streak: null,
    previous_logins: null,
    total_usage_time: 0,
    content_visibility: [ 'Production' ]
  },
  schema: 'public',
  old_record: null
}
*/