import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const allowedOrigins = [
    "http://localhost:3000",
    process.env.VERCEL_URL
]

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin")
    if (!origin || !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const { email, tier, orgName, orgType } = await req.json()

    console.log("Received subscription request:", { email, tier, orgName, orgType })
    console.log("seding email")

    await resend.emails.send({
      from: "Verciti Sales Enquiry <onboarding@resend.dev>", 
      to: "ruben.wood@theblairproject.org",
      subject: "New Verciti Sales / Organisation Submission",
      html: `
        <h2>New Organisation Details</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Tier Interested In:</strong> ${tier}</p>
        <p><strong>Organisation Name:</strong> ${orgName}</p>
        <p><strong>Organisation Type:</strong> ${orgType}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}