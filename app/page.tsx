import Link from "next/link";

export default function Home() {
  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* NAVBAR */}
      <header style={styles.header}>
        <div style={styles.navInner}>
          <span style={styles.logo}>📘 KDP Listing Kit</span>
          <Link href="/generate" style={styles.navButton}>
            Try Free →
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.glow1} />
        <div style={styles.glow2} />
        <span style={styles.pill}>✨ Free AI Tool for Self-Publishers</span>
        <h1 style={styles.h1}>
          Your Book Deserves to<br />
          <span style={styles.gradientText}>Be Discovered.</span>
        </h1>
        <p style={styles.subtitle}>
      Paste your book title. Get KDP-ready backend keywords, a formatted Amazon
description and title ideas — in 5 seconds. Unlock everything for $6.99, once.
        </p>
        <Link href="/generate" style={styles.cta}>
          ⚡ Generate My Listing — Free →
        </Link>
        <div style={styles.microCopy}>3 free generations — no card, no signup</div>
      </section>

      {/* CHECKLIST */}
      <section style={styles.checklist}>
        <div style={styles.checkItem}>✅ 7 Backend Keywords (KDP-compliant)</div>
        <div style={styles.checkItem}>✅ Amazon-Ready HTML Description</div>
        <div style={styles.checkItem}>✅ Catchy Title Ideas</div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.steps}>
        <h2 style={styles.stepsTitle}>How It Works</h2>
        <div style={styles.stepsRow}>
          <div style={styles.stepCard}>
            <div style={styles.stepNum}>1</div>
            <h3 style={styles.stepTitle}>Enter Your Topic</h3>
            <p style={styles.stepText}>Type what your book is about — one line is enough.</p>
          </div>
          <div style={styles.stepCard}>
            <div style={styles.stepNum}>2</div>
            <h3 style={styles.stepTitle}>AI Does the Research</h3>
            <p style={styles.stepText}>Our AI analyzes your niche and crafts optimized listing content.</p>
          </div>
          <div style={styles.stepCard}>
            <div style={styles.stepNum}>3</div>
            <h3 style={styles.stepTitle}>Copy & Publish</h3>
            <p style={styles.stepText}>Paste into KDP and watch your book get discovered.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={styles.finalCta}>
        <h2 style={styles.finalTitle}>Ready to rank higher on Amazon?</h2>
        <Link href="/generate" style={styles.cta}>
          🚀 Start Generating — It's Free
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        Built for self-publishers · Powered by AI
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: "#e2e8f0",
    overflowX: "hidden",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "rgba(15,23,42,0.85)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  navInner: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { fontSize: 20, fontWeight: 800, color: "#fff" },
  navButton: {
    fontSize: 14,
    fontWeight: 700,
    color: "#fff",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    padding: "9px 20px",
    borderRadius: 10,
    textDecoration: "none",
    boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
  },
  hero: {
    position: "relative",
    maxWidth: 820,
    margin: "0 auto",
    padding: "90px 24px 40px",
    textAlign: "center",
    overflow: "hidden",
  },
  glow1: {
    position: "absolute",
    width: 550,
    height: 550,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(99,102,241,0.25), transparent 70%)",
    top: -180,
    left: -120,
    pointerEvents: "none",
  },
  glow2: {
    position: "absolute",
    width: 550,
    height: 550,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(56,189,248,0.18), transparent 70%)",
    top: 30,
    right: -180,
    pointerEvents: "none",
  },
  pill: {
    display: "inline-block",
    fontSize: 13,
    fontWeight: 600,
    color: "#a5b4fc",
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.35)",
    padding: "7px 18px",
    borderRadius: 999,
    marginBottom: 24,
  },
  h1: {
    fontSize: 50,
    fontWeight: 800,
    lineHeight: 1.12,
    marginBottom: 22,
    color: "#fff",
    letterSpacing: "-0.5px",
  },
  gradientText: {
    background: "linear-gradient(90deg, #818cf8, #38bdf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 1.7,
    color: "#94a3b8",
    maxWidth: 620,
    margin: "0 auto 36px",
  },
  cta: {
    display: "inline-block",
    padding: "17px 38px",
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: 14,
    textDecoration: "none",
    boxShadow: "0 10px 30px rgba(99,102,241,0.45)",
  },
  microCopy: {
    marginTop: 14,
    fontSize: 13,
    color: "#64748b",
  },
  checklist: {
    maxWidth: 640,
    margin: "0 auto",
    padding: "30px 24px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
  },
  checkItem: {
    fontSize: 16,
    fontWeight: 600,
    color: "#cbd5e1",
  },
  steps: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "60px 24px 40px",
  },
  stepsTitle: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: 800,
    color: "#fff",
    marginBottom: 36,
  },
  stepsRow: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  stepCard: {
    flex: 1,
    minWidth: 250,
    maxWidth: 290,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 28,
    textAlign: "center",
  },
  stepNum: {
    width: 44,
    height: 44,
    margin: "0 auto 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 800,
    color: "#fff",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "50%",
    boxShadow: "0 6px 18px rgba(99,102,241,0.4)",
  },
  stepTitle: { fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 8 },
  stepText: { fontSize: 14, lineHeight: 1.6, color: "#94a3b8", margin: 0 },
  finalCta: {
    maxWidth: 820,
    margin: "0 auto",
    padding: "50px 24px 80px",
    textAlign: "center",
  },
  finalTitle: { fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 24 },
  footer: {
    textAlign: "center",
    padding: 28,
    color: "#475569",
    fontSize: 14,
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
};

const css = `
  * { box-sizing: border-box; }
  a { transition: all 0.15s ease; }
  a:hover { filter: brightness(1.12); transform: translateY(-1px); }
  @media (max-width: 640px) {
    h1 { font-size: 32px !important; }
  }
`;
