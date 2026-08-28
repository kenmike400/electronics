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

  return (
    <div className="product-detail">
      <div>
        <img
          src={product.image_url || "/images/jumia-logo.png"}
          alt={product.name}
          style={{
            width: "100%",
            borderRadius: 12,
            background: "#fff",
            border: "1px solid #e5e5e5",
          }}
        />
      </div>
      <div>
        <p style={{ color: "#666", marginBottom: 4 }}>
          {product.brand} · {product.category}
        </p>
        <h1>{product.name}</h1>
        <div style={{ margin: "16px 0" }}>
          <span className="price" style={{ fontSize: "1.5rem" }}>
            KSh {Number(product.price).toLocaleString()}
          </span>
          {product.compare_at_price && (
            <span className="compare">
              KSh {Number(product.compare_at_price).toLocaleString()}
            </span>
          )}
        </div>
        <p style={{ marginBottom: 20 }}>{product.description}</p>
        <p
          style={{
            marginBottom: 16,
            color: product.stock > 0 ? "green" : "red",
          }}
        >
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
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
        <p style={{ marginTop: 24, fontSize: "0.9rem", color: "#666" }}>
          Payment method: <strong>M-Pesa only</strong>. After successful payment
          you will receive a receipt and be redirected to jumia.co.ke.
        </p>
      </div>
    </div>
  );
}
