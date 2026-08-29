"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saved, setSaved] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const g = localStorage.getItem("guest_profile");
    if (g) {
      try {
        setForm(JSON.parse(g));
        setHasProfile(true);
      } catch {}
    }
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Guest profile — stays in this browser (localStorage) until cleared
    localStorage.setItem("guest_profile", JSON.stringify(form));
    localStorage.setItem("guest_profile_saved_at", String(Date.now()));
    setSaved(true);
    setHasProfile(true);
    window.dispatchEvent(new Event("cart-updated"));
    setTimeout(() => router.push("/products"), 900);
  }

  function clearProfile() {
    localStorage.removeItem("guest_profile");
    localStorage.removeItem("guest_profile_saved_at");
    setForm({ name: "", email: "", phone: "" });
    setHasProfile(false);
    setSaved(false);
  }

  return (
    <>
      <h1>Your profile</h1>
      <p className="subtitle">
        No sign-in required. Your details stay on this device so checkout is
        faster next time. Orders &amp; receipts still go to your email via
        Supabase.
      </p>
      {hasProfile && !saved && (
        <div
          className="alert"
          style={{
            background: "#e8f8ef",
            border: "1px solid #27ae60",
            color: "#1e7e34",
            marginBottom: 12,
          }}
        >
          Guest profile loaded — you can update it or continue shopping.
        </div>
      )}
      {saved && (
        <div className="alert alert-success">Saved. Redirecting to products…</div>
      )}
      <form className="form" onSubmit={submit}>
        <label>Full name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          autoComplete="name"
        />
        <label>Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          autoComplete="email"
        />
        <label>Phone (M-Pesa)</label>
        <input
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          autoComplete="tel"
          placeholder="07XXXXXXXX"
        />
        <button type="submit" className="btn btn-block">
          {hasProfile ? "Update profile" : "Save & continue shopping"}
        </button>
      </form>
      <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/products" className="btn btn-outline">
          Browse products
        </Link>
        <Link href="/cart" className="btn btn-outline">
          View cart
        </Link>
        {hasProfile && (
          <button type="button" className="btn btn-outline" onClick={clearProfile}>
            Clear saved profile
          </button>
        )}
      </div>
    </>
  );
}
