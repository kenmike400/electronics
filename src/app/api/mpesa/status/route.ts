import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function authHeader(): string {
  const basic = process.env.PAYPLUS_BASIC_AUTH || "";
  const key = process.env.PALPLUSS_API_KEY || process.env.PAYPLUS_API_KEY || "";
  if (basic) return basic.startsWith("Basic ") ? basic : `Basic ${basic}`;
  if (key) {
    return `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
  }
  return "";
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  }
  const auth = authHeader();
  if (!auth) {
    return NextResponse.json({ ok: false, error: "not configured" }, { status: 500 });
  }
  try {
    const res = await fetch(`https://api.palpluss.com/v1/transactions/${id}`, {
      headers: { Authorization: auth },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    const tx = data.data || data;
    const status = String(tx.status || tx.Status || "UNKNOWN").toUpperCase();
    const success = ["SUCCESS", "COMPLETED", "PAID", "SUCCESSFUL"].includes(status);
    const failed = ["FAILED", "CANCELLED", "CANCELED", "EXPIRED", "TIMEOUT"].includes(
      status
    );
    return NextResponse.json({
      ok: true,
      status,
      success,
      failed,
      pending: !success && !failed,
      result_desc: tx.result_desc || tx.resultDescription || tx.message,
      transaction: tx,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "poll failed" },
      { status: 502 }
    );
  }
}
