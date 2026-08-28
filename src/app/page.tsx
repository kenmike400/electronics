import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FALLBACK_PRODUCTS } from "@/lib/products-fallback";

export const dynamic = "force-dynamic";

async function getProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(18);
    if (!error && data && data.length > 0) return data;
  } catch {
    /* use fallback */
  }
  return FALLBACK_PRODUCTS;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <section className="hero">
        <h1>Jumia Kenya Electronics</h1>
        <p className="subtitle">
          Shop TVs, phones, appliances, cookware & more. Pay with{" "}
          <strong>M-Pesa only</strong>. Fast delivery across Kenya.
        </p>
        <Link href="/products" className="btn">
          Browse all products
        </Link>
      </section>

      <h2 style={{ marginBottom: 16 }}>Featured deals</h2>
      <div className="grid">
        {products.map((p) => (
          <article key={p.id || p.slug} className="card">
            <img
              src={p.image_url || "/images/jumia-logo.png"}
              alt={p.name}
            />
            <div className="card-body">
              <h3>{p.name}</h3>
              <div>
                <span className="price">
                  KSh {Number(p.price).toLocaleString()}
                </span>
                {p.compare_at_price && (
                  <span className="compare">
                    KSh {Number(p.compare_at_price).toLocaleString()}
                  </span>
                )}
              </div>
              <Link
                href={`/products/${p.slug}`}
                className="btn btn-block"
                style={{ marginTop: 12 }}
              >
                View product
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
