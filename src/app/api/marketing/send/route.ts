import { NextRequest, NextResponse } from "next/server";
import { buildPromoEmailHtml } from "@/lib/marketing-email";

export const dynamic = "force-dynamic";

const MAX_PER_REQUEST = 25; // safe batch; user can click send again

function parseEmails(raw: string): string[] {
  const parts = raw
    .split(/[,;\n\r\t ]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const seen = new Set<string>();
  const out: string[] = [];
  for (const e of parts) {
    if (!emailRe.test(e)) continue;
    if (seen.has(e)) continue;
    seen.add(e);
    out.push(e);
  }
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const secret = process.env.MARKETING_SEND_SECRET || "";
    if (secret && body.secret !== secret) {
      // allow if secret not configured (dev) but recommend setting it
    }
    if (secret && body.secret !== secret) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json(
        { error: "RESEND_API_KEY not configured" },
        { status: 500 }
      );
    }

    const emails = parseEmails(String(body.emails || ""));
    if (!emails.length) {
      return NextResponse.json(
        { error: "No valid emails found" },
        { status: 400 }
      );
    }

    const batch = emails.slice(0, MAX_PER_REQUEST);
    const promoUrl = String(body.promo_url || "https://bit.ly/4h20inK");
    const accessCode = String(body.access_code || "September80");
    const subject = String(
      body.subject || "🔥 Up to 80% OFF — Festival deals (code September80)"
    );
    const from =
      process.env.RESEND_FROM ||
      "Jumia Electronics <orders@jumia-kenya-electronics-shop-jumia.bbroot.com>";

    const html = buildPromoEmailHtml({ promoUrl, accessCode });

    const results: { email: string; ok: boolean; id?: string; error?: string }[] =
      [];

    for (const to of batch) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [to],
            subject,
            html,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.id) {
          results.push({ email: to, ok: true, id: data.id });
        } else {
          results.push({
            email: to,
            ok: false,
            error: data?.message || data?.error || `HTTP ${res.status}`,
          });
        }
        // small delay to be gentle on API
        await new Promise((r) => setTimeout(r, 200));
      } catch (e) {
        results.push({
          email: to,
          ok: false,
          error: e instanceof Error ? e.message : "send failed",
        });
      }
    }

    const sent = results.filter((r) => r.ok).length;
    const failed = results.filter((r) => !r.ok).length;

    return NextResponse.json({
      ok: true,
      sent,
      failed,
      total_requested: emails.length,
      batch_size: batch.length,
      remaining: Math.max(0, emails.length - batch.length),
      results,
      note:
        emails.length > MAX_PER_REQUEST
          ? `Only first ${MAX_PER_REQUEST} sent this click. Paste remaining and send again.`
          : undefined,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
