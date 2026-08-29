"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTIES, getSubs } from "@/lib/counties";

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image_url?: string;
};

/** September80: 80% off items ≥ 2000 KSh, 50% off items under 2000 KSh */
function applyStep80(items: CartItem[]) {
  let discount = 0;
  const lines = items.map((i) => {
    const line = i.price * i.qty;
    const rate = i.price >= 2000 ? 0.8 : 0.5;
    const d = Math.round(line * rate);
    discount += d;
    return { ...i, line, discount: d, rate };
  });
  return { lines, discount };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMsg, setPromoMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    county: "",
    sublocation: "",
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
          county: g.county || f.county,
          sublocation: g.sublocation || f.sublocation,
        }));
      } catch {}
    }
  }, []);

  const subOptions = useMemo(
    () => (form.county ? getSubs(form.county) : []),
    [form.county]
  );

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  );

  const { discount, total } = useMemo(() => {
    if (!promoApplied) return { discount: 0, total: subtotal };
    const { discount: d } = applyStep80(items);
    return { discount: d, total: Math.max(0, subtotal - d) };
  }, [items, subtotal, promoApplied]);

  function tryApplyPromo() {
    const code = promo.trim().toLowerCase();
    if (code === "september80") {
      setPromoApplied(true);
      setPromoMsg(
        "September80 applied! 80% off items KSh 2,000+ · 50% off items under KSh 2,000"
      );
      setError("");
    } else {
      setPromoApplied(false);
      setPromoMsg("");
      setError("Invalid code. Use September80");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      setError("Cart is empty");
      return;
    }
    if (!form.county) {
      setError("Select your county for delivery");
      return;
    }
    if (!form.sublocation) {
      setError("Select a sub-location / town");
      return;
    }
    if (!form.phone.match(/^(\+?254|0)?[17]\d{8}$/)) {
      setError("Enter a valid Kenyan phone number for M-Pesa (e.g. 07XXXXXXXX)");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Enter a valid email for your receipt");
      return;
    }
    setLoading(true);
    setError("");

    const fullAddress = [
      form.address,
      form.sublocation,
      form.county,
      "Kenya",
    ]
      .filter(Boolean)
      .join(", ");

    try {
      localStorage.setItem(
        "guest_profile",
        JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          county: form.county,
          sublocation: form.sublocation,
        })
      );

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: fullAddress,
          county: form.county,
          sublocation: form.sublocation,
          items,
          subtotal,
          discount: promoApplied ? discount : 0,
          total,
          promo_code: promoApplied ? "September80" : null,
          payment_method: "mpesa",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      localStorage.removeItem("cart");
      if (data.receipt_html) {
        sessionStorage.setItem("last_receipt_html", data.receipt_html);
      }
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
      <h1>Checkout — Pay with M-Pesa</h1>
      <p className="subtitle">
        One place: location + payment · Code <strong>September80</strong> · Orders
        &amp; emails saved securely
      </p>

      {error && <div className="alert alert-error">{error}</div>}
      {promoMsg && (
        <div
          className="alert"
          style={{
            background: "#e8f8ef",
            border: "1px solid #27ae60",
            color: "#1e7e34",
            marginBottom: 12,
          }}
        >
          {promoMsg}
        </div>
      )}

      <div className="checkout-layout">
        <form className="form checkout-form" onSubmit={submit}>
          <h2 className="checkout-section-title">1. Your details</h2>
          <label>Full name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoComplete="name"
          />

          <label>Email (receipt stored in your account)</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
          />

          <label>M-Pesa phone</label>
          <input
            required
            type="tel"
            placeholder="07XXXXXXXX"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            autoComplete="tel"
          />

          <h2 className="checkout-section-title">2. Delivery location</h2>
          <label>County (all 47)</label>
          <select
            required
            value={form.county}
            onChange={(e) =>
              setForm({ ...form, county: e.target.value, sublocation: "" })
            }
          >
            <option value="">Select county</option>
            {COUNTIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <label>Sub-location / town</label>
          <select
            required
            value={form.sublocation}
            onChange={(e) => setForm({ ...form, sublocation: e.target.value })}
            disabled={!form.county}
          >
            <option value="">
              {form.county ? "Select sub-location" : "Select county first"}
            </option>
            {subOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label>Street / building / extra details</label>
          <textarea
            required
            rows={2}
            placeholder="Estate, building, floor, landmark…"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <h2 className="checkout-section-title">3. Promo &amp; pay</h2>
          <label>Promo code</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="Code is September80"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              style={{ flex: 1 }}
              aria-label="Promo code"
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={tryApplyPromo}
              style={{ whiteSpace: "nowrap" }}
            >
              Apply
            </button>
          </div>
          <p className="checkout-hint">
            Any case works (september80). 80% off items ≥ KSh 2,000 · 50% off under
            KSh 2,000 · site-wide.
          </p>

          <div className="checkout-summary">
            <div className="checkout-sum-row">
              <span>Subtotal</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>
            {promoApplied && (
              <div className="checkout-sum-row discount">
                <span>September80 discount</span>
                <span>− KSh {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="checkout-sum-row total">
              <span>Total (M-Pesa)</span>
              <span>KSh {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            className="btn btn-mpesa"
            type="submit"
            disabled={loading}
            style={{ width: "100%", marginTop: 16, padding: "14px 20px" }}
          >
            {loading
              ? "Processing secure payment…"
              : `Pay KSh ${total.toLocaleString()} with M-Pesa`}
          </button>
          <p className="checkout-secure">
            🔒 Secure checkout · M-Pesa only · Order &amp; email saved · Receipt
            sent to your inbox
          </p>
        </form>

        <aside className="checkout-items">
          <h2 className="checkout-section-title">Your items</h2>
          {items.map((i) => (
            <div key={i.id} className="checkout-item">
              {i.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.image_url} alt="" />
              ) : (
                <div className="checkout-item-ph" />
              )}
              <div>
                <div className="checkout-item-name">{i.name}</div>
                <div className="checkout-item-meta">
                  Qty {i.qty} · KSh {(i.price * i.qty).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}
