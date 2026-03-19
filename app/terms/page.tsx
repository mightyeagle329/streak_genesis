export const metadata = {
  title: "Terms of Service | Streak Genesis",
};

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "28px 20px 48px", color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
        <a
          href="/"
          style={{
            padding: "0 12px",
            height: 32,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.75)",
            textDecoration: "none",
            fontFamily: "var(--font-ibm-condensed), 'IBM Plex Sans Condensed', sans-serif",
            fontSize: 14,
          }}
        >
          ← Back
        </a>
      </div>

      <h1 style={{ fontSize: 32, marginBottom: 12, lineHeight: "110%" }}>Terms of Service</h1>
      <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
        Placeholder Terms of Service for Streak Genesis. Replace this content with your final legal terms.
      </p>
    </main>
  );
}
