import { NextResponse } from "next/server";
import { getTotals } from "../get-totals";
import { createClient } from "@supabase/supabase-js";
import { createServerLiveClient } from "@/lib/server";

export async function POST(req: Request) {
    const serverClient = await createServerLiveClient();
    const { data: { user }, } = await serverClient.auth.getUser();
    
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseLiveService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SEC_LIVE_KEY!,
    )
    const reqJson = await req.json();
    let orgName = reqJson.orgName;

    const output = await getTotals(supabaseLiveService, orgName);

    return NextResponse.json(output);
}