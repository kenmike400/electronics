"use client";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  slug: string;
};

export default function AddToCartButton({ product }: { product: Product }) {
  function add() {
    const raw = localStorage.getItem("cart");
    const cart: Array<{
      id: string;
      name: string;
      price: number;
      image_url?: string | null;
      slug: string;
      qty: number;
    }> = raw ? JSON.parse(raw) : [];

    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image_url: product.image_url,
        slug: product.slug,
        qty: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  }

  return (
    <button type="button" className="btn" onClick={add}>
      Add to cart
    </button>
  );
}
