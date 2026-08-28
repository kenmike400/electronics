"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    setItems(raw ? JSON.parse(raw) : []);
    const guest = localStorage.getItem("guest_profile");
    if (guest) {
      try {
        const g = JSON.parse(guest);
        setForm((f) => ({
          ...f,
          name: g.name || f.name,
          email: g.email || f.email,
          phone: g.phone || f.phone,
        }));
      } catch {}
    }
  }, []);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      setError("Cart is empty");
      return;
    }
    setLoading(true);
    setError("");

    try {
      localStorage.setItem(
        "guest_profile",
        JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
        })
      );

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items,
          total,
          payment_method: "mpesa",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      localStorage.removeItem("cart");
      if (data.receipt_html) {
        sessionStorage.setItem("last_receipt_html", data.receipt_html);
      }
      // Show receipt then redirect to Jumia on success
      router.push(
        `/order/${data.order_number}?success=1&redirect=${encodeURIComponent(
          data.redirect_url || "https://www.jumia.co.ke/"
        )}`
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="empty">
        <h1>Nothing to checkout</h1>
        <a href="/products" className="btn" style={{ marginTop: 16 }}>
          Browse products
        </a>
      </div>
    );
  }

  return (
    <>
      <h1>Checkout — M-Pesa only</h1>
      <p className="subtitle">
        Total: <strong>KSh {total.toLocaleString()}</strong> · Pay with M-Pesa
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="form" onSubmit={submit}>
        <label>Full name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Email (receipt will be sent here)</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>M-Pesa phone</label>
        <input
          required
          placeholder="07XXXXXXXX"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <label>Delivery address</label>
        <textarea
          required
          rows={3}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <div
          style={{
            background: "#fff8e6",
            border: "1px solid #f68b1e",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            fontSize: "0.9rem",
          }}
        >
          <strong>Payment method:</strong> M-Pesa only. After you place the
          order, complete the STK prompt on your phone. Successful payment
          redirects to Jumia Kenya.
        </div>

        <button type="submit" className="btn btn-block" disabled={loading}>
          {loading ? "Processing M-Pesa…" : "Pay with M-Pesa"}
        </button>
      </form>
    </>
  );
}
