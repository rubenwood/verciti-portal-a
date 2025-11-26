import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Hardcoded mapping from key → Supabase project_ref (used to identify branch)
  const keyToProjectRef: Record<string, string> = {
    live: process.env.NEXT_PUBLIC_SUPABASE_URL!.replace('https://', '').split('.')[0],
    test: process.env.NEXT_PUBLIC_SUPABASE_TEST_URL!.replace('https://', '').split('.')[0],
    // Add more clients here if needed
  };

  const { clients }: { clients: { key: string }[] } = await req.json();

  // Fetch all branches
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace('https://', '').split('.')[0];

  const branchesRes = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/branches`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_PAT_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const branches = await branchesRes.json();

  // Map each branch to a client key
  const mapping: { branch: string; clientKey: string }[] = [];

  for (const branch of branches) {
    for (const client of clients) {
      const clientProjectRef = keyToProjectRef[client.key];
      if (!clientProjectRef) continue;

      if (branch.project_ref === clientProjectRef) {
        mapping.push({
          branch: branch.name,
          clientKey: client.key,
        });
      }
    }
  }

  return NextResponse.json({ mapping });
}
