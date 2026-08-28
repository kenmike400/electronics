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

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    setItems(raw ? JSON.parse(raw) : []);
  }, []);

  function updateQty(id: string, qty: number) {
    const next = items
      .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
      .filter((i) => i.qty > 0);
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
  }

  function remove(id: string) {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
  }

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

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
      <h1>Cart</h1>
      <p className="subtitle">{items.length} item(s)</p>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>
                <Link href={`/products/${i.slug}`}>{i.name}</Link>
              </td>
              <td>KSh {i.price.toLocaleString()}</td>
              <td>
                <input
                  type="number"
                  min={1}
                  value={i.qty}
                  onChange={(e) => updateQty(i.id, Number(e.target.value))}
                  style={{ width: 64, padding: 6 }}
                />
              </td>
              <td>KSh {(i.price * i.qty).toLocaleString()}</td>
              <td>
                <button type="button" onClick={() => remove(i.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 24, textAlign: "right" }}>
        <p style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 12 }}>
          Total: KSh {total.toLocaleString()}
        </p>
        <Link href="/checkout" className="btn">
          Proceed to checkout
        </Link>
      </div>
    </>
  );
}
