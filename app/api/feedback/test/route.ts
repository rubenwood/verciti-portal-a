import { addFeedback } from "../feedback";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    // need to add some rate limiting here

    const supabaseTestService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_TEST_URL!,
        process.env.SUPABASE_SEC_TEST_KEY!,
    )

    const formData = await req.formData();
    const output = await addFeedback(supabaseTestService, formData);

    return NextResponse.json(output);
}