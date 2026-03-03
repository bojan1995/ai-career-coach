# AI Career Coach

**Get tailored job prep instantly.** Paste your skills or resume and a job description; get three cover letter bullets, five predicted interview questions with sample answers, and a 1–10 fit score — streamed in real time.

AI Career Coach 

Paste your resume + job description. Get cover letter bullets, interview prep, and a fit score — streamed in real time.

🔗 Live Demo: ai-career-coach-tfc6.vercel.app

What it does
Most job seekers send the same generic application to every job. AI Career Coach analyzes your specific background against a specific job description and returns:

✅ 3 tailored cover letter bullets — ready to copy-paste
✅ 5 predicted interview questions with sample answers
✅ Fit score (1–10) with honest reasoning and improvement tips

All streamed in real time — no waiting, no loading spinners.

Screenshots
<img width="1891" height="858" alt="Screenshot_9" src="https://github.com/user-attachments/assets/f23acb2c-7cdc-48e3-904c-d0c8bc887cf2" />
<img width="1844" height="799" alt="one" src="https://github.com/user-attachments/assets/de9b4a52-62a7-404b-a1a0-047035158a30" />
<img width="1620" height="839" alt="two" src="https://github.com/user-attachments/assets/0c3b639e-0fb7-4aef-a006-c88b20a33c6a" />
LandingCoach (streaming)

Tech Stack
LayerTechnologyFrameworkNext.js 15 (App Router)LanguageTypeScriptStylingTailwind CSS + custom shadcn/ui componentsLLMGroq — llama3-70b-8192StreamingNative ReadableStream via Groq SDKDeployVercel (zero config)
Key architectural decision: No database, no auth — fully stateless. This keeps latency low and infrastructure simple. The AI response streams directly from Groq to the client with no intermediate storage.

Running locally
bash# 1. Clone the repo
git clone https://github.com/bojan1995/ai-career-coach.git
cd ai-career-coach

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Add your Groq API key → https://console.groq.com
.env.local
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama3-70b-8192   # optional, this is the default
bash# 4. Start dev server
npm run dev
Open http://localhost:3000

Deploying to Vercel
bash# Push to GitHub, then:
# 1. Import repo at vercel.com
# 2. Add environment variable: GROQ_API_KEY
# 3. Deploy — no other config needed

Project structure
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── coach/
│   │   └── page.tsx      # Main coach interface
│   ├── how-it-works/
│   │   └── page.tsx      # How it works page
│   └── api/
│       └── coach/
│           └── route.ts  # Groq streaming API route
├── components/           # UI components
└── lib/                  # Utilities

How the streaming works
typescript// Server sends a ReadableStream directly from Groq
const stream = await groq.chat.completions.create({
  model: process.env.GROQ_MODEL ?? "llama3-70b-8192",
  stream: true,
  messages: [{ role: "user", content: prompt }],
});

// Client reads chunks as they arrive — no buffering
for await (const chunk of stream) {
  controller.enqueue(chunk.choices[0]?.delta?.content ?? "");
}

Roadmap (v2)

 Auth + user accounts (Supabase)
 Save and track job applications
 GitHub OAuth login
 PDF resume upload
 Team plan with shared application tracker
