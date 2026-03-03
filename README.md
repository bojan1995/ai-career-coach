# AI Career Coach

**Get tailored job prep instantly.** Paste your skills or resume and a job description; get three cover letter bullets, five predicted interview questions with sample answers, and a 1–10 fit score — streamed in real time.

![AI Career Coach — Get Tailored Job Prep Instantly](https://via.placeholder.com/1200x630/0f172a/38bdf8?text=AI+Career+Coach)

## Tech stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui-style components (dark mode)
- **LLM:** [Groq](https://console.groq.com) — `llama3-70b-8192` or `mixtral-8x7b-32768`
- **Streaming:** Native `ReadableStream` from Groq SDK (no DB, no persistent storage)
- **Deploy:** Vercel (zero config)

## Quick start

```bash
# Clone or open the repo
cd "ai coach"

# Install
npm install

# Set your Groq API key (get one at https://console.groq.com)
cp .env.example .env.local
# Edit .env.local and set GROQ_API_KEY=...

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the landing CTA or go to `/coach` to paste resume + job description and generate advice.

## Deploy to Vercel

1. Push the repo to GitHub (or connect your Git provider in Vercel).
2. In [Vercel](https://vercel.com), **Import** the project.
3. Add environment variable: `GROQ_API_KEY` = your Groq API key.
4. Optional: `GROQ_MODEL` = `llama3-70b-8192` or `mixtral-8x7b-32768`.
5. Deploy. No extra config needed.

## Screenshots

| Landing | Coach (streaming) |
|--------|--------------------|
| Hero + CTA and feature cards | Big textarea + “Generate Advice” → streamed bullets, Q&A, fit score |

*(Add your own screenshots from the live app here.)*

## Pages

- **`/`** — Landing: hero “AI Career Coach — Get Tailored Job Prep Instantly”, form CTA to `/coach`.
- **`/coach`** — Main flow: textarea for “Paste your skills/resume + job description”, **Generate Advice** button. On submit, the app calls Groq and streams back:
  - 3 tailored cover letter bullets  
  - 5 predicted interview questions + sample answers  
  - 1–10 fit score with reasoning  

System prompt: *“You are a top 1% tech hiring strategist and career coach. Be brutally honest, concise, actionable. Focus on software engineering roles.”*

## Built with

**bolt.new** + **Cursor** + **Groq**

---

No database, no auth in v1 — stateless and ready to impress recruiters with strong AI integration and a clean UI.
