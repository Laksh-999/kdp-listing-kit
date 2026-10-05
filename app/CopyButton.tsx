"use client";

import { useState } from "react";

export default function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: "4px 12px",
        fontSize: "13px",
        borderRadius: "6px",
        border: "1px solid #cbd5e1",
        background: copied ? "#dcfce7" : "#fff",
        color: copied ? "#166534" : "#334155",
        cursor: "pointer",
      }}
    >
      {copied ? "✅ Copied!" : `📋 ${label}`}
    </button>
  );
}
