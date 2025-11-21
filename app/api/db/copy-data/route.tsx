import { NextResponse } from "next/server";
import { supabaseTest, supabasePrivateMain } from "@/lib/supabase-test";

import { copyDataBetweenTables } from "../../../db/general/utils";

export async function POST(request: Request) {
    const { from, to, tables } = await request.json();

    console.log("Copying data from ", from, " to: ", to, " for tables: ", tables);

    const fromClient = from === "test" ? supabaseTest : supabasePrivateMain;
    const toClient   = to === "test" ? supabaseTest : supabasePrivateMain;

    console.log((await toClient.auth.getUser()))

    await copyDataBetweenTables(fromClient, toClient, tables);

    return NextResponse.json({ ok: true });
}
