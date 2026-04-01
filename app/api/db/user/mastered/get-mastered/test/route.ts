import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getMasteredCourseActivityIds } from "../../mastered";

export async function POST(req: Request) {
    const sec = req.headers.get('x-webhook-secret');
    if (sec !== process.env.API_SEC_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseTestService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_TEST_URL!,
        process.env.SUPABASE_SEC_TEST_KEY!,
    )

    const body = await req.json();
    console.log("Received request:", body);

    const output = await getMasteredCourseActivityIds(supabaseTestService, body.id);

    return NextResponse.json(output);
}