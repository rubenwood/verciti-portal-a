export function generateCustomerEmailTemplate({ customerName, customerEmail, courseLabel, dateStr, daysLabel, seatsLabel, amountLabel }: {
    customerName: string | null;
    customerEmail: string | null;
    courseLabel: string | null;
    dateStr: string | null;
    daysLabel: string | null;
    seatsLabel: string | null;
    amountLabel: string | null;
}): string {
    const internalHtml = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;">
      <h2 style="margin-bottom:4px;">New course booking</h2>
      <p style="color:#666;margin-top:0;">A payment has been completed and recorded in Supabase.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;width:140px;">Name</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${customerName ?? "—"}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Email</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${customerEmail ?? "—"}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Course</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${courseLabel}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Date</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${dateStr ?? "—"}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Duration</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${daysLabel}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Seats</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${seatsLabel}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600;">Amount paid</td><td style="padding:8px 0;">${amountLabel}</td></tr>
      </table>
    </div>
  `;
    return internalHtml;
}

export function generateInternalEmailTemplate({ customerName, customerEmail, courseLabel, dateStr, daysLabel, seatsLabel, amountLabel }: { customerName: string | null; customerEmail: string | null; courseLabel: string; dateStr: string | null; daysLabel: string; seatsLabel: string; amountLabel: string }): string {
    const internalHtml = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;">
      <h2 style="margin-bottom:4px;">New course booking</h2>
      <p style="color:#666;margin-top:0;">A payment has been completed and recorded in Supabase.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;width:140px;">Name</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${customerName ?? "—"}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Email</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${customerEmail ?? "—"}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Course</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${courseLabel}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Date</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${dateStr ?? "—"}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Duration</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${daysLabel}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">Seats</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${seatsLabel}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600;">Amount paid</td><td style="padding:8px 0;">${amountLabel}</td></tr>
      </table>
    </div>
  `;
    return internalHtml;
}