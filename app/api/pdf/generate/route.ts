import puppeteer from 'puppeteer-core';
import { chromium } from 'playwright';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest){
    const { html } = await req.json();

    if (!html) {
        return NextResponse.json({ error: 'Missing HTML input' });
    }

    const executablePath = chromium.executablePath();

    const browser = await puppeteer.launch({
        executablePath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
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