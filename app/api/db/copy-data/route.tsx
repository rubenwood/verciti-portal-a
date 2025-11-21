import { NextResponse } from "next/server";
import { supabaseTest } from "@/lib/supabase-test";
import { supabase } from "@/lib/supabase";

import { copyDataBetweenTables } from "../../../db/general/utils";

export async function POST(request: Request) {
    const { from, to, tables } = await request.json();

    console.log("Copying data from ", from, " to: ", to, " for tables: ", tables);

    const fromClient = from === "test" ? supabaseTest : supabase;
    const toClient   = to === "test" ? supabaseTest : supabase;

    await copyDataBetweenTables(fromClient, toClient, tables);

    return NextResponse.json({ ok: true });
}
