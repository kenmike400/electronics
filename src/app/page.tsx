import Link from "next/link";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

function disc(price: number, compare?: number | null) {
  if (!compare || compare <= price) return null;
  return Math.round(((compare - price) / compare) * 100);
}

const SLIDES = [
  {
    src: "https://ke.jumia.is/cms/2026/JFEST/Live/Day3/Homepageslider1248x357_rvsd.jpg",
    href: "/products",
    alt: "Jumia Festival deals",
  },
  {
    src: "https://ke.jumia.is/cms/2026/JFEST/Live/Day3/phones_1248x357.jpg",
    href: "/products?cat=Phones",
    alt: "Phones deals",
  },
  {
    src: "https://ke.jumia.is/cms/2026/JFEST/Live/Day3/TVs_1248x357.jpg",
    href: "/products?cat=Electronics",
    alt: "Smart TVs",
  },
  {
    src: "https://ke.jumia.is/cms/2026/JFEST/Live/Day3/appliances_slider_sx.jpg",
    href: "/products?cat=Appliances",
    alt: "Appliances",
  },
  {
    src: "https://ke.jumia.is/cms/2026/JFEST/Live/Day3/Fashion_1248x357.jpg",
    href: "/products?cat=Shoes",
    alt: "Fashion & shoes",
  },
  {
    src: "https://ke.jumia.is/cms/2026/JFEST/Live/Day3/Home_1248x357.jpg",
    href: "/products?cat=Grocery",
    alt: "Home essentials",
  },
];

const CAT_TILES = [
  {
    name: "Phones",
    href: "/products?cat=Phones",
    img: "https://ke.jumia.is/cms/2026/FL/Smarphones.png",
  },
  {
    name: "Smart TVs",
    href: "/products?cat=Electronics",
    img: "https://ke.jumia.is/cms/2026/FL/SmartTVs.png",
  },
  {
    name: "Home Audio",
    href: "/products?cat=Headphones",
    img: "https://ke.jumia.is/cms/2026/FL/HomeAudio_.png",
  },
  {
    name: "Blenders",
    href: "/products?cat=Appliances",
    img: "https://ke.jumia.is/cms/2026/FL/Blenders.png",
  },
  {
    name: "Washing Machines",
    href: "/products?cat=Appliances",
    img: "https://ke.jumia.is/cms/2026/FL/WashingMacines.png",
  },
  {
    name: "Food Cupboard",
    href: "/products?cat=Grocery",
    img: "https://ke.jumia.is/cms/2026/FL/FoodCupboard.png",
  },
  {
    name: "Computing",
    href: "/products?cat=Electronics",
    img: "https://ke.jumia.is/cms/2026/FL/Informatique.png",
  },
  {
    name: "Lighting",
    href: "/products?cat=Home%20%26%20Office",
    img: "https://ke.jumia.is/cms/2026/FL/HomeLighting.png",
  },
  {
    name: "Men's Fashion",
    href: "/products?cat=Shoes",
    img: "https://ke.jumia.is/cms/2026/FL/MensClothing.png",
  },
  {
    name: "Cooktops",
    href: "/products?cat=Cooktops",
    img: "https://ke.jumia.is/cms/2026/FL/Blenders.png",
  },
  {
    name: "Freebies",
    href: "/products?cat=Electronics",
    img: "https://ke.jumia.is/cms/2026/FL/SmartTVs.png",
  },
  {
    name: "All Products",
    href: "/products",
    img: "https://ke.jumia.is/cms/icons/jumialogo-x-4.png",
  },
];

function ProductCard({
  p,
}: {
  p: {
    id?: string;
    slug: string;
    name: string;
    price: number;
    compare_at_price?: number | null;
    image_url: string;
  };
}) {
  const d = disc(Number(p.price), p.compare_at_price);
  return (
    <article className="prd">
      <Link href={`/products/${p.slug}`}>
        <div className="prd-img">
          {d ? <span className="prd-badge">-{d}%</span> : null}
          <img src={p.image_url} alt={p.name} loading="lazy" />
        </div>
        <div className="prd-body">
          <div className="prd-name">{p.name}</div>
          <div className="prd-price">
            KSh {Number(p.price).toLocaleString()}
          </div>
          {p.compare_at_price ? (
            <div className="prd-old">
              KSh {Number(p.compare_at_price).toLocaleString()}
            </div>
          ) : null}
          <div className="prd-ship">Jumia Express</div>
        </div>
      </Link>
      <div className="prd-body" style={{ paddingTop: 0 }}>
        <Link href={`/products/${p.slug}`} className="prd-btn">
          Buy now
        </Link>
      </div>
    </article>
  );
}

export default async function HomePage() {
  const all = await getProducts({ limit: 120 });
  const flash = all.slice(0, 12);
  const phones = all
    .filter((p) => /phone|iphone|samsung|tecno|xiaomi|infinix/i.test(p.name + (p.category || "")))
    .slice(0, 12);
  const tvs = all
    .filter((p) => /tv|vitron|tcl|syinix|qled/i.test(p.name + (p.category || "")))
    .slice(0, 12);
  const appliances = all
    .filter((p) => /appliance|blender|kettle|cooker|fridge|washer/i.test(p.name + (p.category || "")))
    .slice(0, 12);
  const shoes = all
    .filter((p) => /shoe|sandal|sneaker|heel/i.test(p.name + (p.category || "")))
    .slice(0, 12);
  const more = all.slice(12, 36);

  return (
    <>
      {/* Hero slider — Jumia CMS banners */}
      <section className="home-slider" aria-label="Featured promotions">
        <div className="home-slider-track">
          {SLIDES.map((s, i) => (
            <Link key={i} href={s.href} className="home-slide">
              <img src={s.src} alt={s.alt} loading={i === 0 ? "eager" : "lazy"} />
            </Link>
          ))}
        </div>
      </section>

      {/* Category tiles */}
      <section className="cat-tiles" aria-label="Shop by category">
        {CAT_TILES.map((c) => (
          <Link key={c.name} href={c.href} className="cat-tile">
            <div className="cat-tile-img">
              <img src={c.img} alt={c.name} loading="lazy" />
            </div>
            <span>{c.name}</span>
          </Link>
        ))}
      </section>

      {/* Flash / top deals */}
      <div className="section-head section-flash">
        <h2>🔥 Flash sales — up to 80% off</h2>
        <Link href="/products">See all →</Link>
      </div>
      <div className="prd-grid">
        {flash.map((p) => (
          <ProductCard key={p.slug || p.id} p={p} />
        ))}
      </div>

      {/* Phones */}
      {phones.length > 0 && (
        <>
          <div className="section-head">
            <h2>Phones &amp; tablets</h2>
            <Link href="/products?cat=Phones">See all →</Link>
          </div>
          <div className="prd-grid">
            {phones.map((p) => (
              <ProductCard key={p.slug || p.id} p={p} />
            ))}
          </div>
        </>
      )}

      {/* TVs */}
      {tvs.length > 0 && (
        <>
          <div className="section-head">
            <h2>Smart TVs</h2>
            <Link href="/products?cat=Electronics">See all →</Link>
          </div>
          <div className="prd-grid">
            {tvs.map((p) => (
              <ProductCard key={p.slug || p.id} p={p} />
            ))}
          </div>
        </>
      )}

      {/* Appliances */}
      {appliances.length > 0 && (
        <>
          <div className="section-head">
            <h2>Home appliances</h2>
            <Link href="/products?cat=Appliances">See all →</Link>
          </div>
          <div className="prd-grid">
            {appliances.map((p) => (
              <ProductCard key={p.slug || p.id} p={p} />
            ))}
          </div>
        </>
      )}

      {/* Shoes */}
      {shoes.length > 0 && (
        <>
          <div className="section-head">
            <h2>Shoes &amp; fashion</h2>
            <Link href="/products?cat=Shoes">See all →</Link>
          </div>
          <div className="prd-grid">
            {shoes.map((p) => (
              <ProductCard key={p.slug || p.id} p={p} />
            ))}
          </div>
        </>
      )}

      {/* More for you */}
      {more.length > 0 && (
        <>
          <div className="section-head">
            <h2>More for you</h2>
            <Link href="/products">See all →</Link>
          </div>
          <div className="prd-grid">
            {more.map((p) => (
              <ProductCard key={p.slug || p.id} p={p} />
            ))}
          </div>
        </>
      )}

      <section className="home-cta">
        <p>
          Pay with <strong>M-Pesa only</strong>. Use code{" "}
          <strong>September80</strong> at checkout — 80% off items over KSh
          2,000, 50% off under KSh 2,000.
        </p>
        <Link href="/products" className="btn">
          Shop all products
        </Link>
      </section>
    </>
  );
}
