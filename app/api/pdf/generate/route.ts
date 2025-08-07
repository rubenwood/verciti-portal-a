import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest){
    const { html } = await req.json();

    if (!html) {
        return NextResponse.json({ error: 'Missing HTML input' });
    }

    

    return null;

}