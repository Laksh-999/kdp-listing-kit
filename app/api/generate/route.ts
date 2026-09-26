import { NextResponse } from "next/server";

// Simple in-memory rate limiter (per server instance — fine for starting out)
const rateMap = new Map<string, { count: number; reset: number }>();
const FREE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

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
        // wait 2s, then 4s before retrying
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

    const basePrompt = `You are a KDP (Kindle Direct Publishing) expert and Amazon SEO specialist. For a book about "${topic}", provide:

1. SEVEN BACKEND KEYWORDS — each under 50 characters, comma separated, no words repeated from the topic, optimized for real Amazon search terms.
2. AMAZON HTML DESCRIPTION — valid KDP-compatible HTML only (<h2>, <h3>, <b>, <ul>, <li>, <i>, <br>). Include a hook headline, pain-point intro, bulleted feature list, gift angle, and a call to action.
3. THREE ALTERNATIVE TITLES — formatted as "Title: Subtitle" where the subtitle carries keywords.
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
  .replace(/<br\s*\/?>/gi, "\n")
  .replace(/<\/(h2|h3|li|ul|p)>/gi, "\n")
  .replace(/<[^>]+>/g, "");

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
      } catch {
        result.pro = null;
      }
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Server error: " + (err as Error).message }, { status: 500 });
  }
}
