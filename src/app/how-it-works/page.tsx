"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <nav className="sticky top-0 z-50 h-[60px] backdrop-blur-md" style={{ 
        background: 'rgba(248,247,244,0.85)', 
        borderBottom: '1px solid var(--border)' 
      }}>
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <span className="font-semibold text-[15px]" style={{ color: 'var(--text-1)' }}>CareerCoach</span>
          <Link 
            href="/coach"
            className="h-9 px-4 rounded-xl text-sm font-medium flex items-center transition-all duration-180 hover:-translate-y-[1px]"
            style={{ 
              background: 'var(--accent)', 
              color: 'white',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-hover)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(13,148,136,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-[900px] mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: 'var(--text-3)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-1)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-3)'}>
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 style={{ fontSize: '48px', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: '1.1', color: 'var(--text-1)', marginBottom: '16px' }}>
          How It Works
        </h1>
        <p style={{ fontSize: '18px', lineHeight: '1.7', color: 'var(--text-2)', marginBottom: '48px' }}>
          Get personalized career advice in three simple steps.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                background: 'rgba(13,148,136,0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '24px',
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--accent)'
              }}>
                1
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-1)', marginBottom: '12px' }}>
                Paste Your Info
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-2)' }}>
                Add your skills, experience, and the job description you're targeting. Our AI analyzes both to understand the perfect match.
              </p>
            </div>
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              padding: '24px',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src="/img/one.svg" 
                alt="Step 1: Paste your information"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              padding: '24px',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src="/img/two.svg" 
                alt="Step 2: Get instant results"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
            <div>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                background: 'rgba(13,148,136,0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '24px',
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--accent)'
              }}>
                2
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-1)', marginBottom: '12px' }}>
                Get Instant Results
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-2)' }}>
                Receive tailored cover letter bullets, interview questions with answers, and a fit score — all in seconds.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            <div>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                background: 'rgba(13,148,136,0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '24px',
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--accent)'
              }}>
                3
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-1)', marginBottom: '12px' }}>
                Land the Job
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-2)' }}>
                Use your personalized advice to craft compelling applications and ace your interviews with confidence.
              </p>
            </div>
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              padding: '48px',
              aspectRatio: '16/10',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px'
            }}>
              🎉
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '80px', 
          padding: '48px', 
          background: 'var(--surface)', 
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-1)', marginBottom: '16px' }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-2)', marginBottom: '32px' }}>
            Join thousands of job seekers who've landed their dream roles.
          </p>
          <Link
            href="/coach"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl font-medium text-sm transition-all duration-180 hover:-translate-y-[1px]"
            style={{ 
              background: 'var(--accent)', 
              color: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent-hover)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(13,148,136,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
            }}
          >
            Start Coaching — it's free
          </Link>
        </div>
      </main>
    </div>
  );
}
