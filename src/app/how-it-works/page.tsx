import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <main className="max-w-[900px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 md:mb-4" style={{ letterSpacing: '-0.03em', lineHeight: '1.1', color: 'var(--text-1)' }}>
          How It Works
        </h1>
        <p className="text-base md:text-lg mb-10 md:mb-12" style={{ lineHeight: '1.7', color: 'var(--text-2)' }}>
          Get personalized career advice in three simple steps.
        </p>

        <section className="flex flex-col gap-12 md:gap-16">
          {/* Step 1 */}
          <article className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 text-xl font-semibold" style={{ background: 'rgba(13,148,136,0.1)', color: 'var(--accent)' }}>
                1
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-3" style={{ letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
                Paste Your Info
              </h2>
              <p className="text-sm md:text-base" style={{ lineHeight: '1.7', color: 'var(--text-2)' }}>
                Add your skills, experience, and the job description you're targeting. Our AI analyzes both to understand the perfect match.
              </p>
            </div>
            <div className="order-1 md:order-2 bg-white rounded-2xl border border-[var(--border)] shadow-sm p-5 md:p-6 aspect-video flex items-center justify-center relative overflow-hidden">
              <Image 
                src="/img/one.svg" 
                alt="Step 1: Paste your resume and job description into the AI Career Coach interface"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </article>

          {/* Step 2 */}
          <article className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
            <div className="order-1 bg-white rounded-2xl border border-[var(--border)] shadow-sm p-5 md:p-6 aspect-video flex items-center justify-center relative overflow-hidden">
              <Image 
                src="/img/two.svg" 
                alt="Step 2: AI generates tailored cover letter bullets, interview questions, and fit score"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="order-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 text-xl font-semibold" style={{ background: 'rgba(13,148,136,0.1)', color: 'var(--accent)' }}>
                2
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-3" style={{ letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
                Get Instant Results
              </h2>
              <p className="text-sm md:text-base" style={{ lineHeight: '1.7', color: 'var(--text-2)' }}>
                Receive tailored cover letter bullets, interview questions with answers, and a fit score — all in seconds.
              </p>
            </div>
          </article>

          {/* Step 3 */}
          <article className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 text-xl font-semibold" style={{ background: 'rgba(13,148,136,0.1)', color: 'var(--accent)' }}>
                3
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-3" style={{ letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
                Land the Job
              </h2>
              <p className="text-sm md:text-base" style={{ lineHeight: '1.7', color: 'var(--text-2)' }}>
                Use your personalized advice to craft compelling applications and ace your interviews with confidence.
              </p>
            </div>
            <div className="order-1 md:order-2 bg-white rounded-2xl border border-[var(--border)] shadow-sm p-8 md:p-10 aspect-video flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="60" r="25" fill="#0D9488" opacity="0.1"/>
                <circle cx="100" cy="60" r="20" fill="#0D9488" opacity="0.2"/>
                <circle cx="100" cy="60" r="15" fill="#0D9488"/>
                <path d="M85 55 L95 65 L115 45" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="60" y="100" width="80" height="60" rx="8" fill="#F8F7F4" stroke="#0D9488" strokeWidth="2"/>
                <line x1="70" y1="115" x2="130" y2="115" stroke="#0D9488" strokeWidth="2" strokeLinecap="round"/>
                <line x1="70" y1="130" x2="120" y2="130" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
                <line x1="70" y1="145" x2="125" y2="145" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"/>
                <path d="M100 165 L100 180 M90 175 L100 180 L110 175" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </article>
        </section>

        <section className="mt-16 md:mt-20 p-8 md:p-12 bg-white rounded-2xl border border-[var(--border)] shadow-sm text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 md:mb-4" style={{ letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
            Ready to get started?
          </h2>
          <p className="text-sm md:text-base mb-6 md:mb-8" style={{ lineHeight: '1.7', color: 'var(--text-2)' }}>
            Built for developers and job seekers
          </p>
          <Link
            href="/coach"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl font-medium text-sm w-full sm:w-auto justify-center transition-all duration-180 hover:-translate-y-[1px]"
            style={{ 
              background: 'var(--accent)', 
              color: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}
          >
            Start Coaching — it's free
          </Link>
        </section>
      </main>
    </div>
  );
}
