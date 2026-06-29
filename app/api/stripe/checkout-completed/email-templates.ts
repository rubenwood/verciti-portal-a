export function generateCustomerEmailTemplate({
  customerName,
  customerEmail,
  courseLabel,
  dateStr,
  daysLabel,
  seatsLabel,
  amountLabel,
}: {
  customerName: string | null;
  customerEmail: string | null;
  courseLabel: string | null;
  dateStr: string | null;
  daysLabel: string | null;
  seatsLabel: string | null;
  amountLabel: string | null;
}): string {
  const firstName = customerName ? customerName.split(" ")[0] : null;

  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;background:#111;color:#fff;border-radius:12px;overflow:hidden;">
      <div style="background:#161f12;padding:24px 32px;border-bottom:1px solid #222;">
        <div style="font-size:20px;font-weight:800;letter-spacing:-0.5px;color:#fff;">verciti</div>
      </div>
      <div style="padding:32px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7AE02A;margin-bottom:6px;">Booking confirmed</div>
        <div style="font-size:22px;font-weight:800;color:#fff;margin-bottom:6px;line-height:1.2;">You're booked in${firstName ? `, ${firstName}` : ""}.</div>
        <div style="font-size:14px;color:#888;margin-bottom:28px;line-height:1.7;">Thank you for booking with Verciti. Here's a summary of your booking.</div>

        <div style="background:#1a1a1a;border:0.5px solid #2e2e2e;border-radius:12px;padding:20px;margin-bottom:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#555;padding:10px 0;border-bottom:0.5px solid #222;">Course</td>
              <td style="font-size:12px;color:#fff;font-weight:500;padding:10px 0;border-bottom:0.5px solid #222;text-align:right;">${courseLabel ?? "—"}</td>
            </tr>
            <tr>
              <td style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#555;padding:10px 0;border-bottom:0.5px solid #222;">Date</td>
              <td style="font-size:12px;color:#fff;font-weight:500;padding:10px 0;border-bottom:0.5px solid #222;text-align:right;">${dateStr ?? "—"}</td>
            </tr>
            <tr>
              <td style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#555;padding:10px 0;border-bottom:0.5px solid #222;">Duration</td>
              <td style="font-size:12px;color:#fff;font-weight:500;padding:10px 0;border-bottom:0.5px solid #222;text-align:right;">${daysLabel ?? "—"}</td>
            </tr>
            <tr>
              <td style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#555;padding:10px 0;border-bottom:0.5px solid #222;">Seats booked</td>
              <td style="font-size:12px;color:#fff;font-weight:500;padding:10px 0;border-bottom:0.5px solid #222;text-align:right;">${seatsLabel ?? "—"}</td>
            </tr>
            <tr>
              <td style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#555;padding:10px 0;">Total paid</td>
              <td style="font-size:16px;color:#7AE02A;font-weight:800;padding:10px 0;text-align:right;">${amountLabel ?? "—"}</td>
            </tr>
          </table>
        </div>

        <div style="font-size:13px;color:#777;line-height:1.7;margin-bottom:24px;">
          We'll be in touch closer to the course date with joining instructions. If you have any questions in the meantime, just reply to this email or contact us at <a href="mailto:info@verciti.com" style="color:#7AE02A;text-decoration:none;">info@verciti.com</a>.
        </div>

        <div style="font-size:11px;color:#444;">
          Verciti &mdash; <a href="https://www.verciti.com" style="color:#555;text-decoration:none;">www.verciti.com</a> &mdash; +44 (0)7936 123858
        </div>
      </div>
    </div>
  `;
}

export function generateInternalEmailTemplate({
  customerName,
  customerEmail,
  courseLabel,
  dateStr,
  daysLabel,
  seatsLabel,
  amountLabel,
}: {
  customerName: string | null;
  customerEmail: string | null;
  courseLabel: string;
  dateStr: string | null;
  daysLabel: string;
  seatsLabel: string;
  amountLabel: string;
}): string {
  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;">
      <h2 style="margin-bottom:4px;">New course booking</h2>
      <p style="color:#666;margin-top:0;">A payment has been completed and recorded in Supabase.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;width:140px;">Name</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${customerName ?? "—"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Email</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${customerEmail ?? "—"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Course</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${courseLabel}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Date</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${dateStr ?? "—"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Duration</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${daysLabel}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Seats</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${seatsLabel}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-weight:600;">Amount paid</td>
          <td style="padding:8px 0;">${amountLabel}</td>
        </tr>
      </table>
    </div>
  `;
}