import { NextRequest, NextResponse } from 'next/server';
import { createServerTestClient } from '@/lib/server';

import { supabaseTest } from '@/lib/supabase';

export async function POST(req: Request) {
    const request = await req.json();
    const email = request.email;
    const suffix = email.split('@')[1];

    const suffixMatch = supabaseTest.from('org_access').select('*').contains('email_suffixes', [suffix]);
    const emailAddressMatch = supabaseTest.from('org_access').select('*').contains('email_addresses', [email]);
    console.log("check for email:", email, "Result:", emailAddressMatch, suffixMatch);

    return NextResponse.json({ emailAddressMatch, suffixMatch });
}