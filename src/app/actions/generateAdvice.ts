"use server";

import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

const SYSTEM_PROMPT =
  "You are a brutally honest top 1% tech hiring strategist and career coach for software engineers (React, Next.js, TypeScript, full-stack). Be concise, actionable, no fluff.";

const MODEL = "llama-3.3-70b-versatile";

/**
 * Server Action: minimal non-streaming Groq call for "Test connection" on /coach.
 * Main streaming is done via POST /api/advice (streamText there).
 */
export async function generateAdvice(
  input: string
): Promise<{ text: string; error?: undefined } | { error: string; text?: undefined }> {
  console.log("🔑 [generateAdvice] GROQ_KEY exists:", !!process.env.GROQ_API_KEY);
  console.log("📝 [generateAdvice] Input length:", input?.length ?? 0);

  if (!process.env.GROQ_API_KEY?.trim() || process.env.GROQ_API_KEY.trim() === "your_groq_api_key_here") {
    const msg = "GROQ_API_KEY is missing in environment variables. Set it in .env.local";
    console.error("❌ [generateAdvice]", msg);
    return { error: msg };
  }

  try {
    const result = await generateText({
      model: groq(MODEL),
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: (input?.trim() || "Test message from Macedonia") as string },
      ],
      temperature: 0.7,
      maxOutputTokens: 512,
    });

    console.log("✅ [generateAdvice] Groq call succeeded, text length:", result.text?.length ?? 0);
    return { text: result.text ?? "" };
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("❌ [generateAdvice] Groq Error:", err.message);
    console.error("❌ [generateAdvice] Stack:", err.stack);

    const message = err.message.toLowerCase();
    if (message.includes("model") || message.includes("decommissioned")) {
      return { error: "Model issue — using latest Groq model now. Try again." };
    }
    return { error: err.message || "Something went wrong with AI. Try again." };
  }
}
