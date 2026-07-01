import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function GET(req: NextRequest) {
    const prefix = req.nextUrl.searchParams.get("prefix");
    if (!prefix) {
        return NextResponse.json({ error: "Missing prefix" }, { status: 400 });
    }

    const bucket = process.env.AWS_S3_BUCKET!;
    // Normalize: strip leading slash, ensure trailing slash
    const normalizedPrefix = prefix.replace(/^\/+/, "").replace(/\/*$/, "/");

    try {
        const result = await s3.send(
            new ListObjectsV2Command({ Bucket: bucket, Prefix: normalizedPrefix })
        );

        const videos = (result.Contents ?? [])
            .filter((obj) => obj.Key?.toLowerCase().endsWith(".mp4"))
            .map((obj) => ({ key: obj.Key!, size: obj.Size ?? 0 }));

        console.log(`Listed ${videos.length} videos in S3 folder ${normalizedPrefix}`);

        return NextResponse.json({ videos });
    } catch (err) {
        console.error("Failed to list S3 folder", err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}