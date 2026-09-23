"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white flex items-center justify-center p-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-4">KDP Listing Kit 📚</h1>
        <p className="text-slate-300 mb-8">
          Paste your book title. Get KDP-ready keywords, a formatted description
          and title ideas — in 5 seconds.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-10 text-sm">
          <div className="bg-white/10 rounded-xl p-4">✅ 7 Backend Keywords</div>
          <div className="bg-white/10 rounded-xl p-4">✅ HTML Description</div>
          <div className="bg-white/10 rounded-xl p-4">✅ Title Ideas</div>
        </div>
        <Link
          href="/generate"
          className="bg-amber-400 text-slate-900 font-bold text-lg px-10 py-4 rounded-full hover:bg-amber-300 transition inline-block"
        >
          Generate My Listing — Free →
        </Link>
        <p className="mt-6 text-slate-400">3 free generations daily. No signup needed.</p>
      </div>
    </main>
  );
}
