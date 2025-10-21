import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      `https://api.supabase.io/v1/projects/${process.env.SUPABASE_PROJECT_REF}/branches`,
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
