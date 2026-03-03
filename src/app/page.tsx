import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Navbar } from "@/components";
import NeuralCanvas from "@/components/NeuralCanvas";

export default function LandingPage() {
  return (
    <>
      <NeuralCanvas />
      
      <div className="min-h-screen relative z-[1]">
        <Navbar />

        <main className="max-w-[680px] mx-auto px-4 md:px-6 py-16 md:py-32 text-center">
          <div className="space-y-4 md:space-y-6">
            <div className="animate-fade-up opacity-0">
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  background: 'var(--accent-bg)', 
                  color: 'var(--accent)',
                  border: '1px solid rgba(13,148,136,0.15)'
                }}
              >
                <Sparkles className="w-3 h-3" />
                AI-Powered · Free to start
              </span>
            </div>

            <h1 
              className="animate-fade-up opacity-0 delay-80 text-3xl md:text-5xl lg:text-[52px] font-semibold leading-tight"
              style={{ 
                fontWeight: 600, 
                letterSpacing: '-0.03em',
                lineHeight: '1.1',
                color: 'var(--text-1)'
              }}
            >
              Land the job<br />you actually want.
            </h1>

            <p 
              className="animate-fade-up opacity-0 delay-160 max-w-[480px] mx-auto text-sm md:text-base leading-relaxed"
              style={{ 
                color: 'var(--text-2)'
              }}
            >
              Paste your resume + job description. Get cover letter bullets, interview prep, and a fit score — in seconds.
            </p>

            <div className="animate-fade-up opacity-0 delay-240 pt-2">
              <Link
                href="/coach"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl font-medium text-sm w-full sm:w-auto justify-center transition-all duration-180 hover:-translate-y-[1px]"
                style={{ 
                  background: 'var(--accent)', 
                  color: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                }}
              >
                <Sparkles className="w-[14px] h-[14px]" />
                Start Coaching — it's free
              </Link>
            </div>

            <p className="animate-fade-up opacity-0 delay-320 text-xs pt-3" style={{ color: 'var(--text-3)' }}>
              Built for developers and job seekers
            </p>

            <section className="animate-fade-up opacity-0 delay-320 pt-8">
              <h2 className="sr-only">Key Features</h2>
              <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                {['Cover Letter Bullets', 'Interview Q&A', 'Fit Score'].map((feature) => (
                  <span
                    key={feature}
                    className="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-2)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                    }}
                  >
                    <span style={{ color: 'var(--accent)' }}>·</span> {feature}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
