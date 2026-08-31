import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** PalPluss / M-Pesa result webhook — acknowledge and log */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    console.log("M-Pesa callback:", JSON.stringify(body).slice(0, 2000));

    // Optionally update order status in Supabase when payment succeeds
    const status =
      body?.data?.status ||
      body?.status ||
      body?.Body?.stkCallback?.ResultCode;
    const success =
      status === "SUCCESS" ||
      status === "COMPLETED" ||
      status === 0 ||
      status === "0";

    if (success && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          { auth: { persistSession: false } }
        );
        const ref =
          body?.data?.accountReference ||
          body?.accountReference ||
          body?.data?.transactionId;
        if (ref) {
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              payment_ref: String(
                body?.data?.providerCheckoutId ||
                  body?.data?.transactionId ||
                  ref
              ),
            })
            .eq("order_number", String(ref));
        }
      } catch (e) {
        console.error("callback db update", e);
      }
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  } catch {
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "mpesa-callback" });
}
