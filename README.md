# AI Career Coach 🚀

> Paste your resume + job description. Get cover letter bullets, interview prep, and a fit score — streamed in real time.

🔗 **Live Demo:** [ai-career-coach-tfc6.vercel.app](https://ai-career-coach-tfc6.vercel.app)

---

## What it does

Most job seekers send the same generic application to every job. AI Career Coach analyzes **your specific background against a specific job description** and returns:

- ✅ **3 tailored cover letter bullets** — ready to copy-paste
- ✅ **5 predicted interview questions** with sample answers
- ✅ **Fit score (1–10)** with honest reasoning and improvement tips

All streamed in real time — no waiting, no loading spinners.

---

## Screenshots

| Landing | Coach (streaming) |
<img width="1920" height="1072" alt="2" src="https://github.com/user-attachments/assets/00c603c1-009e-490b-863e-9024fad5996c" />
<img width="1920" height="1155" alt="3" src="https://github.com/user-attachments/assets/364dc05d-5f0e-4a1d-bfb7-a3e7f437e4b0" />


---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom shadcn/ui components |
| LLM | Groq — `llama3-70b-8192` |
| Streaming | Native `ReadableStream` via Groq SDK |
| Deploy | Vercel (zero config) |

**Key architectural decision:** No database, no auth — fully stateless. This keeps latency low and infrastructure simple. The AI response streams directly from Groq to the client with no intermediate storage.

---

## Running locally

```bash
# 1. Clone the repo
git clone https://github.com/bojan1995/ai-career-coach.git
cd ai-career-coach

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Add your Groq API key → https://console.groq.com
```

**.env.local**
```
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama3-70b-8192   # optional, this is the default
```

```bash
# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

```bash
# Push to GitHub, then:
# 1. Import repo at vercel.com
# 2. Add environment variable: GROQ_API_KEY
# 3. Deploy — no other config needed
```

---

## Project structure

```
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
```

---



---

## Roadmap (v2)

- [ ] Auth + user accounts (Supabase)
- [ ] Save and track job applications
- [ ] GitHub OAuth login
- [ ] PDF resume upload
- [ ] Team plan with shared application tracker

---

## Author

Built by [Bojan](https://github.com/bojan1995) — open to frontend / AI engineering roles.

📧 Reach out via GitHub or LinkedIn.
