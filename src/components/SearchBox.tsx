"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Hit = {
  slug: string;
  name: string;
  price: number;
  image_url?: string;
  brand?: string;
  category?: string;
  compare_at_price?: number | null;
};

export default function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (term: string) => {
    const t = term.trim();
    if (t.length < 1) {
      setHits([]);
      setOpen(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(t)}`);
      const data = await res.json();
      setHits(Array.isArray(data.results) ? data.results : []);
      setOpen(true);
      setActive(-1);
    } catch {
      setHits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => runSearch(q), 220);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q, runSearch]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const term = q.trim();
    if (!term) return;
    setOpen(false);
    if (active >= 0 && hits[active]) {
      router.push(`/products/${hits[active].slug}`);
      return;
    }
    router.push(`/products?q=${encodeURIComponent(term)}`);
  }

  function onKey(e: React.KeyboardEvent) {
    if (!open || hits.length === 0) {
      if (e.key === "Enter") submit();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % hits.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? hits.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="search-wrap search-predict" ref={wrapRef}>
      <form onSubmit={submit} role="search" autoComplete="off">
        <input
          type="search"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => q.trim() && hits.length > 0 && setOpen(true)}
          onKeyDown={onKey}
          placeholder="Search products, brands and categories"
          aria-label="Search"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="search-suggest"
        />
        <button type="submit">SEARCH</button>
      </form>

      {open && (
        <div className="search-dropdown" id="search-suggest" role="listbox">
          {loading && hits.length === 0 && (
            <div className="search-empty">Searching…</div>
          )}
          {!loading && hits.length === 0 && q.trim() && (
            <div className="search-empty">
              No matches for “{q.trim()}”
              <button
                type="button"
                className="search-see-all"
                onClick={() => submit()}
              >
                Search all products →
              </button>
            </div>
          )}
          {hits.map((h, i) => (
            <Link
              key={h.slug}
              href={`/products/${h.slug}`}
              className={`search-hit${i === active ? " active" : ""}`}
              role="option"
              aria-selected={i === active}
              onClick={() => setOpen(false)}
              onMouseEnter={() => setActive(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={h.image_url || ""} alt="" />
              <div className="search-hit-body">
                <div className="search-hit-name">{h.name}</div>
                <div className="search-hit-meta">
                  {[h.brand, h.category].filter(Boolean).join(" · ")}
                </div>
                <div className="search-hit-price">
                  KSh {Number(h.price).toLocaleString()}
                  {h.compare_at_price ? (
                    <span className="search-hit-old">
                      KSh {Number(h.compare_at_price).toLocaleString()}
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
          {hits.length > 0 && (
            <button
              type="button"
              className="search-see-all"
              onClick={() => submit()}
            >
              See all results for “{q.trim()}” →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
