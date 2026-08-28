import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty" style={{ textAlign: "center", padding: "48px 16px" }}>
      <h1>Page not found</h1>
      <p className="subtitle">This product or page is not available.</p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 20 }}>
        <Link href="/" className="btn">
          Home
        </Link>
        <Link href="/products" className="btn btn-outline">
          All products
        </Link>
        <Link href="/cart" className="btn btn-outline">
          Cart
        </Link>
      </div>
    </div>
  );
}
