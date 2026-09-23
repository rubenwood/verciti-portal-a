import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "stream";

const s3 = new S3Client({
    region: "eu-west-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
});

const BUCKET = "com.verciti.app1";

async function uploadVideoToS3(
    downloadUrl: string,
    s3Key: string
) {
    const response = await fetch(downloadUrl);


    if (!response.ok || !response.body) {
        throw new Error(
            `Failed downloading video (${response.status})`
        );
    }


    const nodeStream = Readable.fromWeb(
        response.body as any
    );


    console.log(
        "Starting S3 multipart upload..."
    );


    const upload = new Upload({
        client: s3,

        params: {
            Bucket: BUCKET,
            Key: s3Key,
            Body: nodeStream,
            ContentType: "video/mp4",
        },

        queueSize: 1,
        partSize: 5 * 1024 * 1024,

        leavePartsOnError: false,
    });


    upload.on(
        "httpUploadProgress",
        (progress) => {
            console.log(
                "S3 progress:",
                progress
            );
        }
    );


    await upload.done();


    console.log(
        `Uploaded to S3: ${s3Key}`
    );


    return `s3://${BUCKET}/${s3Key}`;
}



export async function POST(req: Request) {
    try {
        const { videos, filepath } = await req.json();



        if (!videos || !Array.isArray(videos)) {
            return NextResponse.json(
                {
                    error: "Missing videos array"
                },
                {
                    status: 400
                }
            );
        }


        if (!filepath) {
            return NextResponse.json(
                {
                    error: "Missing filepath"
                },
                {
                    status: 400
                }
            );
        }
        console.log(`Uploading ${videos.length} videos to S3`);

        const uploaded = [];
        const failed = [];

        for (const video of videos) {
            try {
                console.log(`Uploading video: ${video.title}`);

                const downloadUrl = video.download;
                if (!downloadUrl) {
                    throw new Error(
                        "Missing Synthesia download URL"
                    );
                }

                const filename = `${video.title}.mp4`;
                const cleanPath = filepath.replace(/^\/+|\/+$/g, "");
                const s3Key = `${cleanPath}/${filename}`;

                console.log(`Downloading from: ${downloadUrl}`);
                const s3Path = await uploadVideoToS3(downloadUrl, s3Key);

                uploaded.push({
                    id: video.id,
                    title: video.title,
                    s3Path,
                    s3Key
                });

                console.log(`Uploaded ${video.title}`);
            } catch (error) {
                console.error(`Failed uploading ${video.title}`, error);

                failed.push({
                    id: video.id,
                    title: video.title,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Unknown error"
                });
            }
        }

        return NextResponse.json({
            uploaded,
            failed
        });


    } catch (error) {

        console.error(
            "Upload endpoint error:",
            error
        );


        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error"
            },
            {
                status: 500
            }
        );
    }
}