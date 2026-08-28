"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function OrderPage() {
  const params = useParams();
  const search = useSearchParams();
  const orderNumber = String(params.orderNumber || "");
  const success = search.get("success");
  const redirect = search.get("redirect") || "https://www.jumia.co.ke/";
  const [receipt, setReceipt] = useState("");
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const html = sessionStorage.getItem("last_receipt_html");
    if (html) setReceipt(html);
  }, []);

  useEffect(() => {
    if (!success) return;
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(t);
          window.location.href = redirect;
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [success, redirect]);

  return (
    <div className="hero" style={{ textAlign: "center" }}>
      {success && (
        <div className="alert alert-success" style={{ marginBottom: 20 }}>
          Payment recorded (M-Pesa). Order saved in Supabase. Redirecting to
          Jumia in {countdown}s…
        </div>
      )}
      <img
        src="/images/jumia-logo.png"
        alt="Jumia"
        width={64}
        height={64}
        style={{ borderRadius: 8, marginBottom: 12 }}
      />
      <h1>Order {orderNumber}</h1>
      <p className="subtitle">
        Receipt below. After successful M-Pesa payment you are sent to{" "}
        <a href={redirect}>jumia.co.ke</a>.
      </p>
      {receipt && (
        <div
          style={{
            textAlign: "left",
            marginTop: 24,
            border: "1px solid #e5e5e5",
            borderRadius: 8,
            overflow: "hidden",
          }}
          dangerouslySetInnerHTML={{ __html: receipt }}
        />
      )}
      <p style={{ marginTop: 20 }}>
        <a href="/products" className="btn btn-outline">
          Continue shopping
        </a>{" "}
        <a href={redirect} className="btn">
          Go to Jumia now
        </a>
      </p>
    </div>
  );
}
