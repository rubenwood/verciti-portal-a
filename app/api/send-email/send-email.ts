import { Resend } from "resend"
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(inFrom: string, inTo: string, inReplyTo: string, inSubject: string, inHtmlContent: string) {

    const resendResponse = await resend.emails.send({
      from: inFrom, 
      to: inTo,
      replyTo: inReplyTo,
      subject: inSubject,
      html: inHtmlContent
    });

    console.log(resendResponse);

    return resendResponse;

}
