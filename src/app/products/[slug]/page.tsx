import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getFallbackBySlug } from "@/lib/products-fallback";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product: any = null;

  try {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();
    product = data;
  } catch {
    /* fallback */
  }

  if (!product) product = getFallbackBySlug(slug);
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
        <img
          src={product.image_url || "/images/jumia-logo.png"}
          alt={product.name}
        />
      </div>
      <div className="pdp-info">
        <p className="pdp-brand">
          {product.brand} · {product.category}
        </p>
        <h1>{product.name}</h1>
        <div style={{ margin: "16px 0" }}>
          <div className="pdp-price">KSh {price.toLocaleString()}</div>
          {compare ? (
            <span>
              <span className="pdp-old">KSh {compare.toLocaleString()}</span>
              {disc ? <span className="pdp-disc">-{disc}%</span> : null}
            </span>
          ) : null}
        </div>
        <p style={{ marginBottom: 16, color: "#75757a" }}>
          {product.description}
        </p>
        <p style={{ marginBottom: 16 }}>
          <span className="mpesa-badge">Pay with M-Pesa</span>
        </p>
        <p
          style={{
            marginBottom: 16,
            color: product.stock > 0 ? "#27ae60" : "#e61601",
            fontWeight: 600,
          }}
        >
          {product.stock > 0
            ? `In stock (${product.stock} units)`
            : "Out of stock"}
        </p>
        <AddToCartButton product={product} />
        <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/cart" className="btn btn-outline">
            Go to cart
          </Link>
          <Link href="/checkout" className="btn">
            Checkout (M-Pesa)
          </Link>
        </div>
        <p style={{ marginTop: 24, fontSize: 13, color: "#75757a" }}>
          Jumia Express · Delivery across Kenya · After successful M-Pesa
          payment you are redirected to jumia.co.ke
        </p>
      </div>
    </div>
  );
}
