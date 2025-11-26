import { NextResponse } from 'next/server';

export async function GET() {
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://','').split('.')[0];
  try {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/branches`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_PAT_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
        console.error(response);
      return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
    }

    const data = await response.json();

    const branches = data.map((b: any, i: number) => ({
      id: i,
      name: b.name,
    }));

    return NextResponse.json(branches);
  } catch (error: any) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
