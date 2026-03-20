import { NextResponse } from "next/server";
import { updateTotals } from "../update-totals";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    const sec = req.headers.get('x-webhook-secret');
    // if (sec !== process.env.API_SEC_KEY) {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const supabaseTestService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_TEST_URL!,
        process.env.SUPABASE_SEC_TEST_KEY!,
    )
    const reqJson = await req.json();
    let orgName = reqJson.orgName;

    const output = await updateTotals(supabaseTestService, orgName);

    return NextResponse.json(output);
}