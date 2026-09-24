"use client";
import { useState } from "react";

export default function Generate() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data.result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <style>{css}</style>
      <header style={styles.header}>
        <span style={styles.logo}>📘 KDP Listing Kit</span>
      </header>

      <main style={styles.main}>
        <h1 style={styles.h1}>Generate Your Listing</h1>
        <p style={styles.subtitle}>
          Enter your book topic and get KDP-optimized keywords and an
          Amazon-ready description in seconds.
        </p>

        <div style={styles.card}>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. dog training for beginners"
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
            <button style={styles.button} onClick={handleGenerate} disabled={loading}>
              {loading ? "Generating…" : "Generate →"}
            </button>
          </div>
        </div>

        {error && <div style={styles.error}>⚠️ {error}</div>}

        {result && (
          <div style={styles.resultCard}>
            <h2 style={styles.resultTitle}>Your Results</h2>
            <pre style={styles.pre}>{result}</pre>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        Built with Next.js · Powered by Gemini
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: "#1e293b
  header: {
    padding: "18px 32: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  logo: { fontSize: 20, fontWeight: 700, color: "#1d4ed8" },
  main: { maxWidth: 760, margin: "0 auto", padding: "48px 20px 80px" },
  h1: { fontSize: 34, fontWeight: 800, marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#64748b", marginBottom: 28 },
  card: {
    background: "#fff",
    borderRadius: 14,
    padding: 20,
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
  inputRow: { display: "flex", gap: 12 },
  input: {
    flex: 1,
    padding: "13px 16px",
    fontSize: 16,
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    outline: "none",
  },
  button: {
    padding: "13px 24px",
    fontSize: 16,
    fontWeight: 600,
    color: "#fff",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
  },
  error: {
    marginTop: 20,
    padding: 14,
    background: "#fef2f2",
    color: "#b91c1c",
    borderRadius: 10,
    border: "1px solid #fecaca",: {
    marginTop: 28,
    background: "#fff",
    borderRadius: 14,
    padding: 24,
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
  },
  resultTitle: { fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#1d4ed8" },
  pre: {
    whiteSpace: "pre-wrap",
    fontFamily: "inherit",
    fontSize: 15,
    lineHeight: 1.7,
    margin: 0,
  },
  footer: {
    textAlign: "center",
    padding: 24,
    color: "#94a3b8",
    fontSize: 14,
    borderTop: "1px solid #e2e8f0",
    background: "#fff",
  },
};

const css = `
  input:focus { border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
  button:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  button:disabled { opacity: 0.6; cursor: wait; }
`;
