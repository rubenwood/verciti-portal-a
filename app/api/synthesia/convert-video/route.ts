import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import { writeFile, readFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { randomUUID } from "crypto";
import type { Readable } from "stream";

ffmpeg.setFfmpegPath(ffmpegPath.path);

// Adjust based on your plan — see caveats below
export const maxDuration = 300;

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET = process.env.AWS_S3_BUCKET!;

export async function POST(req: NextRequest) {
    const { key } = await req.json();
    if (!key) {
        return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    const id = randomUUID();
    const inputPath = path.join(tmpdir(), `in-${id}.mp4`);
    const outputPath = path.join(tmpdir(), `out-${id}.mp4`);

    try {
        // Download original from S3
        const obj = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
        const body = obj.Body as Readable;
        const chunks: Buffer[] = [];
        for await (const chunk of body) chunks.push(chunk as Buffer);
        await writeFile(inputPath, Buffer.concat(chunks));

        // Convert: mirrors -vf scale=1920:1080 -b:v 1500k -c:a copy
        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputPath)
                .videoFilters("scale=1920:1080")
                .videoBitrate("1500k")
                .audioCodec("copy")
                .on("end", () => resolve())
                .on("error", reject)
                .save(outputPath);
        });

        // Overwrite original key in S3
        const outputBuffer = await readFile(outputPath);
        await s3.send(
            new PutObjectCommand({
                Bucket: BUCKET,
                Key: key,
                Body: outputBuffer,
                ContentType: "video/mp4",
            })
        );

        return NextResponse.json({ success: true, key, size: outputBuffer.length });
    } catch (err) {
        console.error(`Conversion failed for ${key}`, err);
        return NextResponse.json({ error: String(err), key }, { status: 500 });
    } finally {
        await unlink(inputPath).catch(() => {});
        await unlink(outputPath).catch(() => {});
    }
}