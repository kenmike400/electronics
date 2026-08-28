/** Order receipt HTML email (Jumia-style). No personal emails hardcoded. */

export function orderReceiptHtml(opts: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  total: number;
  items: Array<{ name: string; qty: number; price: number }>;
  logoUrl?: string;
}) {
  const rows = opts.items
    .map(
      (i) => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #eee;">${escapeHtml(i.name)}</td>
      <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${i.qty}</td>
      <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">KSh ${(i.price * i.qty).toLocaleString()}</td>
    </tr>`
    )
    .join("");

  const logo = opts.logoUrl || "https://electronics2-ochre.vercel.app/images/jumia-logo.png";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Order ${opts.orderNumber}</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e5e5;">
        <tr>
          <td style="background:#f68b1e;padding:16px 24px;">
            <img src="${logo}" alt="Jumia" width="48" height="48" style="vertical-align:middle;border-radius:6px;background:#fff;" />
            <span style="color:#fff;font-size:20px;font-weight:bold;margin-left:12px;vertical-align:middle;">Electronics Shop</span>
          </td>
        </tr>
        <tr>
          <td style="padding:24px;">
            <h1 style="margin:0 0 8px;font-size:22px;color:#f68b1e;">Order confirmed</h1>
            <p style="margin:0 0 16px;color:#666;">Thank you ${escapeHtml(opts.customerName)}. Pay with <strong>M-Pesa</strong> only.</p>
            <p style="margin:0 0 8px;"><strong>Order number:</strong> ${escapeHtml(opts.orderNumber)}</p>
            <p style="margin:0 0 8px;"><strong>Phone:</strong> ${escapeHtml(opts.customerPhone)}</p>
            <p style="margin:0 0 16px;"><strong>Delivery:</strong> ${escapeHtml(opts.address)}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:16px;">
              <tr style="background:#fafafa;">
                <th style="padding:10px;text-align:left;border-bottom:1px solid #eee;">Item</th>
                <th style="padding:10px;text-align:center;border-bottom:1px solid #eee;">Qty</th>
                <th style="padding:10px;text-align:right;border-bottom:1px solid #eee;">Subtotal</th>
              </tr>
              ${rows}
            </table>
            <p style="font-size:18px;font-weight:bold;text-align:right;margin:0 0 16px;">
              Total: KSh ${opts.total.toLocaleString()}
            </p>
            <p style="margin:0;color:#666;font-size:14px;">
              Complete M-Pesa payment when prompted. After successful payment you will be redirected to Jumia Kenya.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#222;color:#ccc;padding:14px 24px;font-size:12px;text-align:center;">
            Jumia Kenya Electronics · Order receipt · Do not reply to this automated message
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
