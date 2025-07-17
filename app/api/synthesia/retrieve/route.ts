import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const reqJson = await req.json();
    console.log("Received request to download video:", reqJson);

    const response = await fetch(`https://api.synthesia.io/v2/videos${reqJson.videoId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.SYNTHESIA_KEY!,
        }
    });

    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data);
}
