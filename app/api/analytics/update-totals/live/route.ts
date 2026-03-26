import { NextResponse } from "next/server";
import { updateTotals } from "../update-totals";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    const sec = req.headers.get('x-webhook-secret');
    if (sec !== process.env.API_SEC_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseLiveService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SEC_LIVE_KEY!,
    )

    const output = await updateTotals(supabaseLiveService);

    return NextResponse.json(output);
}