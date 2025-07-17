import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

const BUCKET = "com.verciti.app1";

export async function POST(req: Request) {
  try {
    const reqJson = await req.json();
    console.log("Received request to upload Synthesia videos:\n", reqJson);
    const videos: SynthesiaVideo[] = reqJson.videos;
    const prefix: string = reqJson.filepath;

    if (!Array.isArray(videos) || videos.length === 0) {
      return new NextResponse('No videos provided', { status: 400 });
    }

    const uploaded: { title: string; key: string }[] = [];

    for (const video of videos) {
      const { title, download } = video;

      if (!title || !download) {
        console.warn('Missing title or download URL:', video);
        continue;
      }

      const response = await fetch(download);
      if (!response.ok) {
        console.error(`Failed to fetch ${title}:`, response.statusText);
        continue;
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const contentType = response.headers.get('content-type') || 'video/mp4';
      const filename = `${title}.mp4`;
      const key = `${prefix}/${filename}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: buffer,
          ContentType: contentType,
        })
      );

      uploaded.push({ title, key });
    }

    return NextResponse.json({ uploaded });
  } catch (err) {
    console.error('[Upload Synthesia Videos Error]', err);
    return new NextResponse('Upload failed', { status: 500 });
  }
}