import type { Metadata } from "next";
import Link from "next/link";

function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { wallet: string };
  searchParams: Record<string, string | string[] | undefined>;
}): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const wallet = params.wallet;
  const name = typeof searchParams.name === "string" ? searchParams.name : undefined;
  const xp = typeof searchParams.xp === "string" ? searchParams.xp : undefined;
  const vol = typeof searchParams.vol === "string" ? searchParams.vol : undefined;
  const date = typeof searchParams.date === "string" ? searchParams.date : undefined;
  const time = typeof searchParams.time === "string" ? searchParams.time : undefined;

  const ogUrl = new URL(`${siteUrl}/api/og`);
  ogUrl.searchParams.set("name", name ?? `${wallet.slice(0, 6)}…${wallet.slice(-4)}`);
  if (xp) ogUrl.searchParams.set("xp", xp);
  if (vol) ogUrl.searchParams.set("vol", vol);
  if (date) ogUrl.searchParams.set("date", date);
  if (time) ogUrl.searchParams.set("time", time);

  const title = "Streak Genesis";
  const description = "I just claimed my Genesis profile on Streak.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogUrl.toString(), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl.toString()],
    },
  };
}

export default function SharePage({
  params,
}: {
  params: { wallet: string };
}) {
  return (
    <main style={{ minHeight: "100vh", background: "#0A0B10", color: "white", padding: 32 }}>
      <h1 style={{ fontFamily: "Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 28 }}>
        Streak Genesis Share
      </h1>
      <p style={{ opacity: 0.75, marginTop: 12 }}>
        Wallet: <span style={{ fontFamily: "monospace" }}>{params.wallet}</span>
      </p>
      <p style={{ opacity: 0.75, marginTop: 12 }}>
        This page exists for Twitter/X link previews.
      </p>
      <Link href="/" style={{ display: "inline-block", marginTop: 18, color: "#FBAC35" }}>
        Go to Streak Genesis
      </Link>
    </main>
  );
}
