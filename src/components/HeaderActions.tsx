"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Guest = { name?: string; email?: string; phone?: string };

export default function HeaderActions() {
  const [count, setCount] = useState(0);
  const [guest, setGuest] = useState<Guest | null>(null);

  function readCart() {
    try {
      const raw = localStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : [];
      const n = Array.isArray(cart)
        ? cart.reduce((s: number, i: { qty?: number }) => s + (i.qty || 1), 0)
        : 0;
      setCount(n);
    } catch {
      setCount(0);
    }
  }

  function readGuest() {
    try {
      const raw = localStorage.getItem("guest_profile");
      if (raw) setGuest(JSON.parse(raw));
      else setGuest(null);
    } catch {
      setGuest(null);
    }
  }

  useEffect(() => {
    readCart();
    readGuest();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart" || e.key === null) readCart();
      if (e.key === "guest_profile" || e.key === null) readGuest();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("cart-updated", readCart);
    // poll lightly so same-tab cart updates show badge
    const t = setInterval(readCart, 1500);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cart-updated", readCart);
      clearInterval(t);
    };
  }, []);

  const label = guest?.name
    ? guest.name.split(" ")[0]
    : guest?.email
      ? guest.email.split("@")[0]
      : "Account";

  return (
    <div className="header-actions">
      <Link href="/account" title="Account" className="ha-link">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
        <span className="ha-text">{label}</span>
      </Link>
      <Link href="/checkout" title="Help" className="ha-link">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <span className="ha-text">Help</span>
      </Link>
      <Link href="/cart" title="Cart" className="ha-link ha-cart">
        <span className="ha-cart-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6h15l-1.5 9h-12z" />
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
            <path d="M6 6L5 3H2" />
          </svg>
          {count > 0 ? <span className="cart-badge">{count > 99 ? "99+" : count}</span> : null}
        </span>
        <span className="ha-text">Cart</span>
      </Link>
    </div>
  );
}
