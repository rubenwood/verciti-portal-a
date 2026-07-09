import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = "com.verciti.app1";

// Number of videos processed simultaneously
const CHUNK_SIZE = 5;

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
}

async function uploadVideo(
  video: SynthesiaVideo,
  prefix: string
): Promise<{ title: string; key: string } | null> {

  const startTime = Date.now();

  const { title, download } = video;

  console.log("=================================");
  console.log("Starting video upload");
  console.log({
    title,
    download,
    prefix,
  });

  if (!title || !download) {
    console.warn("Missing title or download URL", video);
    return null;
  }

  try {
    console.log(`[${title}] Downloading from Synthesia...`);

    const response = await fetch(download);

    console.log(`[${title}] Download response:`, {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
    });

    if (!response.ok) {
      console.error(
        `[${title}] Download failed`,
        response.status,
        response.statusText
      );

      return null;
    }

    const contentType =
      response.headers.get("content-type") ?? "video/mp4";


    // Prevent double .mp4 extension
    const filename = title.endsWith(".mp4")
      ? title
      : `${title}.mp4`;


    const key = `${prefix}/${filename}`;


    console.log(`[${title}] Generated S3 key:`, {
      bucket: BUCKET,
      key,
    });


    console.log(`[${title}] Reading video into memory...`);

    const arrayBuffer = await response.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);


    console.log(`[${title}] Video downloaded:`, {
      bytes: buffer.length,
      mb: (buffer.length / 1024 / 1024).toFixed(2),
    });


    console.log(`[${title}] Uploading to S3...`);


    const uploadResult = await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );


    console.log(`[${title}] S3 upload complete:`, {
      key,
      httpStatus:
        uploadResult.$metadata.httpStatusCode,
      etag: uploadResult.ETag,
    });


    const duration =
      ((Date.now() - startTime) / 1000).toFixed(2);


    console.log(`[${title}] Finished successfully in ${duration}s`);


    return {
      title,
      key,
    };


  } catch (err) {

    console.error(`[${title}] Upload failed:`, err);

    return null;
  }
}


export async function POST(req: Request) {

  const requestStart = Date.now();

  try {

    console.log("=================================");
    console.log("Received Synthesia upload request");


    const reqJson = await req.json();


    console.log("Request payload summary:", {
      videoCount: reqJson.videos?.length,
      filepath: reqJson.filepath,
    });


    const videos: SynthesiaVideo[] = reqJson.videos;

    const prefix: string = reqJson.filepath;


    console.log(
      "Video titles received:",
      videos?.map((v) => v.title)
    );


    if (!Array.isArray(videos) || videos.length === 0) {

      console.error("No videos provided");

      return new NextResponse(
        "No videos provided",
        { status: 400 }
      );
    }


    if (!prefix) {

      console.error("No filepath provided");

      return new NextResponse(
        "No filepath provided",
        { status: 400 }
      );
    }


    const uploaded: {
      title: string;
      key: string;
    }[] = [];


    const chunks = chunkArray(
      videos,
      CHUNK_SIZE
    );


    console.log("Upload plan:", {
      totalVideos: videos.length,
      chunkSize: CHUNK_SIZE,
      totalChunks: chunks.length,
      bucket: BUCKET,
      prefix,
    });



    for (const [index, chunk] of chunks.entries()) {


      const batchStart = Date.now();


      console.log("---------------------------------");
      console.log(
        `Starting batch ${index + 1}/${chunks.length}`
      );


      console.log(
        "Batch videos:",
        chunk.map(v => v.title)
      );


      const results = await Promise.all(
        chunk.map(video =>
          uploadVideo(video, prefix)
        )
      );


      const successfulUploads =
        results.filter(
          (
            r
          ): r is {
            title: string;
            key: string;
          } =>
            r !== null
        );


      uploaded.push(
        ...successfulUploads
      );


      console.log(
        `Finished batch ${index + 1}/${chunks.length}`,
        {
          uploadedInBatch:
            successfulUploads.length,
          batchDurationSeconds:
            (
              (Date.now() - batchStart) /
              1000
            ).toFixed(2),
        }
      );
    }


    const totalDuration =
      (
        (Date.now() - requestStart) /
        1000
      ).toFixed(2);



    console.log("Upload request completed:", {
      totalRequested: videos.length,
      totalUploaded: uploaded.length,
      durationSeconds: totalDuration,
      uploaded,
    });



    return NextResponse.json({

      uploaded,

      totalUploaded:
        uploaded.length,

      totalRequested:
        videos.length,

      durationSeconds:
        totalDuration,
    });


  } catch (err) {

    console.error(
      "[Upload Synthesia Videos Error]",
      err
    );


    return new NextResponse(
      "Upload failed",
      {
        status: 500,
      }
    );
  }
}