import { NextResponse } from "next/server";
import { getPlatformTotals } from "../get-platform-totals";
import { createClient } from "@supabase/supabase-js";
import { createServerLiveClient } from "@/lib/server";

export async function GET(req: Request) {
    const serverClient = await createServerLiveClient();
    const { data: { user }, } = await serverClient.auth.getUser();
    
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseLiveService = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SEC_LIVE_KEY!,
    )


    const output = await getPlatformTotals(supabaseLiveService);

    return NextResponse.json(output);
}