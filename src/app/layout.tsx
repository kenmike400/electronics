import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jumia Kenya | Electronics, Phones, TVs & More",
  description:
    "Shop TVs, phones, headphones, appliances & more. Best prices in Kenya. Pay with M-Pesa.",
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
      </head>
      <body>
        <div className="topbar">
          <div className="topbar-inner">
            <span>Sell on Jumia · Jumia Pay · Official Stores</span>
            <div>
              <a href="/account">Account</a>
              <a href="/checkout">Help</a>
              <a href="/cart">Cart</a>
            </div>
          </div>
        </div>

        <header className="header">
          <div className="header-inner">
            <a href="/" className="logo">
              <img
                src="/images/jumia-logo.png"
                alt="Jumia"
                width={40}
                height={40}
              />
              <span>JUMIA</span>
            </a>
            <form className="search-wrap" action="/products" method="get">
              <input
                type="search"
                name="q"
                placeholder="Search products, brands and categories"
                aria-label="Search"
              />
              <button type="submit">Search</button>
            </form>
            <div className="header-actions">
              <a href="/account">
                <span>Account</span>
              </a>
              <a href="/checkout">
                <span>Help</span>
              </a>
              <a href="/cart">
                <span>Cart</span>
              </a>
            </div>
          </div>
        </header>

        <nav className="cat-strip">
          <div className="cat-strip-inner">
            <a href="/products">All Products</a>
            <a href="/products?cat=Headphones">Headphones</a>
            <a href="/products?cat=Phones">Phones</a>
            <a href="/products?cat=Televisions">TVs</a>
            <a href="/products?cat=Electronics">Electronics</a>
            <a href="/products?cat=Appliances">Appliances</a>
            <a href="/products?cat=Cookware">Cookware</a>
            <a href="/products?cat=Grocery">Grocery</a>
            <a href="/cart">Cart</a>
            <a href="/checkout">Checkout</a>
          </div>
        </nav>

        <main className="container">{children}</main>

        <footer className="footer">
          <div className="footer-inner">
            <div>
              <h4>Need Help?</h4>
              <a href="/account">Your Account</a>
              <a href="/checkout">Checkout &amp; Payment</a>
              <a href="/cart">Cart</a>
            </div>
            <div>
              <h4>About</h4>
              <a href="/products">Browse Products</a>
              <a href="/">Home</a>
            </div>
            <div>
              <h4>Payment</h4>
              <p style={{ marginBottom: 8 }}>M-Pesa only</p>
              <span className="mpesa-badge">M-Pesa</span>
            </div>
            <div>
              <h4>Make Money</h4>
              <a href="/products">Shop Electronics</a>
            </div>
          </div>
          <div className="footer-bottom">
            © {new Date().getFullYear()} Jumia Kenya Electronics · Pay with
            M-Pesa
          </div>
        </footer>
      </body>
    </html>
  );
}
