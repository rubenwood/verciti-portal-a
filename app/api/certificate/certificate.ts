import { SupabaseClient } from "@supabase/supabase-js";
import { getUserFolder } from "../../db/general/utils";

export async function generateCertificate(client: SupabaseClient, certificateData: any) {
    certificateData.templateId = "89544C0C-29A3-4BA7-96FA-D8093244C847";
    const pdfResp = await generatePDF(certificateData);

    if (!pdfResp.ok) {
        const errorData = await pdfResp.json();
        throw new Error(`PDF generation failed: ${errorData.error}`);
    }

    const respJson = await pdfResp.json();
    console.log("PDF Monkey response:", respJson), "\n";

    const hash = getUserFolder(certificateData.uid);
    //const path = await uploadToStorage(client, hash, null);

    // need to also send an email with this certificate
    // ensure they are scheduled and rate limited properly

    const response = {
        folder: hash,
        preview_url: respJson.document.preview_url,
    }

    return response;
}

async function generatePDF(certificateData: any) {
    const resp = await fetch("https://api.pdfmonkey.io/api/v1/documents", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.PDF_MONKEY_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            document: {
                document_template_id: certificateData.templateId,
                payload: {
                    name: certificateData.name,
                    message: certificateData.message,
                    date: certificateData.date,
                },
            },
        }),
    });

    return resp;
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