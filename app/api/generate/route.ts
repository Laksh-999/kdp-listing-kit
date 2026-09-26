import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { error: "Please enter a book topic first." },
        { status: 400 }
      );
    }

    const prompt = `You are a KDP (Kindle Direct Publishing) expert. For a book about "${topic}", provide:
1. Seven backend keywords (under 50 characters each, comma separated, no repetition of the title)
2. An Amazon-ready HTML book description
3. Three alternative title ideas`;

    const res = await fetch(
      "https://generativelanguage.googleapis/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY || "",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const msg = data?.error?.message || JSON.stringify(data);
      return NextResponse.json(
        { error: "Gemini API error: " + msg },
        { status: 500 }
      );
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response";
    return NextResponse.json({ result: text });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error: " + (err as Error).message },
      { status: 500 }
    );
  }
}
