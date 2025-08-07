import chromium from 'chrome-aws-lambda';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest){
    const { html } = await req.json();

    if (!html) {
        return NextResponse.json({ error: 'Missing HTML input' });
    }

    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    const pdfBuffer = await page.pdf({
      format: 'a4',
      printBackground: true,
      margin:{
        top:20,
        bottom:20,
        left:20,
        right:20,
      }
    });

    await browser.close();

    return new Response(pdfBuffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="generated.pdf"',
        }
    })

}