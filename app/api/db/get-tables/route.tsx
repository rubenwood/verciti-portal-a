import { NextResponse } from "next/server";
import { supabaseTest } from "@/lib/supabase-test";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { branch, schema } = await request.json();

  const client = branch === "test" ? supabaseTest : supabase;

  const { data, error } = await client.rpc("list_tables", {
    schema_name: schema.toLowerCase(),
  });

  if (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = (data ?? []).map((t: any, i: number) => ({
    id: i,
    name: t.table_name,
  }));

  return NextResponse.json(results);
}
