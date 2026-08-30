import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 1) {
    return NextResponse.json({ results: [] });
  }
  try {
    const list = await getProducts({ q, limit: 12 });
    const results = list.slice(0, 10).map((p) => ({
      slug: p.slug,
      name: p.name,
      price: p.price,
      image_url: p.image_url,
      brand: p.brand,
      category: p.category,
      compare_at_price: p.compare_at_price,
    }));
    return NextResponse.json({ results, q });
  } catch {
    return NextResponse.json({ results: [], q });
  }
}
