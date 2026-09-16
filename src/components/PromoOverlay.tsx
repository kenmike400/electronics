"use client";

import { useEffect, useState } from "react";

export default function PromoOverlay() {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Show at 6 seconds
    const t1 = setTimeout(() => setShow(true), 6000);
    // Show again at 27 seconds if closed
    const t2 = setTimeout(() => setShow(true), 27000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText("September80").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={() => setShow(false)}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          maxWidth: 380,
          width: "100%",
          padding: "28px 24px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShow(false)}
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            background: "none",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
            color: "#999",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <img
          src="/images/jumia-logo-black.png"
          alt="Jumia"
          style={{ height: 36, margin: "0 auto 16px", display: "block" }}
        />

        <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#111" }}>
          Exclusive Discount!
        </h2>
        <p style={{ margin: "0 0 18px", fontSize: 14, color: "#555" }}>
          Use this code at checkout for up to 80% OFF
        </p>

        <div
          style={{
            background: "#fff7ed",
            border: "2px dashed #FF6600",
            borderRadius: 10,
            padding: "14px 12px",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Your code</div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "#FF6600",
              letterSpacing: 2,
              userSelect: "all",
            }}
          >
            September80
          </div>
        </div>

        <button
          onClick={copyCode}
          style={{
            width: "100%",
            background: copied ? "#16a34a" : "#FF6600",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "13px",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          {copied ? "✓ Copied!" : "Copy Code"}
        </button>

        <button
          onClick={() => setShow(false)}
          style={{
            width: "100%",
            background: "#f3f4f6",
            color: "#374151",
            border: "none",
            borderRadius: 8,
            padding: "11px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
