import Link from "next/link";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

function disc(price: number, compare?: number | null) {
  if (!compare || compare <= price) return null;
  return Math.round(((compare - price) / compare) * 100);
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const sp = await searchParams;
  const products = await getProducts({ q: sp.q, cat: sp.cat });

  return (
    <>
      <div className="section-head">
        <h2>
          {sp.cat || sp.q || "All products"}{" "}
          <span style={{ color: "#75757a", fontWeight: 400, fontSize: 14 }}>
            ({products.length} items)
          </span>
        </h2>
        <span style={{ fontSize: 13, color: "#75757a" }}>Pay with M-Pesa</span>
      </div>
      <div className="prd-grid">
        {products.map((p) => {
          const d = disc(Number(p.price), p.compare_at_price);
          return (
            <article key={p.slug || p.id} className="prd">
              <Link href={`/products/${p.slug}`}>
                <div className="prd-img">
                  {d ? <span className="prd-badge">-{d}%</span> : null}
                  <img src={p.image_url} alt={p.name} loading="lazy" />
                </div>
                <div className="prd-body">
                  <div className="prd-name">{p.name}</div>
                  <div className="prd-price">
                    KSh {Number(p.price).toLocaleString()}
                  </div>
                  {p.compare_at_price ? (
                    <div className="prd-old">
                      KSh {Number(p.compare_at_price).toLocaleString()}
                    </div>
                  ) : null}
                  <div className="prd-ship">Jumia Express</div>
                </div>
              </Link>
              <div className="prd-body" style={{ paddingTop: 0 }}>
                <Link href={`/products/${p.slug}`} className="prd-btn">
                  View · Add to cart
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      {products.length === 0 && (
        <div className="empty">
          <h1>No products found</h1>
          <Link href="/products" className="btn" style={{ marginTop: 16 }}>
            Browse all
          </Link>
        </div>
      )}
    </>
  );
}
