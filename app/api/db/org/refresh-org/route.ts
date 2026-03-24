import { NextResponse } from 'next/server';
import { createServerTestClient, createServerLiveClient } from '@/lib/server';

// this will refresh (apply licences) to users in a specific org
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


    const orgTableName = process.env.ORG_TABLE_NAME!;
    let updatedUsers = 0;

    const { data: users, error: userError } = await serverClient
      .from("user_profiles")
      .select("id, data, org_id, content_visibility");

    if (userError) throw userError;

    for (const user of users ?? []) {
        const email = user.data.email?.toLowerCase();
        if (!email) continue;

        const suffix = email.split("@")[1];

        
        const { data: suffixMatch } = await serverClient
            .from(orgTableName)
            .select("*")
            .contains(process.env.SUFF_COL!, [suffix])
            .maybeSingle();

        const { data: emailMatch } = await serverClient
            .from(orgTableName)
            .select("*")
            .contains(process.env.ADDR_COL!, [email])
            .maybeSingle();

        const match = emailMatch ?? suffixMatch;

        const newOrgId = match?.id ?? null;
        const newTags = match
            ? Array.from(new Set(["Free", "Premium", ...(match.content_tags ?? [])]))
            : ["Free"];

        const orgChanged = user.org_id !== newOrgId;
        const tagsChanged =
            JSON.stringify(user.content_visibility ?? []) !==
            JSON.stringify(newTags);

        if (!orgChanged && !tagsChanged) continue;

        const { error: updateError } = await serverClient
            .from("user_profiles")
            .update({
                org_id: newOrgId,
                content_visibility: newTags,
            })
            .eq("id", user.id);

        if (updateError) {
            console.error("Error updating user:", user.id, updateError);
            continue;
        }

        updatedUsers++;
    }

    // recompute licence counts
    const { data: orgs, error: orgError } = await serverClient
      .from(orgTableName)
      .select("id");

    if (orgError) throw orgError;

    for (const org of orgs ?? []) {
      const { count } = await serverClient
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .eq("org_id", org.id);

      await serverClient
        .from(orgTableName)
        .update({ lic_used: count ?? 0 })
        .eq("id", org.id);
    }

    return NextResponse.json({
      success: true,
      updatedUsers,
      message: "Licences recomputed",
    });

}