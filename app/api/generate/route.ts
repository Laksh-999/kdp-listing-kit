import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    const prompt = `You are a KDP (Kindle Direct Publishing) expert. For a book titled "${title}", provide:
1. Seven backend keywords (comma separated)
2. An Amazon-ready HTML book description
3. Three alternative title ideas`;

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
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
      return NextResponse.json(
        { text: "Error: " + JSON.stringify(data) },
        { status: 500 }
      );
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response";
    return NextResponse.json({ text, result: text });
  } catch (err) {
    return NextResponse.json(
      { text: "Error: " + (err as Error).message },
      { status: 500 }
    );
  }
}
