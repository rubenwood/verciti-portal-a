import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// called by webhook (org updated)
export async function POST(req: Request) {
    const sec = req.headers.get('x-webhook-secret');
    if (sec !== process.env.API_SEC_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log("req: ", req);

        const body = await req.json();
        const emailSuffixes: string[] = body.email_suffixes ?? [];
        const emailAddresses: string[] = body.email_addresses ?? [];
        const contentTags: string[] = body.content_tags ?? [];

        // Always enforce Production
        if (!contentTags.includes("Production")) {
            contentTags.push("Production");
        }

        const updateProfilesResp = await updateMatchingUserProfiles(
            emailSuffixes,
            emailAddresses,
            contentTags
        );

        console.log("updated profiles response:", updateProfilesResp);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Webhook org update error:", err);
        return NextResponse.json(
            { error: "Failed to process webhook" },
            { status: 500 }
        );
    }
}

async function updateMatchingUserProfiles(emailSuffixes: string[], emailAddresses: string[], contentTags: string[]) {
  if (!emailSuffixes.length && !emailAddresses.length) {
    return { updated: 0, responses: [] };
  }

  const supabaseService = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_TEST_URL!,
    process.env.SUPABASE_SEC_KEY!
  );

  const suffixFilters = emailSuffixes.map(
    suffix => `%@${suffix}`
  );

  type UserProfile = {
    id: string;
    email: string;
    content_visibility: string[] | null;
  };

  let query = supabaseService
    .from('user_profiles')
    .select('id, data, content_visibility');

  if (emailAddresses.length > 0 && suffixFilters.length > 0) {
    query = query.or(
      [
        `data.email.in.(${emailAddresses.join(',')})`,
        ...suffixFilters.map(s => `data.email.ilike.${s}`)
      ].join(',')
    );
  } else if (emailAddresses.length > 0) {
    query = query.in('data.email', emailAddresses);
  } else if (suffixFilters.length > 0) {
    query = query.or(
      suffixFilters.map(s => `data.email.ilike.${s}`).join(',')
    );
  }

  const { data: matchingUsers, error } =
    await query as { data: UserProfile[] | null, error: any };

  if (error) throw error;

  const responses = [];

  for (const profile of matchingUsers ?? []) {
    const existingTags: string[] = profile.content_visibility ?? [];

    const mergedTags = Array.from(
      new Set([
        ...existingTags,
        ...contentTags,
        "Production",
      ])
    );

    const response = await supabaseService
      .from('user_profiles')
      .update({ content_visibility: mergedTags })
      .eq('id', profile.id)
      .select();

    if (response.error) {
      throw response.error;
    }

    responses.push(response);
  }

  return {
    updated: responses.length,
    responses
  };
}
