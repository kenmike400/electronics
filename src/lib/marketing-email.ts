/** Mini-store promo HTML for Resend marketing */

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://jumia-kenya-electronics-shop-jumia.vercel.app";

export type PromoProduct = {
  name: string;
  price: string;
  oldPrice?: string;
  href: string;
  image: string;
  discount?: string;
};

const DEFAULT_PRODUCTS: PromoProduct[] = [
  {
    name: "Haier 3Gas + 1 60x60 Cooker",
    price: "KSh 32,000",
    oldPrice: "KSh 47,995",
    discount: "-33%",
    href: `${SITE}/products?cat=Appliances`,
    image: "https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/45/8916823/1.jpg?6345",
  },
  {
    name: "Samsung Galaxy A06 4+64GB",
    price: "KSh 12,450",
    oldPrice: "KSh 14,300",
    discount: "-13%",
    href: `${SITE}/products?cat=Phones`,
    image: "https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/10/9862913/1.jpg?1789",
  },
  {
    name: "Vision Plus Double Door Fridge 138L",
    price: "KSh 23,870",
    oldPrice: "KSh 29,000",
    discount: "-18%",
    href: `${SITE}/products?cat=Appliances`,
    image: "https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/26/3941623/1.jpg?9429",
  },
  {
    name: "Sonar Electric Kettle 2.0L",
    price: "KSh 530",
    oldPrice: "KSh 650",
    discount: "-18%",
    href: `${SITE}/products?cat=Appliances`,
    image: "https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/45/8916823/1.jpg?6345",
  },
  {
    name: "Kuhl Power Bank 20000mAh",
    price: "KSh 619",
    oldPrice: "KSh 1,340",
    discount: "-54%",
    href: `${SITE}/products?cat=Electronics`,
    image: "https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/66/7016623/1.jpg?0431",
  },
  {
    name: "Fresh Fri Vegetable Cooking Oil 5L",
    price: "KSh 1,249",
    oldPrice: "KSh 1,850",
    discount: "-32%",
    href: `${SITE}/products?cat=Grocery`,
    image: "https://ke.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/59/9747523/1.jpg?6564",
  },
];

export function buildPromoEmailHtml(opts: {
  promoUrl?: string;
  accessCode?: string;
  products?: PromoProduct[];
}) {
  const promoUrl = opts.promoUrl || "https://bit.ly/4h20inK";
  const access = opts.accessCode || "September80";
  const products = opts.products || DEFAULT_PRODUCTS;
  const shopUrl = SITE;

  const cards = products
    .map(
      (p) => `
      <td width="50%" valign="top" style="padding:8px;">
        <a href="${p.href}" style="text-decoration:none;color:#282828;display:block;border:1px solid #eee;border-radius:8px;overflow:hidden;">
          <div style="position:relative;background:#fafafa;text-align:center;padding:12px;">
            ${p.discount ? `<span style="background:#f68b1e;color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:12px;">${p.discount}</span>` : ""}
            <img src="${p.image}" alt="${escapeHtml(p.name)}" width="140" height="140" style="display:block;margin:8px auto 0;object-fit:contain;max-width:140px;height:140px;" />
          </div>
          <div style="padding:10px 12px 14px;">
            <div style="font-size:13px;line-height:1.35;min-height:36px;color:#282828;">${escapeHtml(p.name)}</div>
            <div style="margin-top:8px;">
              <span style="display:inline-block;background:#f68b1e;color:#fff;font-weight:700;font-size:14px;padding:8px 14px;border-radius:20px;">${escapeHtml(p.price)}</span>
            </div>
            ${p.oldPrice ? `<div style="margin-top:4px;font-size:12px;color:#999;text-decoration:line-through;">${escapeHtml(p.oldPrice)}</div>` : ""}
          </div>
        </a>
      </td>`
    )
    .join("");

  // pair into rows of 2
  const rows: string[] = [];
  const cells = products.map(
    (p, i) => `
    <td width="50%" valign="top" style="padding:8px;">
      <a href="${p.href}" style="text-decoration:none;color:#282828;display:block;border:1px solid #eee;border-radius:8px;overflow:hidden;background:#fff;">
        <div style="background:#fafafa;text-align:center;padding:12px;">
          ${p.discount ? `<div style="text-align:right;"><span style="background:#f68b1e;color:#fff;font-size:11px;font-weight:700;padding:3px 8px;border-radius:12px;">${p.discount}</span></div>` : ""}
          <img src="${p.image}" alt="${escapeHtml(p.name)}" width="140" height="140" style="display:block;margin:8px auto 0;object-fit:contain;" />
        </div>
        <div style="padding:10px 12px 14px;">
          <div style="font-size:13px;line-height:1.35;min-height:36px;">${escapeHtml(p.name)}</div>
          <div style="margin-top:8px;">
            <span style="display:inline-block;background:#f68b1e;color:#fff;font-weight:700;font-size:14px;padding:8px 14px;border-radius:20px;">${escapeHtml(p.price)}</span>
          </div>
          ${p.oldPrice ? `<div style="margin-top:4px;font-size:12px;color:#999;text-decoration:line-through;">${escapeHtml(p.oldPrice)}</div>` : ""}
        </div>
      </a>
    </td>`
  );
  for (let i = 0; i < cells.length; i += 2) {
    rows.push(
      `<tr>${cells[i]}${cells[i + 1] || "<td width='50%'></td>"}</tr>`
    );
  }

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:16px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="background:#f68b1e;padding:16px 20px;">
            <img src="https://ke.jumia.is/cms/icons/jumialogo-x-4.png" alt="Jumia" height="28" style="display:block;background:transparent;" />
          </td>
        </tr>
        <tr>
          <td style="background:linear-gradient(90deg,#7b2cbf,#9b5de5);padding:28px 20px;text-align:center;">
            <div style="color:#fff;font-size:28px;font-weight:800;letter-spacing:0.02em;">UP TO 80% OFF</div>
            <div style="color:#ffe08a;font-size:14px;margin-top:8px;">Festival deals · Selected items · Limited time</div>
            <div style="margin-top:14px;">
              <span style="background:#fff;color:#7b2cbf;font-weight:800;padding:8px 16px;border-radius:6px;font-size:16px;">CODE: ${escapeHtml(access)}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 16px 8px;text-align:center;">
            <p style="margin:0 0 12px;font-size:15px;color:#333;">
              Shop phones, TVs, fridges, grocery &amp; more — pay with <strong>M-Pesa</strong>.
            </p>
            <a href="${promoUrl}" style="display:inline-block;background:#f68b1e;color:#fff;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:6px;font-size:16px;">
              Open mini store · Get 80% off →
            </a>
            <p style="margin:12px 0 0;font-size:12px;color:#888;">
              Or visit <a href="${shopUrl}" style="color:#f68b1e;">${shopUrl.replace(/^https?:\/\//, "")}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 8px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${rows.join("")}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 20px 24px;text-align:center;">
            <a href="${shopUrl}/products" style="display:inline-block;border:2px solid #f68b1e;color:#f68b1e;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:6px;">
              Browse all products
            </a>
            <p style="margin:16px 0 0;font-size:12px;color:#75757a;">
              Code <strong>${escapeHtml(access)}</strong> · Items KSh 2,000+ up to 80% off · Under KSh 2,000 up to 50% off at checkout
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#222;color:#aaa;padding:14px 20px;font-size:11px;text-align:center;">
            Jumia Kenya Electronics · You received this because you shopped or subscribed ·
            <a href="${shopUrl}" style="color:#f68b1e;">Unsubscribe / manage</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
