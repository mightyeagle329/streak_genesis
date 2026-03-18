import { ImageResponse } from "next/og";

export const runtime = "edge";

function formatUSD(value: number): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$${Math.round(value).toLocaleString()}`;
  }
}

function formatXP(value: number): string {
  try {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${Math.round(value).toLocaleString()}`;
  }
}

function safeNumber(v: string | null, fallback: number): number {
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const name = searchParams.get("name")?.slice(0, 32) || "Streak Trader";
  const xp = safeNumber(searchParams.get("xp"), 0);
  const volume = safeNumber(searchParams.get("vol"), 0);

  const now = new Date();
  const date = searchParams.get("date") || now.toLocaleDateString("en-GB");
  const time =
    searchParams.get("time") ||
    now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  // In Edge runtime we can't reliably read from the filesystem.
  // Fetch from public/ via absolute URL based on the current request.
  const origin = new URL(req.url).origin;
  const logoData = await fetch(`${origin}/logo.png`).then((r) => r.arrayBuffer());

  // 1200x630 is the standard OG image size for Twitter summary_large_image.
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          // @vercel/og's CSS parser can be strict about gradients/background shorthands.
          // Use a solid base color and add glow layers with absolutely-positioned divs.
          backgroundColor: "#070A12",
          color: "white",
          position: "relative",
          fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        {/* Glow layers */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            display: "flex",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 820,
              height: 820,
              right: -240,
              top: -220,
              backgroundColor: "rgba(40,90,255,0.35)",
              filter: "blur(140px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 820,
              height: 820,
              left: -260,
              bottom: -260,
              backgroundColor: "rgba(255,140,0,0.30)",
              filter: "blur(140px)",
            }}
          />
        </div>

        {/* subtle overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            // Keep overlay simple to avoid CSS parsing issues.
            backgroundColor: "rgba(255,255,255,0.04)",
            opacity: 0.7,
          }}
        />

        {/* Left glass card */}
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 56,
            bottom: 56,
            width: 520,
            borderRadius: 36,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(10, 12, 22, 0.55)",
            backdropFilter: "blur(16px)",
            padding: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoData as any} alt="" width={44} height={44} style={{ borderRadius: 12 }} />
            <div
              style={{
                display: "flex",
                fontSize: 34,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                opacity: 0.95,
              }}
            >
              {name}
            </div>
          </div>

          {/* @vercel/og requires explicit display:flex on containers with multiple children */}
          <div style={{ marginTop: 12, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 22, opacity: 0.75, marginBottom: 8 }}>Points earned:</div>
            <div style={{ display: "flex", fontSize: 78, fontWeight: 800, letterSpacing: "-0.03em", color: "#FBAC35" }}>
              +{formatXP(xp)} XP
            </div>

            <div style={{ height: 26 }} />

            <div style={{ display: "flex", fontSize: 22, opacity: 0.75, marginBottom: 8 }}>Volume generated:</div>
            <div style={{ display: "flex", fontSize: 74, fontWeight: 800, letterSpacing: "-0.03em", color: "#FBAC35" }}>
              {formatUSD(volume)}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, opacity: 0.85 }}>
            <div style={{ display: "flex" }}>{time}</div>
            <div style={{ display: "flex" }}>{date}</div>
          </div>
        </div>

        {/* Right side: big logo */}
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 110,
            width: 470,
            height: 470,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.95,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoData as any}
            alt=""
            width={420}
            height={420}
            style={{
              filter: "drop-shadow(0px 20px 80px rgba(0,0,0,0.55))",
            }}
          />
        </div>

        {/* bottom-right brand */}
        <div
          style={{
            position: "absolute",
            right: 56,
            bottom: 48,
            fontSize: 22,
            opacity: 0.5,
            display: "flex",
          }}
        >
          streak.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
