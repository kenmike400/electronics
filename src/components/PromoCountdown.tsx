"use client";

import { useEffect, useState } from "react";

/** 12-hour looping window (resets when it hits 0) — visual only */
const CYCLE_MS = 12 * 60 * 60 * 1000;

function remainingInCycle(now = Date.now()) {
  const elapsed = now % CYCLE_MS;
  return CYCLE_MS - elapsed;
}

function formatHMS(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

type Props = {
  /** banner = inline in scrolling promo; checkout = card under form */
  variant?: "banner" | "checkout";
};

export default function PromoCountdown({ variant = "banner" }: Props) {
  const [left, setLeft] = useState(remainingInCycle());

  useEffect(() => {
    setLeft(remainingInCycle());
    const id = setInterval(() => setLeft(remainingInCycle()), 1000);
    return () => clearInterval(id);
  }, []);

  const { h, m, s } = formatHMS(left);

  if (variant === "checkout") {
    return (
      <div className="deal-timer-card" aria-live="polite">
        <div className="deal-timer-label">⏱ Time left to buy with September80</div>
        <div className="deal-timer-digits">
          <span className="deal-unit">
            <strong>{h}</strong>
            <em>hrs</em>
          </span>
          <span className="deal-sep">:</span>
          <span className="deal-unit">
            <strong>{m}</strong>
            <em>min</em>
          </span>
          <span className="deal-sep">:</span>
          <span className="deal-unit">
            <strong>{s}</strong>
            <em>sec</em>
          </span>
        </div>
        <p className="deal-timer-note">
          Offer window refreshes every 12 hours · visual timer only
        </p>
      </div>
    );
  }

  return (
    <span className="deal-timer-inline" aria-live="polite">
      {" "}
      · TIME LEFT{" "}
      <span className="deal-clock">
        {h}:{m}:{s}
      </span>{" "}
      ·
    </span>
  );
}
