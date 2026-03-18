import { NextResponse } from "next/server";

// Backend expects PATCH (Allow: PATCH). We expose POST for the frontend
// and forward it as PATCH upstream.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const wallet_address = String(body?.wallet_address ?? "").toLowerCase();
    const user_name = String(body?.user_name ?? "").trim();

    if (!wallet_address || !wallet_address.startsWith("0x") || wallet_address.length < 10) {
      return NextResponse.json({ error: "Invalid wallet_address" }, { status: 400 });
    }
    if (!user_name || user_name.length < 3 || user_name.length > 20) {
      return NextResponse.json({ error: "Username must be 3-20 characters" }, { status: 400 });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(user_name)) {
      return NextResponse.json({ error: "Username can only contain letters, numbers, and underscore" }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://62.171.153.189:8080";
    const upstream = await fetch(`${backendUrl}/v1/account/genesis/username`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ wallet_address, user_name }),
      // Avoid caching at the edge
      cache: "no-store",
    });

    const text = await upstream.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!upstream.ok) {
      return NextResponse.json(
        { error: (data && (data.error || data.message)) || "Failed to update username" },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data ?? { success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
