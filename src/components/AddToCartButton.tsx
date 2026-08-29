"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id?: string;
  slug: string;
  name: string;
  price: number;
  image_url?: string | null;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const router = useRouter();

  function add() {
    const raw = localStorage.getItem("cart");
    const cart: Array<{
      id: string;
      name: string;
      price: number;
      image_url?: string | null;
      slug: string;
      qty: number;
    }> = raw ? JSON.parse(raw) : [];
    const id = product.id || product.slug;
    const existing = cart.find((i) => i.id === id);
    if (existing) existing.qty += qty;
    else
      cart.push({
        id,
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
        slug: product.slug,
        qty,
      });
    localStorage.setItem("cart", JSON.stringify(cart));
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>Quantity</span>
        <div className="qty-ctrl">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))}>
            −
          </button>
          <span>{qty}</span>
          <button type="button" onClick={() => setQty(qty + 1)}>
            +
          </button>
        </div>
      </div>
      <button type="button" className="btn btn-block" onClick={add}>
        {done ? "✓ Added to cart" : "Add to cart"}
      </button>
      {done && (
        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ flex: 1 }}
            onClick={() => router.push("/cart")}
          >
            Go to cart
          </button>
          <button
            type="button"
            className="btn"
            style={{ flex: 1 }}
            onClick={() => router.push("/checkout")}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
