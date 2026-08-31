"use client";

import { useEffect, useMemo, useState } from "react";
import { getReviewsForProduct, averageRating, type Review } from "@/lib/reviews";

function Stars({ n }: { n: number }) {
  return (
    <span className="rev-stars" aria-label={`${n} out of 5`}>
      {"★★★★★".slice(0, n)}
      <span className="rev-stars-empty">{"★★★★★".slice(n)}</span>
    </span>
  );
}

export default function ProductReviews({ slug }: { slug: string }) {
  const seeded = useMemo(() => getReviewsForProduct(slug, 10), [slug]);
  const [reviews, setReviews] = useState<Review[]>(seeded);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    author: "",
    title: "",
    body: "",
    rating: 5,
    order_number: "",
  });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/reviews?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (!cancelled && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      } catch {
        /* keep seeded */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const avg = averageRating(reviews);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.author.trim() || !form.body.trim()) {
      setMsg("Name and review text required");
      return;
    }
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          author: form.author,
          title: form.title,
          body: form.body,
          rating: form.rating,
          order_number: form.order_number || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      if (data.review) {
        setReviews((r) => [data.review, ...r]);
      }
      setForm({ author: "", title: "", body: "", rating: 5, order_number: "" });
      setMsg(
        data.review?.verified
          ? "Thanks! Verified purchase review published."
          : "Thanks! Your review was saved."
      );
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Could not save review");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-head">
        <h2>Customer Reviews</h2>
        <div className="reviews-summary">
          <Stars n={Math.round(avg) || 5} />
          <strong>{avg || "—"}</strong>
          <span>
            ({reviews.length} rating{reviews.length === 1 ? "" : "s"}
            {loading ? " · loading…" : ""})
          </span>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map((r) => (
          <article key={String(r.id)} className="review-card">
            <div className="review-top">
              <Stars n={r.rating} />
              <span className="review-author">{r.author}</span>
              {r.verified ? (
                <span className="review-verified">✓ Verified Purchase</span>
              ) : (
                <span className="review-new">Customer</span>
              )}
              <span className="review-date">{r.date}</span>
            </div>
            <h3 className="review-title">{r.title}</h3>
            <p className="review-body">{r.body}</p>
            {r.helpful ? (
              <div className="review-helpful">
                {r.helpful} people found this helpful
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <form className="review-form" onSubmit={submit}>
        <h3>Write a review</h3>
        <p className="review-form-hint">
          Add your order number (e.g. JK-260831-48291-A3F) after a paid order to
          get a <strong>Verified Purchase</strong> badge. Reviews are stored in
          Supabase.
        </p>
        <label>
          Your name
          <input
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            required
          />
        </label>
        <label>
          Order number (optional — for verified badge)
          <input
            value={form.order_number}
            onChange={(e) => setForm({ ...form, order_number: e.target.value })}
            placeholder="JK-260831-48291-A3F"
          />
        </label>
        <label>
          Rating
          <select
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} stars
              </option>
            ))}
          </select>
        </label>
        <label>
          Title
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Great product"
          />
        </label>
        <label>
          Review
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={3}
            required
            placeholder="What did you like or dislike?"
          />
        </label>
        {msg ? <p className="review-msg">{msg}</p> : null}
        <button type="submit" className="btn" disabled={busy}>
          {busy ? "Saving…" : "Submit review"}
        </button>
      </form>
    </section>
  );
}
