import { NextResponse } from "next/server";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";

export async function POST(req: Request) {
    try {
        const { user, folder } = await req.json();

        if(!user){
            return NextResponse.json(
                { success: false, error: "Unauthenticated" },
                { status: 403 }
            );
        }

        if(!process.env.SUPABASE_USER_IDS?.includes(user.id)){
            return NextResponse.json(
                { success: false, error: "Invalid user" },
                { status: 403 }
            );
        }

        if (!folder) {
            return NextResponse.json(
                { success: false, error: "Folder path is required" },
                { status: 400 }
            );
        }

        const invalidatePath = `${folder}/*`;

        const client = new CloudFrontClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });

        const command = new CreateInvalidationCommand({
            DistributionId: process.env.AWS_CD_DIST_ID!,
            InvalidationBatch: {
                CallerReference: Date.now().toString(),
                Paths: {
                    Quantity: 1,
                    Items: [invalidatePath],
                },
            },
        });

        const result = await client.send(command);

        return NextResponse.json({
            success: true,
            invalidated: invalidatePath,
            result,
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
