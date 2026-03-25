import { NextResponse } from "next/server";
import { getPlatformTotals } from "../get-platform-totals";
import { createClient } from "@supabase/supabase-js";
import { createServerTestClient } from "@/lib/server";

export async function GET(req: Request) {
    const serverClient = await createServerTestClient();
    const { data: { user }, } = await serverClient.auth.getUser();
    
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseTestService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_TEST_URL!,
        process.env.SUPABASE_SEC_TEST_KEY!,
    )

    const output = await getPlatformTotals(supabaseTestService);

    return NextResponse.json(output);
}