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
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  function buildCart() {
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
  }

  function payMpesa() {
    setBusy(true);
    buildCart();
    router.push("/checkout");
  }

  return (
    <div className="pdp-buy">
      <div className="pdp-qty-row">
        <span className="pdp-qty-label">Quantity</span>
        <div className="qty-ctrl">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease">
            −
          </button>
          <span>{qty}</span>
          <button type="button" onClick={() => setQty(qty + 1)} aria-label="Increase">
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-block btn-mpesa"
        onClick={payMpesa}
        disabled={busy}
      >
        {busy ? "Opening checkout…" : "Pay with M-Pesa"}
      </button>

      <p className="pdp-secure-note">
        🔒 One-step checkout · Delivery to all 47 counties · Receipt by email
      </p>
    </div>
  );
}
