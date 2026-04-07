import { SupabaseClient } from "@supabase/supabase-js";

export async function attributeLicence(request: any, supabaseService: SupabaseClient) {
    const userId = request.record.id;

    const { data: existingUser, error: fetchError } = await supabaseService
        .from('user_profiles')
        .select('content_visibility, has_server_set_data')
        .eq('id', userId)
        .single();

    if (fetchError) {
        console.error("Error fetching user profile:", fetchError);
        return;
    }

    const currentTags = existingUser?.content_visibility ?? [];

    const baseTags = Array.from(new Set([
        ...currentTags,
        "Free"
    ]));

    await supabaseService
        .from('user_profiles')
        .update({ content_visibility: baseTags })
        .eq('id', userId);

    const rawEmail = request.record.data.email;
    const email = (rawEmail ? rawEmail.toLowerCase() : "default@unknown.com");
    const suffix = email.split('@')[1];

    console.log("email:", email);

    const orgTableName = process.env.ORG_TABLE_NAME!;
    const sufColName = process.env.SUFF_COL!;
    const addrColName = process.env.ADDR_COL!;

    const [suffixMatch, emailAddressMatch] = await Promise.all([
        supabaseService.from(orgTableName).select('*').contains(sufColName, [suffix]),
        supabaseService.from(orgTableName).select('*').contains(addrColName, [email])
    ]);

    console.log("suffix match:", suffixMatch);
    console.log("email match:", emailAddressMatch);

    const match = suffixMatch.data?.[0] || emailAddressMatch.data?.[0];

    if (match) {
        const orgId = match.id;
        const tagsFromOrg = match.content_tags ?? [];

        await setupData(supabaseService, userId, orgId, tagsFromOrg);
    }

    const { error: flagError } = await supabaseService
        .from('user_profiles')
        .update({ has_server_set_data: true })
        .eq('id', userId)
        .is('has_server_set_data', false);

    if (flagError) {
        console.error("Error setting account flag:", flagError);
    } else {
        console.log("has_server_set_data set to true");
    }

    return {
        suffMatch: suffixMatch,
        addrMatch: emailAddressMatch
    };
}

async function setupData(
    supabaseService: SupabaseClient,
    userId: string,
    orgId: string,
    tagsFromOrg: string[]
) {
    const { data: existingUser, error: fetchError } = await supabaseService
        .from('user_profiles')
        .select('content_visibility')
        .eq('id', userId)
        .single();

    if (fetchError) {
        console.error("Error fetching user before update:", fetchError);
        return;
    }

    const mergedTags = Array.from(new Set([
        ...(existingUser?.content_visibility ?? []),
        "Free",
        "Premium",
        ...tagsFromOrg
    ]));

    const { error: updateError } = await supabaseService
        .from('user_profiles')
        .update({
            content_visibility: mergedTags,
            org_id: orgId
        })
        .eq('id', userId);

    if (updateError) {
        console.error("Error updating content tags:", updateError);
    } else {
        console.log("Updated user tags safely");
    }

    // --- LICENCE COUNT ---
    const { data: licUsedData, error: licUsedError } = await supabaseService
        .from(process.env.ORG_TABLE_NAME!)
        .select('lic_used')
        .eq('id', orgId)
        .single();

    if (licUsedError) {
        console.error("Error getting lic count:", licUsedError);
        return;
    }

    let licUsed = licUsedData?.lic_used;

    if (licUsed === null || licUsed === undefined) {
        console.error("lic_used is null/undefined");
        return;
    }
    const { error: licError } = await supabaseService
        .from(process.env.ORG_TABLE_NAME!)
        .update({ lic_used: licUsed + 1 })
        .eq('id', orgId);

    if (licError) {
        console.error("Error updating lic count:", licError);
    } else {
        console.log("Licence count incremented");
    }
}