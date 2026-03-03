import { NextRequest } from "next/server";
import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";

const SYSTEM_PROMPT = `You are a brutally honest top 1% tech hiring strategist and career coach for software engineers (React, Next.js, TypeScript, full-stack). Be concise, actionable, no fluff.

IMPORTANT: Respond in the SAME LANGUAGE as the user's input. If they write in Spanish, respond in Spanish. If they write in Macedonian, respond in Macedonian. Match their language exactly.

When given a candidate's skills/resume and a job description, respond with ONLY the following structure. Use clear section headers and no extra preamble.

## Cover letter bullets
- [Bullet 1]
- [Bullet 2]
- [Bullet 3]

## Predicted interview questions & sample answers
1. **Question:** [Question]
   **Sample answer:** [Concise answer]
2. **Question:** [Question]
   **Sample answer:** [Concise answer]
3. **Question:** [Question]
   **Sample answer:** [Concise answer]
4. **Question:** [Question]
   **Sample answer:** [Concise answer]
5. **Question:** [Question]
   **Sample answer:** [Concise answer]

## Fit score (1–10) & reasoning
**Score:** [X/10]
**Reasoning:** [2–4 sentences: strengths, gaps, and one concrete suggestion.]`;

const MODEL = "llama-3.3-70b-versatile";

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  console.log("🔑 [api/advice] GROQ_KEY exists:", !!process.env.GROQ_API_KEY);
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey || apiKey === "your_groq_api_key_here") {
    console.error("❌ [api/advice] Missing or placeholder API key");
    return jsonError(
      "GROQ_API_KEY is missing or still set to the placeholder. Add your key in .env.local (get one at https://console.groq.com).",
      500
    );
  }

  let body: { resumeAndJob?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const resumeAndJob = body.resumeAndJob?.trim();
  if (!resumeAndJob) {
    return jsonError("resumeAndJob is required", 400);
  }

  console.log("📝 [api/advice] Input length:", resumeAndJob.length);
  console.log("🤖 [api/advice] Model:", MODEL);

  try {
    const result = await streamText({
      model: groq(MODEL),
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Candidate info and job description:\n\n${resumeAndJob}`,
        },
      ],
      temperature: 0.7,
      maxOutputTokens: 4096,
    });

    console.log("✅ [api/advice] Stream started successfully");
    return result.toTextStreamResponse({
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("❌ [api/advice] Groq Error:", err.message);
    console.error("❌ [api/advice] Stack:", err.stack);

    const message = err.message.toLowerCase();
    if (message.includes("model") || message.includes("decommissioned")) {
      return jsonError(
        "Model issue — we use the latest Groq model now. Try again.",
        400
      );
    }
    if (message.includes("401") || message.includes("403") || message.includes("invalid") || message.includes("authentication")) {
      return jsonError(
        "Invalid Groq API key. Check GROQ_API_KEY in .env.local (get a key at https://console.groq.com).",
        500
      );
    }
    return jsonError(
      err.message || "Something went wrong with AI. Try again.",
      500
    );
  }
}
