/** Deterministic verified reviews for every product (Jumia-style) */

export type Review = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
};

const AUTHORS = [
  "Faith W.", "Brian K.", "Amina N.", "John M.", "Grace O.",
  "Peter L.", "Mary W.", "Kevin O.", "Esther N.", "Daniel K.",
  "Lucy A.", "Samuel O.", "Njeri M.", "Collins K.", "Wanjiku P.",
];

const TITLES = [
  "Great value for money",
  "Works as described",
  "Fast delivery",
  "Good quality",
  "Highly recommend",
  "Solid product",
  "Better than expected",
  "Perfect for home use",
  "Worth the price",
  "Excellent purchase",
];

const BODIES = [
  "Ordered via M-Pesa and received on time. Packaging was neat and the item matches the photos.",
  "Verified purchase. Build quality is good for the price. Will buy again from this shop.",
  "Used it for a week now — no issues. Checkout with September80 made it even better.",
  "Delivery to my county was smooth. Product performs well, stars for the seller.",
  "Looks exactly like the listing. Battery/power and finish are solid.",
  "Family loves it. Simple to use and feels durable. Recommended.",
  "Had a small delay but support sorted it. Product itself is excellent.",
  "Clear instructions included. Works great for daily use in Nairobi.",
  "Compared with other shops — this was the best deal after the promo code.",
  "Five stars for quality and the M-Pesa checkout experience.",
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** ~10 verified reviews unique per product slug */
export function getReviewsForProduct(slug: string, count = 10): Review[] {
  const base = hash(slug || "product");
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const h = hash(`${slug}-${i}-${base}`);
    const rating = 3 + (h % 3); // 3–5 stars
    const day = 1 + (h % 28);
    const month = 1 + (h % 8);
    reviews.push({
      id: `${slug}-r${i}`,
      author: AUTHORS[(h + i) % AUTHORS.length],
      rating,
      title: TITLES[(h + i * 3) % TITLES.length],
      body: BODIES[(h + i * 5) % BODIES.length],
      date: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      verified: true,
      helpful: 1 + (h % 24),
    });
  }
  // Sort highest rating first
  return reviews.sort((a, b) => b.rating - a.rating || b.helpful - a.helpful);
}

export function averageRating(reviews: Review[]): number {
  if (!reviews.length) return 0;
  return (
    Math.round(
      (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10
    ) / 10
  );
}
