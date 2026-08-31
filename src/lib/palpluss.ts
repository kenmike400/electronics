/** PalPluss (api.palpluss.com) M-Pesa STK Push */

export type StkResult = {
  ok: boolean;
  transactionId?: string;
  providerCheckoutId?: string;
  status?: string;
  phone?: string;
  message?: string;
  raw?: unknown;
};

function authHeader(): string {
  const basic = process.env.PAYPLUS_BASIC_AUTH || process.env.PALPLUSS_BASIC_AUTH;
  const key =
    process.env.PALPLUSS_API_KEY ||
    process.env.PAYPLUS_API_KEY ||
    "";
  if (basic) {
    // already base64 of "key:" or "key:secret"
    return basic.startsWith("Basic ") ? basic : `Basic ${basic}`;
  }
  if (key) {
    // Docs: username = API key, password empty → base64("key:")
    const encoded = Buffer.from(`${key}:`).toString("base64");
    return `Basic ${encoded}`;
  }
  return "";
}

export function normalizePhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("254") && d.length >= 12) return d.slice(0, 12);
  if (d.startsWith("0") && d.length >= 10) return "254" + d.slice(1, 10);
  if (d.length === 9) return "254" + d;
  return d;
}

export async function initiateStkPush(opts: {
  amount: number;
  phone: string;
  accountReference: string;
  transactionDesc?: string;
  callbackUrl?: string;
}): Promise<StkResult> {
  const auth = authHeader();
  if (!auth) {
    return { ok: false, message: "PalPluss API key not configured" };
  }

  const amount = Math.max(1, Math.round(Number(opts.amount)));
  const phone = normalizePhone(opts.phone);
  const accountReference = String(opts.accountReference)
    .replace(/[^a-zA-Z0-9-]/g, "")
    .slice(0, 12);
  const transactionDesc = String(opts.transactionDesc || "Order pay")
    .slice(0, 13);

  const site =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://jumia-kenya-electronics-shop-jumia.vercel.app";
  const callbackUrl =
    opts.callbackUrl || `${site.replace(/\/$/, "")}/api/mpesa/callback`;

  try {
    const res = await fetch("https://api.palpluss.com/v1/payments/stk", {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        phone,
        accountReference,
        transactionDesc,
        callbackUrl,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && (data.success || data.data?.transactionId)) {
      return {
        ok: true,
        transactionId: data.data?.transactionId,
        providerCheckoutId: data.data?.providerCheckoutId,
        status: data.data?.status || "PENDING",
        phone: data.data?.phone || phone,
        message:
          data.data?.resultDescription ||
          "STK push sent — enter M-Pesa PIN on your phone",
        raw: data,
      };
    }
    const msg =
      data?.error?.message ||
      data?.message ||
      data?.error ||
      data?.code ||
      `PalPluss ${res.status}`;
    return { ok: false, message: String(msg), raw: data };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Network error",
    };
  }
}
