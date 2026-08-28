"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  slug: string;
  qty: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
    setReady(true);
  }, []);

  function persist(next: CartItem[]) {
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
  }

  function updateQty(id: string, qty: number) {
    const next = items
      .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
      .filter((i) => i.qty > 0);
    persist(next);
  }

  function remove(id: string) {
    persist(items.filter((i) => i.id !== id));
  }

  const total = items.reduce((s, i) => s + Number(i.price) * i.qty, 0);

  if (!ready) {
    return <p className="subtitle">Loading cart…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="empty">
        <h1>Your cart is empty</h1>
        <Link href="/products" className="btn" style={{ marginTop: 16 }}>
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1>Cart ({items.length})</h1>
      <p className="subtitle">Review items then proceed to M-Pesa checkout</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 320px",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            border: "1px solid #e5e5e5",
            padding: 16,
          }}
        >
          {items.map((i) => (
            <div
              key={i.id}
              style={{
                display: "flex",
                gap: 16,
                padding: "16px 0",
                borderBottom: "1px solid #eee",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <img
                src={i.image_url || "/images/jumia-logo.png"}
                alt={i.name}
                width={80}
                height={80}
                style={{
                  objectFit: "contain",
                  borderRadius: 8,
                  background: "#fafafa",
                  border: "1px solid #eee",
                }}
              />
              <div style={{ flex: 1, minWidth: 180 }}>
                <Link
                  href={`/products/${i.slug}`}
                  style={{ fontWeight: 600, color: "#282828" }}
                >
                  {i.name}
                </Link>
                <p style={{ margin: "6px 0", color: "#f68b1e", fontWeight: 700 }}>
                  KSh {Number(i.price).toLocaleString()}
                </p>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: "4px 10px", minWidth: 36 }}
                    onClick={() => updateQty(i.id, i.qty - 1)}
                  >
                    −
                  </button>
                  <span style={{ minWidth: 24, textAlign: "center" }}>{i.qty}</span>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: "4px 10px", minWidth: 36 }}
                    onClick={() => updateQty(i.id, i.qty + 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i.id)}
                    style={{
                      marginLeft: 12,
                      background: "none",
                      border: "none",
                      color: "#f68b1e",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div style={{ fontWeight: 700 }}>
                KSh {(Number(i.price) * i.qty).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <aside
          style={{
            background: "#fff",
            borderRadius: 8,
            border: "1px solid #e5e5e5",
            padding: 20,
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: "1rem" }}>CART SUMMARY</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "12px 0",
            }}
          >
            <span>Item&apos;s total ({items.length})</span>
            <strong>KSh {total.toLocaleString()}</strong>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
              fontSize: "1.1rem",
            }}
          >
            <span>Subtotal</span>
            <strong>KSh {total.toLocaleString()}</strong>
          </div>
          <Link href="/checkout" className="btn btn-block">
            Checkout (KSh {total.toLocaleString()})
          </Link>
          <Link
            href="/products"
            className="btn btn-outline btn-block"
            style={{ marginTop: 10, display: "block", textAlign: "center" }}
          >
            Continue shopping
          </Link>
          <p style={{ fontSize: "0.85rem", color: "#666", marginTop: 12 }}>
            Payment: <strong>M-Pesa only</strong>
          </p>
        </aside>
      </div>
    </>
  );
}
