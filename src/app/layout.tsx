import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jumia Kenya Electronics Shop",
  description: "Buy TVs, appliances, baby products & electronics — M-Pesa only",
  icons: {
    icon: "/images/jumia-logo.png",
    apple: "/images/jumia-logo.png",
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
        <link rel="icon" href="/images/jumia-logo.png" type="image/png" />
      </head>
      <body>
        <header className="header">
          <div className="container header-inner">
            <a href="/" className="logo">
              <img src="/images/jumia-logo.png" alt="Jumia" width={40} height={40} />
              <span>Electronics</span>
            </a>
            <nav>
              <a href="/">Home</a>
              <a href="/products">Products</a>
              <a href="/cart">Cart</a>
              <a href="/account">Account</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="footer">
          <div className="container">
            © {new Date().getFullYear()} Jumia Kenya Electronics · Pay with M-Pesa
          </div>
        </footer>
      </body>
    </html>
  );
}
