import type { Metadata } from "next";
import "./globals.css";
import HeaderActions from "@/components/HeaderActions";

export const metadata: Metadata = {
  title: "Jumia Kenya | Online Shopping for Electronics, Phones, Grocery & More",
  description:
    "Buy phones, TVs, groceries, appliances & more. Best prices in Kenya. Pay with M-Pesa.",
  icons: {
    icon: "https://www.jumia.co.ke/assets_he/favicon.87f00114.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="https://www.jumia.co.ke/assets_he/favicon.87f00114.ico"
        />
        <link
          rel="preconnect"
          href="https://ke.jumia.is"
        />
      </head>
      <body>
        {/* Top bar — matches Jumia utility row */}
        <div className="topbar">
          <div className="topbar-inner">
            <div>
              <a href="https://www.jumia.co.ke/" target="_blank" rel="noreferrer">
                Sell on Jumia
              </a>
              <a href="/">Jumia Pay</a>
            </div>
            <div>
              <a href="/account">Account</a>
              <a href="/checkout">Help</a>
              <a href="/cart">Cart</a>
            </div>
          </div>
        </div>

        {/* Main orange header */}
        <header className="header">
          <div className="header-inner">
            <a href="/" className="logo" title="Jumia Kenya">
              <img
                src="https://ke.jumia.is/cms/icons/jumialogo-x-4.png"
                alt="Jumia"
                width={100}
                height={32}
                style={{
                  height: 32,
                  width: "auto",
                  background: "transparent",
                  borderRadius: 0,
                }}
              />
            </a>
            <form className="search-wrap" action="/products" method="get">
              <input
                type="search"
                name="q"
                placeholder="Search products, brands and categories"
                aria-label="Search"
              />
              <button type="submit">SEARCH</button>
            </form>
            <HeaderActions />
          </div>
        </header>

        <nav className="cat-strip">
          <div className="cat-strip-inner">
            <a href="/products">All</a>
            <a href="/products?cat=Electronics">Electronics</a>
            <a href="/products?cat=Phones">Phones</a>
            <a href="/products?cat=Headphones">Headphones</a>
            <a href="/products?cat=Grocery">Grocery</a>
            <a href="/products?cat=Appliances">Appliances</a>
            <a href="/products?cat=Cooktops">Cooktops</a>
            <a href="/products?cat=Shoes">Shoes</a>
            <a href="/products?cat=Cookware">Cookware</a>
            <a href="/checkout">Checkout</a>
          </div>
        </nav>

        <div className="promo-banner" aria-label="Promotion September80">
          <div className="promo-track">
            <span>🔥 EVERYTHING UP TO 80% OFF — CODE <strong>September80</strong> · Items KSh 2,000+ → 80% OFF · Items under KSh 2,000 → 50% OFF · Site-wide at checkout · </span>
            <span>🔥 EVERYTHING UP TO 80% OFF — CODE <strong>September80</strong> · Items KSh 2,000+ → 80% OFF · Items under KSh 2,000 → 50% OFF · Site-wide at checkout · </span>
            <span>🔥 EVERYTHING UP TO 80% OFF — CODE <strong>September80</strong> · Items KSh 2,000+ → 80% OFF · Items under KSh 2,000 → 50% OFF · Site-wide at checkout · </span>
          </div>
        </div>

        <main className="container">{children}</main>

        <footer className="footer">
          <div className="footer-inner">
            <div>
              <h4>Need Help?</h4>
              <a href="/account">Your Account</a>
              <a href="/cart">Cart</a>
              <a href="/checkout">Checkout</a>
            </div>
            <div>
              <h4>About</h4>
              <a href="/products">All Products</a>
              <a href="/">Home</a>
            </div>
            <div>
              <h4>Payment methods</h4>
              <span className="mpesa-badge">M-Pesa only</span>
            </div>
            <div>
              <h4>Shop</h4>
              <a href="/products?cat=Electronics">Electronics</a>
              <a href="/products?cat=Grocery">Grocery</a>
            </div>
          </div>
          <div className="footer-bottom">
            © {new Date().getFullYear()} Jumia Kenya Electronics · Pay with M-Pesa
          </div>
        </footer>
      </body>
    </html>
  );
}
