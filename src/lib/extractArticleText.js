import fetch from "node-fetch";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

export async function extractArticleText(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();

    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    return article?.textContent || null;
  } catch (error) {
    console.error("Error extracting article text:", error);
    return null;
  }
}
