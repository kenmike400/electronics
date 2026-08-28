"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const g = localStorage.getItem("guest_profile");
    if (g) {
      try {
        setForm(JSON.parse(g));
      } catch {}
    }
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Guest signup — no email confirmation required
    localStorage.setItem("guest_profile", JSON.stringify(form));
    setSaved(true);
    setTimeout(() => router.push("/products"), 800);
  }

  return (
    <>
      <h1>Guest account</h1>
      <p className="subtitle">
        Sign up with email only — no confirmation link. Use the same details at
        checkout for receipts.
      </p>
      {saved && (
        <div className="alert alert-success">Saved. Redirecting to products…</div>
      )}
      <form className="form" onSubmit={submit}>
        <label>Full name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <label>Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <label>Phone (M-Pesa)</label>
        <input
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button type="submit" className="btn btn-block">
          Save & continue shopping
        </button>
      </form>
    </>
  );
}
