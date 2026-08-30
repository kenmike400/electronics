import { NextRequest, NextResponse } from "next/server";
import { orderReceiptHtml } from "@/lib/email";

function orderNumber() {
  return (
    "JK" +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      address,
      county,
      sublocation,
      items,
      total,
      subtotal,
      discount,
      promo_code,
      payment_method = "mpesa",
    } = body;

    if (!name || !email || !phone || !items?.length || !total) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (payment_method !== "mpesa") {
      return NextResponse.json(
        { error: "Only M-Pesa payment is supported" },
        { status: 400 }
      );
    }

    const onum = orderNumber();
    const shippingLine = [address, sublocation, county].filter(Boolean).join(', ') || address;
    let orderId: string | null = null;

    // Try Supabase when keys are present
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        let profileId: string | null = null;
        const { data: existing } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", email)
          .maybeSingle();

        if (existing?.id) {
          profileId = existing.id;
          await supabase
            .from("profiles")
            .update({ full_name: name, phone })
            .eq("id", profileId);
        } else {
          const { data: created } = await supabase
            .from("profiles")
            .insert({ email, full_name: name, phone })
            .select("id")
            .single();
          profileId = created?.id ?? null;
        }

        const { data, error } = await supabase
          .from("orders")
          .insert({
            order_number: onum,
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            shipping_address: shippingLine,
            total: Number(total),
            status: "paid",
            payment_method: "mpesa",
            payment_ref: `MPESA-${onum}`,
            items,
            profile_id: profileId,
          })
          .select("order_number, id")
          .single();

        if (!error && data) {
          orderId = data.id;
        } else if (error) {
          console.error("Order insert error:", error);
        }
      } catch (dbErr) {
        console.error("Supabase unavailable, continuing with local order", dbErr);
      }
    }

    const receiptHtml = orderReceiptHtml({
      orderNumber: onum,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      address: address || "",
      total: Number(total),
      items: items.map((i: { name: string; qty: number; price: number }) => ({
        name: i.name,
        qty: i.qty,
        price: Number(i.price),
      })),
    });

    let emailSent = false;
    let emailError: string | null = null;
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const from =
          process.env.RESEND_FROM ||
          "Jumia Electronics <orders@jumia-kenya-electronics-shop-jumia.bbroot.com>";
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: [email],
            subject: `Order ${onum} — Jumia Electronics (M-Pesa)`,
            html: receiptHtml,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.id) {
          emailSent = true;
        } else {
          emailError = data?.message || data?.error || `Resend ${res.status}`;
          console.error("Resend failed", data);
        }
      } catch (e) {
        emailError = e instanceof Error ? e.message : "Resend network error";
        console.error("Resend error", e);
      }
    } else {
      emailError = "RESEND_API_KEY not configured";
    }

    return NextResponse.json({
      ok: true,
      order_number: onum,
      id: orderId,
      email_sent: emailSent,
      email_error: emailError,
      receipt_html: receiptHtml,
      redirect_url: "https://www.jumia.co.ke/",
    });
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
