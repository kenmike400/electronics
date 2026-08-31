import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ reviews: [] });
  }
  const cfg = admin();
  if (!cfg) return NextResponse.json({ reviews: [] });

  try {
    const res = await fetch(
      `${cfg.url}/rest/v1/reviews?product_slug=eq.${encodeURIComponent(slug)}&order=created_at.desc&limit=50`,
      {
        headers: {
          apikey: cfg.key,
          Authorization: `Bearer ${cfg.key}`,
        },
        cache: "no-store",
      }
    );
    const data = await res.json();
    const reviews = Array.isArray(data)
      ? data.map((r: Record<string, unknown>) => ({
          id: r.id,
          author: r.author,
          rating: Number(r.rating),
          title: r.title || "Review",
          body: r.body,
          date: String(r.created_at || "").slice(0, 10),
          verified: !!r.verified,
          helpful: Number(r.helpful || 0),
        }))
      : [];
    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const slug = String(body.slug || "").trim();
  const author = String(body.author || "").trim().slice(0, 60);
  const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
  const title = String(body.title || "Customer review").slice(0, 120);
  const text = String(body.body || "").trim().slice(0, 1000);
  const orderNumber = body.order_number ? String(body.order_number).slice(0, 40) : null;

  if (!slug || !author || !text) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const cfg = admin();
  if (!cfg) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  // Verified if order_number matches a paid order for this customer flow
  let verified = false;
  if (orderNumber) {
    try {
      const check = await fetch(
        `${cfg.url}/rest/v1/orders?order_number=eq.${encodeURIComponent(orderNumber)}&select=payment_status,status&limit=1`,
        {
          headers: {
            apikey: cfg.key,
            Authorization: `Bearer ${cfg.key}`,
          },
        }
      );
      const rows = await check.json();
      if (Array.isArray(rows) && rows[0]) {
        const s = rows[0];
        verified =
          s.payment_status === "paid" ||
          s.status === "paid" ||
          s.status === "completed";
      }
    } catch {}
  }

  const res = await fetch(`${cfg.url}/rest/v1/reviews`, {
    method: "POST",
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      product_slug: slug,
      author,
      rating,
      title,
      body: text,
      verified,
      helpful: 0,
      order_number: orderNumber,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json(
      { error: data?.message || data?.error || "Could not save review" },
      { status: 502 }
    );
  }
  const row = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({
    ok: true,
    review: {
      id: row.id,
      author: row.author,
      rating: row.rating,
      title: row.title,
      body: row.body,
      date: String(row.created_at || "").slice(0, 10),
      verified: !!row.verified,
      helpful: 0,
    },
  });
}
