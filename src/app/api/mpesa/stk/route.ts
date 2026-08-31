import { NextRequest, NextResponse } from "next/server";
import { initiateStkPush } from "@/lib/palpluss";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body.amount);
    const phone = String(body.phone || "");
    const orderNumber = String(body.order_number || body.accountReference || "ORDER");
    const desc = String(body.description || "Order pay");

    if (!phone || !amount || amount < 1) {
      return NextResponse.json(
        { ok: false, error: "phone and amount required" },
        { status: 400 }
      );
    }

    const result = await initiateStkPush({
      amount,
      phone,
      accountReference: orderNumber.slice(0, 12),
      transactionDesc: desc.slice(0, 13),
    });

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.message, raw: result.raw },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      transactionId: result.transactionId,
      checkoutRequestId: result.providerCheckoutId,
      status: result.status,
      phone: result.phone,
      message: result.message,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
