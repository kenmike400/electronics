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
    if (typeof window !== "undefined") window.dispatchEvent(new Event("cart-updated"));
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
        <p className="subtitle">Browse products and add items to cart</p>
        <Link href="/products" className="btn" style={{ marginTop: 16 }}>
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="layout-2">
      <div className="panel">
        <h1>Cart ({items.length})</h1>
        {items.map((i) => (
          <div key={i.id} className="cart-row">
            <img
              src={i.image_url || "/images/jumia-logo.png"}
              alt={i.name}
            />
            <div className="info">
              <h3>
                <Link href={`/products/${i.slug}`}>{i.name}</Link>
              </h3>
              <div className="prd-price" style={{ marginBottom: 8 }}>
                KSh {Number(i.price).toLocaleString()}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="qty-ctrl">
                  <button type="button" onClick={() => updateQty(i.id, i.qty - 1)}>
                    −
                  </button>
                  <span>{i.qty}</span>
                  <button type="button" onClick={() => updateQty(i.id, i.qty + 1)}>
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => remove(i.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#e61601",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
            <div style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
              KSh {(Number(i.price) * i.qty).toLocaleString()}
            </div>
          </div>
        ))}
        <div style={{ marginTop: 16 }}>
          <Link href="/products" className="btn btn-outline">
            Continue shopping
          </Link>
        </div>
      </div>
      <div className="cart-summary">
        <h2 style={{ marginBottom: 16, fontSize: 16 }}>CART SUMMARY</h2>
        <div className="line">
          <span>Subtotal</span>
          <strong>KSh {total.toLocaleString()}</strong>
        </div>
        <div className="line">
          <span>Delivery</span>
          <span style={{ color: "#27ae60" }}>Calculated at checkout</span>
        </div>
        <div className="line total">
          <span>Total</span>
          <span>KSh {total.toLocaleString()}</span>
        </div>
        <p style={{ margin: "12px 0" }}>
          <span className="mpesa-badge">M-Pesa only</span>
        </p>
        <Link href="/checkout" className="btn btn-block">
          Checkout (M-Pesa)
        </Link>
      </div>
    </div>
  );
}
