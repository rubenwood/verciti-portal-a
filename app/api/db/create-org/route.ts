import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

function parseCommaSeparated(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== 'string') return [];

  return value
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);
}

export async function POST(req: Request) {
    const serverClient = await createClient();
    // dependant on the corresponding browser client
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

    const { error } = await serverClient.from('org_access').insert({
        id: orgName,
        licence_count: licenceCount,
        email_suffixes: emailSuffixes,
        email_addresses: emailAddresses,
        content_tags: contentTags,
        product: data.get('product'),
        renewal: data.get('renewal'),
    });

    if (!error) {
        console.log("Organization created successfully");
        return NextResponse.json({ message: 'Organization created successfully' });
    }
    console.error("Error creating organization:", error);
    return NextResponse.json({ message: 'Error creating organization', error }, { status: 500 });
}
