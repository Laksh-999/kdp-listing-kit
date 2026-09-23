"use client";
import { useState } from "react";

export default function Generate() {
  const [title, setTitle] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      setResult(data.text || "Something went wrong. Try again.");
    } catch {
      setResult("Network error. Try again.");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white p-6">
      <div className="max-w-2xl mx-auto pt-12">
        <h1 className="text-4xl font-bold mb-6">Generate Your Listing ✨</h1>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Stress Relief Coloring Book for Adults"
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 mb-4 outline-none focus:border-amber-400"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !title}
          className="bg-amber-400 text-slate-900 font-bold px-8 py-3 rounded-full hover:bg-amber-300 transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate →"}
        </button>
        {result && (
          <pre className="mt-8 bg-black/40 p-6 rounded-xl whitespace-pre-wrap text-sm">
            {result}
          </pre>
        )}
      </div>
    </main>
  );
}
