import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const response = await fetch('https://api.synthesia.io/v2/videos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.SYNTHESIA_KEY!,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data);
}
