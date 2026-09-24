import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `You are a KDP (Kindle Direct Publishing) expert. For a book titled "${title}", provide:
1. Seven backend keywords (comma separated)
2. An Amazon-ready HTML book description
3. Three alternative title ideas`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return NextResponse.json({ text, result: text });
  } catch (err) {
    return NextResponse.json(
      { text: "Error: " + (err as Error).message },
      { status: 500 }
    );
  }
}
