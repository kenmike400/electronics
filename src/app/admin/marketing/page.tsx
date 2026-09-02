"use client";

import { useMemo, useState } from "react";

export default function MarketingAdminPage() {
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState(
    "🔥 Up to 80% OFF — Festival deals (code September80)"
  );
  const [promoUrl, setPromoUrl] = useState("https://bit.ly/4h20inK");
  const [accessCode, setAccessCode] = useState("September80");
  const [secret, setSecret] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState("");

  const parsed = useMemo(() => {
    const parts = emails
      .split(/[,;\n\r\t ]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return Array.from(new Set(parts.filter((e) => re.test(e))));
  }, [emails]);

  async function send() {
    if (!parsed.length) {
      setLog("Paste at least one valid email.");
      return;
    }
    setBusy(true);
    setLog("Sending…");
    try {
      const res = await fetch("/api/marketing/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: parsed.join(","),
          subject,
          promo_url: promoUrl,
          access_code: accessCode,
          secret: secret || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      const lines = [
        `Sent: ${data.sent} · Failed: ${data.failed} · In batch: ${data.batch_size}`,
        data.note || "",
        "",
        ...(data.results || []).map(
          (r: { email: string; ok: boolean; id?: string; error?: string }) =>
            r.ok ? `✅ ${r.email} (${r.id})` : `❌ ${r.email} — ${r.error}`
        ),
      ];
      setLog(lines.filter(Boolean).join("\n"));
    } catch (e) {
      setLog(e instanceof Error ? e.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
      <h1 style={{ marginTop: 0 }}>Marketing — 80% OFF mini store</h1>
      <p style={{ color: "#555", fontSize: 14 }}>
        Paste emails (comma or new-line separated). Each click sends up to{" "}
        <strong>25</strong> via Resend using your connected domain. Only email
        people who opted in.
      </p>

      <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>
        Subject
      </label>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={inputStyle}
      />

      <label style={{ display: "block", fontWeight: 600, margin: "12px 0 6px" }}>
        Promo / access link
      </label>
      <input
        value={promoUrl}
        onChange={(e) => setPromoUrl(e.target.value)}
        style={inputStyle}
        placeholder="https://bit.ly/4h20inK"
      />

      <label style={{ display: "block", fontWeight: 600, margin: "12px 0 6px" }}>
        Discount code shown in email
      </label>
      <input
        value={accessCode}
        onChange={(e) => setAccessCode(e.target.value)}
        style={inputStyle}
      />

      <label style={{ display: "block", fontWeight: 600, margin: "12px 0 6px" }}>
        Emails ({parsed.length} valid)
      </label>
      <textarea
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        rows={10}
        placeholder="one@gmail.com, two@gmail.com, three@yahoo.com"
        style={{ ...inputStyle, fontFamily: "monospace", fontSize: 13 }}
      />

      <label style={{ display: "block", fontWeight: 600, margin: "12px 0 6px" }}>
        Admin secret (optional if MARKETING_SEND_SECRET set)
      </label>
      <input
        type="password"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        style={inputStyle}
      />

      <button
        type="button"
        onClick={send}
        disabled={busy}
        className="btn btn-mpesa"
        style={{ marginTop: 16, width: "100%", padding: 14, fontSize: 16 }}
      >
        {busy ? "Sending…" : `Send promo to ${Math.min(parsed.length, 25)} email(s)`}
      </button>

      {log ? (
        <pre
          style={{
            marginTop: 16,
            background: "#111",
            color: "#9f9",
            padding: 12,
            borderRadius: 6,
            fontSize: 12,
            whiteSpace: "pre-wrap",
          }}
        >
          {log}
        </pre>
      ) : null}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #ddd",
  borderRadius: 6,
  fontSize: 14,
  boxSizing: "border-box",
};
