import { NextRequest, NextResponse } from 'next/server';
import { SupabaseClient} from '@supabase/supabase-js';
import { supabaseTest } from '@/lib/supabase'

export async function POST(req: Request) {
    // check each user in badge progress

    const {data, error} = await supabaseTest.from('badge_progress').select('*');
    console.log("Badge Progress Data:", data, error);

    const json = await req.json();
    const uid = json.uid;
    const bid = json.bid;
    const kp1 = json.kp1;

    if (!uid || !bid || !kp1) {
        return new Response('Missing parameters', { status: 400 });
    }

    if(kp1 + process.env.KP2 !== process.env.KP3){
        return new Response('Unauthorized', { status: 401 });
    }

    const token = crypto.randomUUID();
    const qrString = `${uid}-${bid}-${token}`;

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrString)}`;
    console.log("Generated QR Code URL:", qrCodeUrl);

    return NextResponse.json({ qrCodeUrl });
}