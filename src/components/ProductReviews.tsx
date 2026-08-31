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
  const [extra, setExtra] = useState<Review[]>([]);
  const [form, setForm] = useState({ author: "", title: "", body: "", rating: 5 });
  const [msg, setMsg] = useState("");

  const reviews = [...extra, ...seeded];
  const avg = averageRating(reviews);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.author.trim() || !form.body.trim()) {
      setMsg("Name and review text required");
      return;
    }
    const r: Review = {
      id: `local-${Date.now()}`,
      author: form.author.trim().slice(0, 40),
      rating: form.rating,
      title: form.title.trim() || "Customer review",
      body: form.body.trim().slice(0, 500),
      date: new Date().toISOString().slice(0, 10),
      verified: false,
      helpful: 0,
    };
    setExtra((x) => [r, ...x]);
    try {
      const key = `reviews:${slug}`;
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(key, JSON.stringify([r, ...prev].slice(0, 20)));
    } catch {}
    setForm({ author: "", title: "", body: "", rating: 5 });
    setMsg("Thanks! Your review was added.");
  }

  useEffect(() => {
    try {
      const prev = JSON.parse(localStorage.getItem(`reviews:${slug}`) || "[]");
      if (Array.isArray(prev) && prev.length) setExtra(prev);
    } catch {}
  }, [slug]);

  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-head">
        <h2>Customer Reviews</h2>
        <div className="reviews-summary">
          <Stars n={Math.round(avg)} />
          <strong>{avg}</strong>
          <span>({reviews.length} verified ratings)</span>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map((r) => (
          <article key={r.id} className="review-card">
            <div className="review-top">
              <Stars n={r.rating} />
              <span className="review-author">{r.author}</span>
              {r.verified ? (
                <span className="review-verified">✓ Verified Purchase</span>
              ) : (
                <span className="review-new">New</span>
              )}
              <span className="review-date">{r.date}</span>
            </div>
            <h3 className="review-title">{r.title}</h3>
            <p className="review-body">{r.body}</p>
            <div className="review-helpful">{r.helpful} people found this helpful</div>
          </article>
        ))}
      </div>

      <form className="review-form" onSubmit={submit}>
        <h3>Write a review</h3>
        <p className="review-form-hint">
          Share your experience. Verified purchases show a badge after order completion.
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
        <button type="submit" className="btn">
          Submit review
        </button>
      </form>
    </section>
  );
}
