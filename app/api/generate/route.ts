import { NextResponse } from "next/server";

// Simple in-memory rate limiter (per server instance — fine for starting out)
const rateMap = new Map<string, { count: number; reset: number }>();
const FREE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

// 🎲 Random creative angle — makes every regeneration different
const ANGLES = [
  "benefit-driven (lead with what the reader gains)",
  "storytelling (open with a relatable mini-scenario)",
  "problem-solution (name the frustration, then the fix)",
  "playful & witty (light humor, energetic tone)",
  "emotional & heartfelt (warm, personal, gift-oriented)",
  "authority & expert (confident, data-backed tone)",
  "question-hook (open with a question the reader says yes to)",
];
function randomAngle() {
  return ANGLES[Math.floor(Math.random() * ANGLES.length)];
}

function isRateLimited(ip: string, isPro: boolean) {
  if (isPro) return false;
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > FREE_LIMIT;
}

// 🔁 Retry with backoff — survives Gemini "high demand" spikes
async function callGemini(prompt: string, attempts = 3) {
  let lastError = "Gemini request failed";
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY || "",
          },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Gemini request failed");
      return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response";
    } catch (e: unknown) {
      lastError = (e as Error).message;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
      }
    }
  }
  throw new Error(lastError);
}

export async function POST(req: Request) {
  try {
    const { topic, tier } = await req.json();
    const isPro = tier === "pro";

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "anon";
    if (isRateLimited(ip, isPro)) {
      return NextResponse.json(
        { error: "Free limit reached (5/hour). Upgrade to Pro for unlimited generations." },
        { status: 429 }
      );
    }

    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: "Please enter a book topic first." }, { status: 400 });
    }

    const angle = randomAngle();

    const basePrompt = `You are a KDP (Kindle Direct Publishing) expert and Amazon SEO specialist. For a book about "${topic}", provide:

CREATIVE DIRECTION for this generation: ${angle}. Write with a completely fresh voice — vary sentence structure, vocabulary, and phrasing from any previous generation of this same topic. Never reuse generic filler like "Look no further" or "This book is perfect for".

1. SEVEN BACKEND KEYWORDS — each under 50 characters, comma separated, no words repeated from the topic, optimized for real Amazon search terms.
2. AMAZON HTML DESCRIPTION — valid KDP-compatible HTML only (<h2>, <h3>, <b>, <ul>, <li>, <i>, <br>). Structure it as:
   - An attention-grabbing <h2> hook headline
   - A 2-3 sentence intro that speaks to the reader's pain point or desire
   - A <ul> with 4-6 bullets, each starting with a <b>bolded benefit phrase</b> then explanation
   - A short "who this is perfect for / gift angle" paragraph
   - A clear call-to-action line
   Tone: ${angle.split(" (")[0]}.
3. THREE ALTERNATIVE TITLES — formatted as "Title: Subtitle" where the subtitle carries keywords. Avoid generic title patterns; make each distinct in style.
4. THREE BEST-MATCH AMAZON CATEGORIES — real KDP browse categories (books or the book's type, e.g. journals, planners, cookbooks), most specific first.

Format your answer exactly as:
KEYWORDS: comma-separated list
DESCRIPTION: the html
TITLES: one per line
CATEGORIES: comma-separated list`;

    const text = await callGemini(basePrompt);

    // Parse sections
    const kwMatch = text.match(/KEYWORDS:([\s\S]*?)(?=DESCRIPTION:)/i);
    const descMatch = text.match(/DESCRIPTION:([\s\S]*?)(?=TITLES:)/i);
    const titleMatch = text.match(/TITLES:([\s\S]*?)(?=CATEGORIES:)/i);
    const catMatch = text.match(/CATEGORIES:([\s\S]*)$/i);

    const keywords = kwMatch ? kwMatch[1].split(",").map((k) => k.trim()).filter(Boolean) : [];
    const description = descMatch ? descMatch[1].trim() : "";
    const titles = titleMatch ? titleMatch[1].split("\n").map((t) => t.trim()).filter(Boolean) : [];
    const categories = catMatch
      ? catMatch[1].split(",").map((c) => c.trim()).filter(Boolean).slice(0, 3)
      : [];

    const plainDescription = description
      .replace(/<h2[^>]*>/gi, "\n\n■ ")
      .replace(/<h3[^>]*>/gi, "\n\n● ")
      .replace(/<li[^>]*>/gi, "\n  ✓ ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(h2|h3|ul|p)>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const result: Record<string, unknown> = { keywords, description, plainDescription, titles, categories, tier: isPro ? "pro" : "free" };

    // ⭐ PRO-ONLY: extra assets
    if (isPro) {
      const proPrompt = `You are a KDP expert. For a book about "${topic}", provide:

1. A+ CONTENT OUTLINE — 3 modules for Amazon A+ content, each with a headline and 2-sentence body.
2. TEN AUTHOR CENTRAL SEARCH TERMS — phrases real buyers would type.
3. 3 SOCIAL HOOKS — short scroll-stopping lines for TikTok/Pinterest/Instagram promoting this book.
4. PRICING & LAUNCH TIPS — 3 specific, actionable tips for this niche.

Format as:
A+_CONTENT: ...
SEARCH_TERMS: comma separated
SOCIAL_HOOKS: one per line
LAUNCH_TIPS: numbered`;

            try {
        const proText = await callGemini(proPrompt);
        result.pro = proText;
      } catch (proErr) {
        // Surface the failure instead of hiding it
        result.pro = null;
        result.proError = (proErr as Error).message;
      }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Server error: " + (err as Error).message }, { status: 500 });
  }
}
