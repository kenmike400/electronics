"use client";

import { useEffect, useState } from "react";

/**
 * Deal windows: 2:00 AM → 2:00 PM, then 2:00 PM → 2:00 AM (next day).
 * East Africa Time (Africa/Nairobi). Visual only.
 */

function nowInNairobiParts(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) =>
    Number(parts.find((p) => p.type === t)?.value || "0");
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

/** Nairobi wall time → UTC ms (EAT = UTC+3, no DST) */
function nairobiWallToUtcMs(
  year: number,
  month: number,
  day: number,
  hour: number
) {
  return Date.UTC(year, month - 1, day, hour - 3, 0, 0, 0);
}

function nextBoundaryUtc(now = Date.now()) {
  const n = nowInNairobiParts(new Date(now));
  const today2am = nairobiWallToUtcMs(n.year, n.month, n.day, 2);
  const today2pm = nairobiWallToUtcMs(n.year, n.month, n.day, 14);

  if (now < today2am) return today2am;
  if (now < today2pm) return today2pm;

  // after 2pm → tomorrow 2am
  const tom = new Date(Date.UTC(n.year, n.month - 1, n.day + 1));
  return nairobiWallToUtcMs(
    tom.getUTCFullYear(),
    tom.getUTCMonth() + 1,
    tom.getUTCDate(),
    2
  );
}

function remainingMs(now = Date.now()) {
  return Math.max(0, nextBoundaryUtc(now) - now);
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

function endsAtLabel(now = Date.now()) {
  const end = nextBoundaryUtc(now);
  const n = nowInNairobiParts(new Date(end));
  const ampm = n.hour >= 12 ? "PM" : "AM";
  const h12 = n.hour % 12 || 12;
  return `${h12}:00 ${ampm}`;
}

type Props = {
  variant?: "banner" | "checkout";
};

export default function PromoCountdown({ variant = "banner" }: Props) {
  const [left, setLeft] = useState(0);
  const [ends, setEnds] = useState("2:00 PM");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tick = () => {
      setLeft(remainingMs());
      setEnds(endsAtLabel());
      setReady(true);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const { h, m, s } = formatHMS(left);

  if (variant === "checkout") {
    return (
      <div className="deal-timer-card" aria-live="polite">
        <div className="deal-timer-label">
          ⏱ Time left to buy with September80
        </div>
        <div className="deal-timer-digits">
          <span className="deal-unit">
            <strong>{ready ? h : "--"}</strong>
            <em>hrs</em>
          </span>
          <span className="deal-sep">:</span>
          <span className="deal-unit">
            <strong>{ready ? m : "--"}</strong>
            <em>min</em>
          </span>
          <span className="deal-sep">:</span>
          <span className="deal-unit">
            <strong>{ready ? s : "--"}</strong>
            <em>sec</em>
          </span>
        </div>
        <p className="deal-timer-note">
          Resets every day at <strong>2:00 AM</strong> &amp;{" "}
          <strong>2:00 PM</strong> (EAT) · next reset {ready ? ends : "…"} ·
          visual only
        </p>
      </div>
    );
  }

  return (
    <span className="deal-timer-inline" aria-live="polite">
      {" "}
      · TIME LEFT{" "}
      <span className="deal-clock">
        {ready ? `${h}:${m}:${s}` : "--:--:--"}
      </span>{" "}
      (til {ready ? ends : "2 PM"}) ·
    </span>
  );
}
