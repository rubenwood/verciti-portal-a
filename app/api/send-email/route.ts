import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const allowedOrigins = [
  "http://localhost:3000",
    process.env.VERCEL_URL,
    process.env.VERCEL_APP_URL
].filter(Boolean) as string[]

type RateRecord = {
  count: number
  windowStart: number
}

const rateLimitMap = new Map<string, RateRecord>()

const MAX_REQUESTS = 5
const WINDOW_MS = (60 * 1000) * 2 // 2 minutes

function cleanOldEntries() {
  const now = Date.now()
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.windowStart > WINDOW_MS) {
      rateLimitMap.delete(ip)
    }
  }
}

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin")
    
    console.log(origin);

    if (!origin || !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: "Unauthorized - bad origin" },
        { status: 403 }
      )
    }


    // rate limiting
    const forwardedFor = req.headers.get("x-forwarded-for")
    const ip = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : "unknown"

    const now = Date.now()

    cleanOldEntries()

    const record = rateLimitMap.get(ip)

    if (record) {
      if (now - record.windowStart < WINDOW_MS) {
        if (record.count >= MAX_REQUESTS) {
          return NextResponse.json(
            { error: "Too many requests. Please try again shortly." },
            { status: 429 }
          )
        }
        record.count += 1
      } else {
        rateLimitMap.set(ip, { count: 1, windowStart: now })
      }
    } else {
      rateLimitMap.set(ip, { count: 1, windowStart: now })
    }
    //

    const { email, tier, orgName, orgType } = await req.json()

    console.log("Received subscription request:", { email, tier, orgName, orgType })
    console.log("sending email")

    const resendResponse = await resend.emails.send({
      from: "developer@verciti.com", 
      to: "sales@verciti.com",
      replyTo: email,
      subject: `New Verciti Sales Enquiry from ${email} - ${orgName}`,
      html: `
        <h2>New Organisation Details</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Tier Interested In:</strong> ${tier}</p>
        <p><strong>Organisation Name:</strong> ${orgName}</p>
        <p><strong>Organisation Type:</strong> ${orgType}</p>
      `,
    });

    console.log(resendResponse);

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}