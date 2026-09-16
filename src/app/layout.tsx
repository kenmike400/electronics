import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import HeaderActions from "@/components/HeaderActions";
import SearchBox from "@/components/SearchBox";
import PromoCountdown from "@/components/PromoCountdown";
import PromoOverlay from "@/components/PromoOverlay";
import PostHogProvider from "@/components/PostHogProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Jumia Kenya | Online Shopping for Electronics, Phones, Grocery & More",
  description:
    "Buy phones, TVs, groceries, appliances, health & beauty & more. Best prices in Kenya. Pay with M-Pesa.",
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

        {/* Official PostHog snippet */}
        <Script id="posthog-snippet" strategy="afterInteractive">{
          `!function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="du vu fu pu yu init Bu Hu Nu qu Vu Kl ju Zu Ou th eh ih nh sh rh capture getExtension zu hu uh calculateEventProperties ah register register_once register_for_session unregister unregister_for_session ph Lu hh getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync gh identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset mh shutdown setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty dh Ku createPersonProfile setInternalOrTestUser fh bu opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Qu debug Xl Os getPageViewId captureTraceFeedback captureTraceMetric Pu".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
          posthog.init('phc_q7ZQgCnnCaBzXvVReHYUzUbzjk9bthBfYTyZGGvfq9od', {
              api_host: 'https://eu.i.posthog.com',
              defaults: '2026-05-30',
              person_profiles: 'identified_only'
          });`
        }</Script>
      </head>
      <body>
        <Suspense fallback={null}>
          <PostHogProvider>
            {/* Top bar — matches Jumia utility row */}
            <div className="topbar">
              <div className="topbar-inner">
                <div>
                  <a href="https://www.jumia.co.ke/" target="_blank" rel="noreferrer">
                    Sell on Jumia
                  </a>
                  <Link href="/" className="jumia-pay-link" title="Jumia Kenya Home">Jumia Pay</Link>
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
                <Link href="/" className="logo" title="Jumia Kenya — Home">
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
                </Link>
                <SearchBox />
                <HeaderActions />
              </div>
            </header>

            <nav className="cat-strip">
              <div className="cat-strip-inner">
                <Link href="/" className="cat-home">Home</Link>
                <Link href="/products">All</Link>
                <Link href="/products?cat=Electronics">Electronics</Link>
                <Link href="/products?cat=Phones">Phones</Link>
                <Link href="/products?cat=Headphones">Headphones</Link>
                <Link href="/products?cat=Health+%26+Beauty">Health & Beauty</Link>
                <Link href="/products?cat=Grocery">Grocery</Link>
                <Link href="/products?cat=Appliances">Appliances</Link>
                <Link href="/products?cat=Cooktops">Cooktops</Link>
                <Link href="/products?cat=Shoes">Shoes</Link>
                <Link href="/products?cat=Cookware">Cookware</Link>
                <Link href="/checkout">Checkout</Link>
              </div>
            </nav>

            <div className="promo-banner" aria-label="Promotion September80">
              <div className="promo-track">
                <span>🔥 EVERYTHING UP TO 80% OFF — CODE <strong>September80</strong> · Items KSh 2,000+ → 80% OFF · under KSh 2,000 → 50% OFF <PromoCountdown /> Site-wide at checkout · </span>
                <span>🔥 EVERYTHING UP TO 80% OFF — CODE <strong>September80</strong> · Items KSh 2,000+ → 80% OFF · under KSh 2,000 → 50% OFF <PromoCountdown /> Site-wide at checkout · </span>
                <span>🔥 EVERYTHING UP TO 80% OFF — CODE <strong>September80</strong> · Items KSh 2,000+ → 80% OFF · under KSh 2,000 → 50% OFF <PromoCountdown /> Site-wide at checkout · </span>
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
                  <Link href="/products">All Products</Link>
                  <Link href="/">Home</Link>
                </div>
                <div>
                  <h4>Payment methods</h4>
                  <span className="mpesa-badge">M-Pesa only</span>
                </div>
                <div>
                  <h4>Shop</h4>
                  <a href="/products?cat=Electronics">Electronics</a>
                  <a href="/products?cat=Health+%26+Beauty">Health & Beauty</a>
                  <a href="/products?cat=Grocery">Grocery</a>
                </div>
              </div>
              <div className="footer-bottom">
                © {new Date().getFullYear()} Jumia Kenya Electronics · Pay with M-Pesa
              </div>
            </footer>

            <PromoOverlay />

            {/* Vercel Analytics - correct Next.js import */}
            <Analytics />
            <SpeedInsights />
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
