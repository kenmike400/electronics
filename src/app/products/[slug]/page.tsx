import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const price = Number(product.price);
  const compare = product.compare_at_price
    ? Number(product.compare_at_price)
    : null;
  const disc =
    compare && compare > price
      ? Math.round(((compare - price) / compare) * 100)
      : null;

  return (
    <div className="pdp">
      <div className="pdp-gallery">
        <img src={product.image_url} alt={product.name} />
      </div>
      <div className="pdp-info">
        <p className="pdp-brand">
          {product.brand} · {product.category}
        </p>
        <h1>{product.name}</h1>

        <div className="pdp-price-row">
          <div className="pdp-price">KSh {price.toLocaleString()}</div>
          {compare ? (
            <span>
              <span className="pdp-old">KSh {compare.toLocaleString()}</span>
              {disc ? <span className="pdp-disc">-{disc}%</span> : null}
            </span>
          ) : null}
        </div>

        <p className="pdp-promo-hint">
          Use code <strong>September80</strong> at checkout —{" "}
          {price >= 2000 ? "80% off (item ≥ KSh 2,000)" : "50% off (item under KSh 2,000)"}
        </p>

        <p className="pdp-desc">{product.description}</p>

        <p
          className="pdp-stock"
          style={{ color: product.stock > 0 ? "#27ae60" : "#e61601" }}
        >
          {product.stock > 0
            ? `In stock (${product.stock} units)`
            : "Out of stock"}
        </p>

        <div className="pdp-delivery-box">
          <strong>Delivery</strong>
          <span>All 47 Kenyan counties · Pick sub-location at checkout</span>
          <span>Door delivery or pickup station · M-Pesa only</span>
        </div>

        {product.stock > 0 ? (
          <AddToCartButton product={product} />
        ) : (
          <p style={{ color: "#e61601", fontWeight: 600 }}>Currently unavailable</p>
        )}

        <div className="pdp-links">
          <Link href="/products">← Continue shopping</Link>
          <Link href="/checkout">Checkout</Link>
        </div>
      </div>
    </div>
  );
}
