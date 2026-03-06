import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { attributeLicence } from '../lic-attribution';

// called by auth webhook (user profile created / sign up)
export async function POST(req: Request) {
    const sec = req.headers.get('x-webhook-secret');
    if (sec !== process.env.API_SEC_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseLiveService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SEC_LIVE_KEY!,
    )

    const request = await req.json();
    console.log("API call to check-email-access with request:", request);

    const output = await attributeLicence(req, supabaseLiveService);

    const response = { output };
    return NextResponse.json({ response });

}