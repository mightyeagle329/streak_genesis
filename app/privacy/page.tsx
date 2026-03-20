import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Streak Genesis",
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "28px 20px 48px", color: "#fff" }}>
      {/* Header logo -> Home */}
      <Link
        href="/"
        aria-label="Go to home"
        style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none", marginBottom: 18 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" aria-hidden="true" style={{ width: 28, height: 26, flexShrink: 0 }} />
        <span
          style={{
            fontFamily: "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif",
            fontWeight: 400,
            fontSize: 23,
            lineHeight: "26px",
            color: "#FFFFFF",
            whiteSpace: "nowrap",
          }}
        >
          STREAK
        </span>
      </Link>

      <h1 style={{ fontSize: 32, marginBottom: 12, lineHeight: "110%" }}>Privacy Policy</h1>
      <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
        Placeholder Privacy Policy for Streak Genesis. Replace this content with your final privacy policy.
      </p>
    </main>
  );
}
