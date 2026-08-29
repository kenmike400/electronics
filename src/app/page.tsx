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
      .limit(36);
    if (!error && data && data.length > 0) return data;
  } catch {
    /* fallback */
  }
  return FALLBACK_PRODUCTS;
}

function disc(price: number, compare?: number | null) {
  if (!compare || compare <= price) return null;
  return Math.round(((compare - price) / compare) * 100);
}

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.slice(0, 12);
  const more = products.slice(12, 36);

  return (
    <>
      <section className="hero-banner">
        <div>
          <h1>Jumia Kenya Electronics</h1>
          <p>
            Phones, TVs, headphones, appliances &amp; more. Official deals ·
            Pay with <strong>M-Pesa only</strong> · Fast delivery across Kenya.
          </p>
        </div>
        <Link href="/products" className="btn">
          Shop all products
        </Link>
      </section>

      <div className="section-head">
        <h2>Top deals</h2>
        <Link href="/products">See all →</Link>
      </div>
      <div className="prd-grid">
        {featured.map((p) => {
          const d = disc(Number(p.price), p.compare_at_price);
          return (
            <article key={p.id || p.slug} className="prd">
              <Link href={`/products/${p.slug}`}>
                <div className="prd-img">
                  {d ? <span className="prd-badge">-{d}%</span> : null}
                  <img
                    src={p.image_url || "/images/jumia-logo.png"}
                    alt={p.name}
                    loading="lazy"
                  />
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
                  Add to cart
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {more.length > 0 && (
        <>
          <div className="section-head">
            <h2>More for you</h2>
            <Link href="/products">See all →</Link>
          </div>
          <div className="prd-grid">
            {more.map((p) => {
              const d = disc(Number(p.price), p.compare_at_price);
              return (
                <article key={p.id || p.slug} className="prd">
                  <Link href={`/products/${p.slug}`}>
                    <div className="prd-img">
                      {d ? <span className="prd-badge">-{d}%</span> : null}
                      <img
                        src={p.image_url || "/images/jumia-logo.png"}
                        alt={p.name}
                        loading="lazy"
                      />
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
                </article>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
