import { SupabaseClient } from "@supabase/supabase-js";
import { getUserFolder } from "../../db/general/utils";

export async function generateCertificate(client: SupabaseClient, certificateData: any) {
    //const folder = getUserFolder(userId, email);

    const resp = await fetch("https://api.pdfmonkey.io/api/v1/documents", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.PDF_MONKEY_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            document: {
                document_template_id: "89544C0C-29A3-4BA7-96FA-D8093244C847",
                payload: {
                    name: certificateData.name,
                    message: certificateData.message,
                    date: certificateData.date,
                },
            },
        }),
    });

    if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(`PDF generation failed: ${errorData.error}`);
    }

    const respJson = await resp.json();
    console.log("PDF Monkey response:", respJson), "\n";

    //const path = await uploadToStorage(client, folder);

    return respJson.document.preview_url;
}

async function uploadToStorage(client: SupabaseClient, folder: string, fileBuffer: Buffer) {
    const filePath = `dev/public/certificates/${folder}/certificate-${Date.now()}.pdf`;

    const { error } = await client.storage
        .from("certificates")
        .upload(filePath, fileBuffer, {
            contentType: "application/pdf",
        });

    if (error) throw error;

    return filePath;
}