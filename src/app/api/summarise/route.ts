import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import openai from "@/lib/openaiClient";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";

// 👉 Function to extract main article text from URL
async function extractArticleText(url: string): Promise<string> {
  const res = await fetch(url);
  const html = await res.text();
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  return article?.textContent || "";
}

// 👉 Function to get English summary using OpenAI
async function getEnglishSummary(articleText: string): Promise<string> {
  const prompt = `Summarize the following article in English:\n\n${articleText}`;

  const response = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
  });

  return response.choices?.[0]?.message?.content?.trim() || "";
}

// 👉 Function to get Urdu summary using OpenAI
async function getUrduSummary(articleText: string): Promise<string> {
  const prompt = `مندرجہ ذیل آرٹیکل کا اردو میں خلاصہ لکھیں:\n\n${articleText}`;

  const response = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
  });

  return response.choices?.[0]?.message?.content?.trim() || "";
}

// 👉 Main API Route
export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    console.log("✅ URL received:", url);

    const articleText = await extractArticleText(url);
    if (!articleText) {
      return NextResponse.json({ error: "Could not extract article text." }, { status: 400 });
    }

    const summary = await getEnglishSummary(articleText);
    const urduSummary = await getUrduSummary(articleText);

    const { data, error } = await supabase
      .from("Summary Info")
      .insert([
        {
          URLL: url,
          Summary: summary,
          Urdu_Summary: urduSummary,
        },
      ]);

    console.log("🟢 Supabase insert data:", data);
    console.error("❌ Supabase insert error:", error);

    if (error) {
      return NextResponse.json(
        { error: "Failed to save summary", details: error.message || error },
        { status: 500 }
      );
    }

    return NextResponse.json({ summary, urduSummary });
  } catch (err: any) {
    console.error("🔥 API error:", err.message || err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
