import { supabase } from "@/lib/supabase";
import { FALLBACK_PRODUCTS, type Product } from "@/lib/products-fallback";

function dedupeByImage(list: Product[]): Product[] {
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of list) {
    const img = p.image_url || "";
    // skip placeholder / broken local images
    if (!img.startsWith("http")) continue;
    if (img.includes("jumia-logo") || img.includes("tv-sample")) continue;
    if (seen.has(img)) continue;
    seen.add(img);
    out.push(p);
  }
  return out;
}

export async function getProducts(opts?: {
  limit?: number;
  q?: string;
  cat?: string;
}): Promise<Product[]> {
  let list: Product[] = [];

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(opts?.limit ? opts.limit * 3 : 500);
    if (!error && data && data.length > 0) {
      list = data as Product[];
    }
  } catch {
    /* use fallback */
  }

  if (list.length === 0) {
    list = FALLBACK_PRODUCTS;
  }

  list = dedupeByImage(list);

  // If still thin, merge unique fallback items
  if (list.length < 24) {
    const extra = dedupeByImage(FALLBACK_PRODUCTS);
    const have = new Set(list.map((p) => p.image_url));
    for (const p of extra) {
      if (!have.has(p.image_url)) {
        list.push(p);
        have.add(p.image_url);
      }
    }
  }

  if (opts?.q) {
    const s = opts.q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        (p.brand || "").toLowerCase().includes(s) ||
        (p.category || "").toLowerCase().includes(s)
    );
  }
  if (opts?.cat) {
    const c = opts.cat.toLowerCase();
    list = list.filter(
      (p) =>
        (p.category || "").toLowerCase().includes(c) ||
        p.name.toLowerCase().includes(c)
    );
  }

  if (opts?.limit) list = list.slice(0, opts.limit);
  return list;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();
    if (data) return data as Product;
  } catch {
    /* fallback */
  }
  const { getFallbackBySlug } = await import("@/lib/products-fallback");
  return getFallbackBySlug(slug) || null;
}
