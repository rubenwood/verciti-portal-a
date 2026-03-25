import { createServerLiveClient, createServerTestClient } from "@/lib/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const reqJson = await req.json();
    const client = reqJson.clientString;
    const orgId = reqJson.orgId;

    let serverClient;
    if(client === 'test'){
        serverClient = await createServerTestClient();
    }else{
        serverClient = await createServerLiveClient();
    }
    const { data: { user }, } = await serverClient.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }


    const {data, error} = await serverClient
        .from(process.env.ORG_TABLE_NAME!)
        .select('*')


    return NextResponse.json({ data, error});
}