import { NextResponse } from 'next/server';
import { createServerTestClient, createServerLiveClient } from '@/lib/server';

function parseCommaSeparated(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== 'string') return [];

  return value
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);
}

export async function POST(req: Request) {
    // TODO: this is fine, create on test, then use other tool to copy to live
    const serverClient = await createServerTestClient();
    const { data: { user }, } = await serverClient.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.formData();

    const orgName = data.get('org_name') as string;
    const licenceCount = Number(data.get('lic_count')) || 0;
    const emailSuffixes = parseCommaSeparated(data.get('suffixes'));
    const emailAddresses = parseCommaSeparated(data.get('email_addresses'));
    const contentTags = parseCommaSeparated(data.get('content_tags'));
    contentTags.push("Free");    
    contentTags.push("Premium");
    

    const { error } = await serverClient.from(process.env.ORG_TABLE_NAME!).insert({
        id: orgName,
        licence_count: licenceCount,
        email_suffixes: emailSuffixes,
        email_addresses: emailAddresses,
        content_tags: contentTags,
        product: data.get('product'),
        renewal: data.get('renewal'),
    });

    if (error) {
        console.error("Error creating organization:", error);
        return NextResponse.json({ message: 'Error creating organization', error }, { status: 500 });
    }
    console.log("Organization created successfully");

    // find any existing users that match these suffixes or email addresses and update their content tags
    for(const suffix of emailSuffixes){
        const { data: matchedUsers, error: matchError } = await serverClient
            .from('user_profiles')
            .select('*')
            .contains('data->>email', `%${suffix}`);

        if (matchError) {
            console.error("Error finding matching users:", matchError);
        } else {
            console.log("Found matching users for suffix:", suffix);
        }

        for(const user of matchedUsers || []){
            const userContentTags = user.content_visibility || [];
            const newContentTags = Array.from(new Set([...userContentTags, ...contentTags]));

            const { error: updateError } = await serverClient
                .from('user_profiles')
                .update({ content_visibility: newContentTags, org_id: orgName })
                .eq('id', user.id);
            
            if (updateError) {
                console.error("Error updating user profile:", updateError);
            } else {
                console.log("Updated user profile with new content tags:", user.id);
            }
        }
    }
    // TODO: refactor these loops to avoid repeating the update logic
    for(const email of emailAddresses){
        const { data: matchedUsers, error: matchError } = await serverClient
            .from('user_profiles')
            .select('*')
            .eq('data->>email', email);

        if (matchError) {
            console.error("Error finding matching users:", matchError);
        } else {
            console.log("Found matching users for email:", email);
        }

        for(const user of matchedUsers || []){
            const userContentTags = user.content_visibility || [];
            const newContentTags = Array.from(new Set([...userContentTags, ...contentTags]));

            const { error: updateError } = await serverClient
                .from('user_profiles')
                .update({ content_visibility: newContentTags, org_id: orgName })
                .eq('id', user.id);

            if (updateError) {
                console.error("Error updating user profile:", updateError);
            } else {
                console.log("Updated user profile with new content tags:", user.id);
            }
        }
    }

    return NextResponse.json({ message: 'Organization created successfully' });
}



