import Link from "next/link";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

const PER_PAGE = 48;

function disc(price: number, compare?: number | null) {
  if (!compare || compare <= price) return null;
  return Math.round(((compare - price) / compare) * 100);
}

function buildHref(base: { q?: string; cat?: string }, page: number) {
  const params = new URLSearchParams();
  if (base.cat) params.set("cat", base.cat);
  if (base.q) params.set("q", base.q);
  if (page > 1) params.set("page", String(page));
  const s = params.toString();
  return s ? `/products?${s}` : "/products";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  // load a large pool then paginate client-side of the filtered list
  const all = await getProducts({ q: sp.q, cat: sp.cat, limit: 2000 });
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PER_PAGE;
  const products = all.slice(start, start + PER_PAGE);

  const title = sp.cat || sp.q || "All products";

  // show up to 4 page links around current, plus first/last feel
  const pages: number[] = [];
  const maxShow = Math.min(totalPages, 8);
  let from = Math.max(1, current - 2);
  let to = Math.min(totalPages, from + maxShow - 1);
  from = Math.max(1, to - maxShow + 1);
  for (let i = from; i <= to; i++) pages.push(i);

  return (
    <>
      <div className="section-head">
        <h2>
          {title}{" "}
          <span style={{ color: "#75757a", fontWeight: 400, fontSize: 14 }}>
            ({total} items · page {current} of {totalPages})
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
                  View · Pay M-Pesa
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

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Product pages">
          {current > 1 ? (
            <Link
              href={buildHref(sp, current - 1)}
              className="page-btn"
              rel="prev"
            >
              ← Prev
            </Link>
          ) : (
            <span className="page-btn disabled">← Prev</span>
          )}

          {from > 1 && (
            <>
              <Link href={buildHref(sp, 1)} className="page-num">
                1
              </Link>
              {from > 2 && <span className="page-ellipsis">…</span>}
            </>
          )}

          {pages.map((n) =>
            n === current ? (
              <span key={n} className="page-num active">
                {n}
              </span>
            ) : (
              <Link key={n} href={buildHref(sp, n)} className="page-num">
                {n}
              </Link>
            )
          )}

          {to < totalPages && (
            <>
              {to < totalPages - 1 && <span className="page-ellipsis">…</span>}
              <Link href={buildHref(sp, totalPages)} className="page-num">
                {totalPages}
              </Link>
            </>
          )}

          {current < totalPages ? (
            <Link
              href={buildHref(sp, current + 1)}
              className="page-btn"
              rel="next"
            >
              Next →
            </Link>
          ) : (
            <span className="page-btn disabled">Next →</span>
          )}
        </nav>
      )}
    </>
  );
}
