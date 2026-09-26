"use client";
import { useState } from "react";

type Results = {
  keywords?: string[];
  description?: string;
  titles?: string[];
  pro?: string | null;
};

export default function Home() {
  const [topic, setTopic] = useState("");
  const [tier, setTier] = useState<"free" | "pro">("free");
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true); setError(""); setResults(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResults(data);
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 1500);
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <span style={s.logo}>📚 KDP Listing Kit</span>
        <div style={s.tierToggle}>
          <button onClick={() => setTier("free")} style={{ ...s.tierBtn, ...(tier === "free" ? s.tierActive : {}) }}>Free</button>
          <button onClick={() => setTier("pro")} style={{ ...s.tierBtn, ...(tier === "pro" ? s.tierActive : {}) }}>✨ Pro</button>
        </div>
      </header>

      <section style={s.hero}>
        <h1 style={s.h1}>Rank Higher on Amazon.<br /><span style={s.gradient}>In Seconds, Not Hours.</span></h1>
        <p style={s.sub}>Keywords, HTML descriptions, titles — and with Pro, A+ content, social hooks & launch strategy.</p>

        <div style={s.card}>
          <label style={s.label}>📚 What&apos;s your book about?</label>
          <div style={s.row}>
            <input
              style={s.input}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="e.g. gratitude journal for busy moms"
            />
            <button style={s.button} onClick={generate} disabled={loading}>
              {loading ? "⏳ Generating…" : tier === "pro" ? "✨ Generate Pro" : "⚡ Generate"}
            </button>
          </div>
          <p style={s.micro}>{tier === "free" ? "Free: 5 generations/hour" : "Pro: unlimited + bonus assets"}</p>
        </div>

        {error && <div style={s.error}>⚠️ {error}</div>}
      </section>

      <section id="results" style={s.results}>
        {loading && <div style={s.cardGhost}><div style={s.spinner} /><p style={s.loadingText}>Crafting your listing…</p></div>}

        {results && !loading && (
          <>
            <ResultBlock title="🔑 7 Backend Keywords" copyId="kw"
              copyText={(results.keywords || []).join(", ")}
              onCopy={copy} copied={copied}>
              <div style={s.chips}>
                {(results.keywords || []).map((k, i) => <span key={i} style={s.chip}>{k}</span>)}
              </div>
            </ResultBlock>

            <ResultBlock title="📝 Amazon HTML Description" copyId="desc"
              copyText={results.description || ""} onCopy={copy} copied={copied}>
              <div style={s.preview} dangerouslySetInnerHTML={{ __html: results.description || "" }} />
              <details style={s.details}><summary>View raw HTML</summary><pre style={s.pre}>{results.description}</pre></details>
            </ResultBlock>

            <ResultBlock title="💡 Title Ideas" copyId="titles"
              copyText={(results.titles || []).join("\n")} onCopy={copy} copied={copied}>
              <ol style={s.list}>{(results.titles || []).map((t, i) => <li key={i} style={s.listItem}>{t}</li>)}</ol>
            </ResultBlock>

            {results.pro ? (
              <ResultBlock title="✨ Pro Bonus Pack" copyId="pro" copyText={results.pro} onCopy={copy} copied={copied}>
                <pre style={s.pre}>{results.pro}</pre>
              </ResultBlock>
            ) : (
              <div style={s.upgradeBox}>
                <h3>🔒 Unlock the Pro Bonus Pack</h3>
                <ul style={s.list}>
                  <li>📊 A+ Content outlines (3 modules)</li>
                  <li>🔍 10 Author Central search terms</li>
                  <li>📱 3 social media hooks</li>
                  <li>🚀 Pricing & launch strategy</li>
                  <li>♾️ Unlimited generations</li>
                </ul>
                <button style={s.button}>Upgrade to Pro — $9/mo</button>
              </div>
            )}
          </>
        )}
      </section>

      <footer style={s.footer}>Built for self-publishers · Powered by AI</footer>
    </div>
  );
}

function ResultBlock({ title, children, copyText, copyId, onCopy, copied }:
  { title: string; children: React.ReactNode; copyText: string; copyId: string; onCopy: (t: string, id: string) => void; copied: string }) {
  return (
    <div style={s.resultCard}>
      <div style={s.resultHeader}>
        <h2 style={s.resultTitle}>{title}</h2>
        <button style={s.copyBtn} onClick={() => onCopy(copyText, copyId)}>
          {copied === copyId ? "✅ Copied!" : "📋 Copy"}
        </button>
      </div>
      {children}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0f172a", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#e2e8f0" },
  header: { position: "sticky", top: 0, zIndex: 10, background: "rgba(15,23,42,0.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px" },
  logo: { fontSize: 20, fontWeight: 800, color: "#fff" },
  tierToggle: { display: "flex", gap: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999, padding: 4 },
  tierBtn: { padding: "7px 18px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: "transparent", color: "#94a3b8" },
  tierActive: { background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff" },
  hero: { maxWidth: 820, margin: "0 auto", padding: "70px 24px 40px", textAlign: "center" },
  h1: { fontSize: 44, fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 16 },
  gradient: { background: "linear-gradient(90deg,#818cf8,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  sub: { color: "#94a3b8", fontSize: 17, maxWidth: 600, margin: "0 auto 32px" },
  card: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, maxWidth: 680, margin: "0 auto", textAlign: "left" },
  label: { display: "block", fontWeight: 700, marginBottom: 10, color: "#e2e8f0" },
  row: { display: "flex", gap: 10, flexWrap: "wrap" },
  input: { flex: 1, minWidth: 220, padding: "14px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.3)", color: "#fff", fontSize: 15, outline: "none" },
  button: { padding: "14px 26px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15, color: "#fff", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", whiteSpace: "nowrap" },
  micro: { margin: "12px 0 0", fontSize: 12.5, color: "#64748b" },
  error: { marginTop: 20, padding: "12px 18px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 10, color: "#fca5a5", maxWidth: 680, margin: "20px auto 0" },
  results: { maxWidth: 820, margin: "0 auto", padding: "20px 24px 80px" },
  cardGhost: { background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 16, padding: 60, textAlign: "center" },
  spinner: { width: 40, height: 40, margin: "0 auto 16px", border: "4px solid rgba(255,255,255,0.15)", borderTopColor: "#818cf8", borderRadius: "50%", animation: "spin 0.9s linear infinite" },
  loadingText: { color: "#94a3b8" },
  resultCard: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, marginBottom: 20 },
  resultHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 10, flexWrap: "wrap" },
  resultTitle: { fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 },
  copyBtn: { padding: "7px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)", color: "#e2e8f0", cursor: "pointer", fontSize: 13, fontWeight: 600 },
  chips: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { padding: "7px 14px", borderRadius: 999, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.4)", color: "#c7d2fe", fontSize: 13 },
  preview: { background: "#fff", color: "#1e293b", borderRadius: 10, padding: 24, lineHeight: 1.6 },
  details: { marginTop: 12, fontSize: 13 },
  pre: { background: "rgba(0,0,0,0.35)", padding: 16, borderRadius: 10, overflowX: "auto", fontSize: 12.5, whiteSpace: "pre-wrap", color: "#cbd5e1" },
  list: { margin: 0, paddingLeft: 20, lineHeight: 1.9, color: "#e2e8f0" },
  listItem: { marginBottom: 4 },
  upgradeBox: { background: "linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.12))", border: "1px solid rgba(139,92,246,0.4)", borderRadius: 16, padding: 28, textAlign: "center" },
  footer: { textAlign: "center", padding: 30, color: "#475569", fontSize: 13 },
});


