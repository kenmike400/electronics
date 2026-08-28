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
      .order("name");
    if (!error && data && data.length > 0) return data;
  } catch {
    /* fallback */
  }
  return FALLBACK_PRODUCTS;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <h1>All products</h1>
      <p className="subtitle">
        {products.length} items · Pay with M-Pesa at checkout
      </p>
      <div className="grid">
        {products.map((p) => (
          <article key={p.id || p.slug} className="card">
            <img
              src={p.image_url || "/images/jumia-logo.png"}
              alt={p.name}
            />
            <div className="card-body">
              <p style={{ fontSize: "0.8rem", color: "#888" }}>
                {p.brand} · {p.category}
              </p>
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
                View
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
