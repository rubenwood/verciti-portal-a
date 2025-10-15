import { NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

const BUCKET = "com.verciti.app1";
const PREFIX = "dev/public/models/Testing/";

export async function GET(req: Request) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: PREFIX,
    })

    const { Contents } = await s3.send(command)
    const modelKeys = Contents?.filter(obj =>
      obj.Key?.endsWith('.glb') || obj.Key?.endsWith('.gltf')
    ) || []

    const models = await Promise.all(
      modelKeys.map(async (obj) => {
        const signedUrl = await getSignedUrl(s3, new GetObjectCommand({
          Bucket: BUCKET,
          Key: obj.Key!,
        }), { expiresIn: 600 })

        return {
          path: obj.Key!.replace(PREFIX, ''),
          url: signedUrl,
        }
      })
    )

    return NextResponse.json(models)
  } catch (err) {
    console.error('[S3 List Error]', err)
    return new NextResponse('Failed to list models', { status: 500 })
  }
}
