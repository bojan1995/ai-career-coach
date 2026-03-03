"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, Loader2, X, Copy, Check } from "lucide-react";

interface ParsedAdvice {
  coverLetterBullets: string[];
  interviewQA: Array<{ question: string; answer: string }>;
  fitScore: number;
  fitReasoning: string;
}

function parseAdvice(text: string): ParsedAdvice {
  const sections = text.split('##').filter(Boolean);
  const result: ParsedAdvice = {
    coverLetterBullets: [],
    interviewQA: [],
    fitScore: 0,
    fitReasoning: ''
  };

  sections.forEach(section => {
    const lines = section.trim().split('\n');
    const title = lines[0].toLowerCase();

    if (title.includes('cover letter')) {
      result.coverLetterBullets = lines
        .slice(1)
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim());
    } else if (title.includes('interview')) {
      const qaPairs = section.split(/\d+\.\s+/).filter(Boolean).slice(1);
      result.interviewQA = qaPairs.map(pair => {
        const [q, a] = pair.split('**Sample answer:**');
        return {
          question: q.replace('**Question:**', '').trim(),
          answer: a?.trim() || ''
        };
      });
    } else if (title.includes('fit score')) {
      const scoreMatch = section.match(/\*\*Score:\*\*\s*(\d+)\/10/);
      const reasoningMatch = section.match(/\*\*Reasoning:\*\*\s*(.+)/s);
      result.fitScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;
      result.fitReasoning = reasoningMatch ? reasoningMatch[1].trim() : '';
    }
  });

  return result;
}

function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    observer.observe(canvas);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const nodes = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: 1.5 + Math.random() * 1.5,
      opacity: 0.15 + Math.random() * 0.2
    }));

    let animationId: number;

    const animate = () => {
      if (isVisibleRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        nodes.forEach(node => {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
          if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(13,148,136,${node.opacity})`;
          ctx.fill();
        });

        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 140) {
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = `rgba(13,148,136,${(1 - dist / 140) * 0.12})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resize);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

export default function CoachPage() {
  const [profile, setProfile] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const combined = `${profile.trim()}\n\n---\n\n${jobDesc.trim()}`;

      if (!profile.trim() || !jobDesc.trim()) {
        setError("Please fill both fields");
        return;
      }

      setError(null);
      setResult("");
      setIsLoading(true);
      setShowModal(true);

      try {
        const res = await fetch("/api/advice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeAndJob: combined }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: `Failed: ${res.status}` }));
          setError(data.error);
          return;
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          setError("No response");
          return;
        }

        let text = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setResult(text);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setIsLoading(false);
      }
    },
    [profile, jobDesc]
  );

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const parsed = result ? parseAdvice(result) : null;
  const displayedQA = parsed ? parsed.interviewQA.slice(0, questionCount > 5 ? 5 : questionCount) : [];
  const hasMoreQuestions = parsed && parsed.interviewQA.length > 5 && questionCount > 5;

  return (
    <>
      <NeuralCanvas />
      
      <style jsx global>{`
        :root {
          --bg: #F8F7F4;
          --surface: #FFFFFF;
          --surface-2: #F1F0ED;
          --surface-hover: #EBEBE7;
          --border: rgba(15, 23, 42, 0.07);
          --border-focus: #0D9488;
          --text-1: #0F172A;
          --text-2: #475569;
          --text-3: #94A3B8;
          --accent: #0D9488;
          --accent-hover: #0F766E;
          --accent-subtle: rgba(13,148,136,0.08);
          --accent-glow: rgba(13,148,136,0.20);
          --shadow-sm: 0 1px 2px rgba(0,0,0,0.04), 0 1px 6px rgba(0,0,0,0.03);
          --shadow-md: 0 4px 6px rgba(0,0,0,0.04), 0 10px 32px rgba(0,0,0,0.06);
          --shadow-glow: 0 0 0 3px var(--accent-subtle);
          --radius-sm: 8px;
          --radius-md: 12px;
          --radius-lg: 16px;
          --radius-xl: 20px;
          --radius-pill: 999px;
        }
        .t-title { font-size: 30px; font-weight: 600; letter-spacing: -0.025em; line-height: 1.2; color: var(--text-1); }
        .t-body { font-size: 15px; font-weight: 400; line-height: 1.75; color: var(--text-2); }
        .t-small { font-size: 13px; font-weight: 400; line-height: 1.6; color: var(--text-2); }
        .t-label { font-size: 11px; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase; color: var(--text-3); }
        .t-caption { font-size: 12px; font-weight: 400; color: var(--text-3); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 450ms cubic-bezier(0.22,1,0.36,1) forwards; opacity: 0; }
        .delay-0 { animation-delay: 0ms; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <nav style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: '60px',
          background: 'rgba(248,247,244,0.80)',
          backdropFilter: 'blur(16px) saturate(180%)',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-1)' }}>CareerCoach</span>
          </div>
        </nav>

        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px' }}>
          <Link href="/" className="t-caption" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '32px', transition: 'color 180ms' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-1)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-3)'}>
            <ArrowLeft style={{ width: '14px', height: '14px' }} />
            Back
          </Link>

          <div style={{ marginBottom: '48px' }}>
            <h1 className="t-title" style={{ marginBottom: '8px' }}>Get Tailored Advice</h1>
            <p className="t-body">Your background + any job post → cover letter, interview prep, fit score.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              padding: '28px',
              transition: 'box-shadow 200ms'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label className="t-label" style={{ display: 'block', marginBottom: '10px' }}>Your Background</label>
                  <textarea
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    placeholder="Skills, experience, what you're looking for..."
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '14px 16px',
                      fontSize: '14px',
                      lineHeight: '1.75',
                      color: 'var(--text-1)',
                      resize: 'vertical',
                      minHeight: '180px',
                      transition: 'border-color 180ms, box-shadow 180ms',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--border-focus)';
                      e.target.style.boxShadow = 'var(--shadow-glow)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label className="t-label" style={{ display: 'block', marginBottom: '10px' }}>Job Description</label>
                  <textarea
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="Paste the full job posting..."
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '14px 16px',
                      fontSize: '14px',
                      lineHeight: '1.75',
                      color: 'var(--text-1)',
                      resize: 'vertical',
                      minHeight: '180px',
                      transition: 'border-color 180ms, box-shadow 180ms',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--border-focus)';
                      e.target.style.boxShadow = 'var(--shadow-glow)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <label className="t-label" style={{ display: 'block', marginBottom: '10px' }}>
                  Interview Questions: {questionCount}
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={questionCount}
                  aria-label="Number of interview questions"
                  aria-valuetext={`${questionCount} questions`}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val > 5) {
                      setError("We limit questions and answers to 5 for now.");
                      setQuestionCount(5);
                    } else {
                      setError(null);
                      setQuestionCount(val);
                    }
                  }}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    accentColor: 'var(--accent)'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span className="t-caption">1</span>
                  <span className="t-caption">30</span>
                </div>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '20px 24px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(13,148,136,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--accent)' }}>
                    <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--text-1)', lineHeight: 1.5 }}>
                    {error}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: 'var(--accent)',
                color: '#fff',
                borderRadius: 'var(--radius-md)',
                height: '42px',
                padding: '0 18px',
                fontSize: '14px',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'background 180ms, box-shadow 180ms, transform 180ms',
                opacity: isLoading ? 0.7 : 1,
                width: '100%'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'var(--accent-hover)';
                  e.currentTarget.style.boxShadow = '0 4px 16px var(--accent-glow)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--accent)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                  Analyzing your fit...
                </>
              ) : (
                <>
                  <Sparkles style={{ width: '14px', height: '14px' }} />
                  Generate Advice
                </>
              )}
            </button>
          </form>
        </main>
      </div>

      {showModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }} 
          onClick={() => setShowModal(false)}
        >
          <div 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="modal-title"
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '1200px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              position: 'sticky',
              top: 0,
              background: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
              padding: '20px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10
            }}>
              <h2 id="modal-title" className="t-title" style={{ margin: 0 }}>Your Tailored Advice</h2>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close dialog"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 180ms'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <X style={{ width: '20px', height: '20px', color: 'var(--text-2)' }} />
              </button>
            </div>

            <div style={{ padding: '28px' }}>
              {parsed ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                  <div style={{
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px'
                  }}>
                    <div className="t-label" style={{ marginBottom: '16px' }}>Cover Letter Bullets</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {parsed.coverLetterBullets.map((bullet, i) => (
                        <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', marginTop: '8px', flexShrink: 0 }} />
                          <span className="t-small">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div className="t-label">Interview Prep</div>
                      <button
                        onClick={() => {
                          const allQA = displayedQA.map((qa, i) => `${i + 1}. Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n');
                          copyToClipboard(allQA, -1);
                        }}
                        style={{
                          background: 'var(--accent)',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          fontWeight: 500,
                          transition: 'background 180ms'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
                      >
                        {copiedIndex === -1 ? (
                          <><Check style={{ width: '12px', height: '12px' }} /> Copied</>
                        ) : (
                          <><Copy style={{ width: '12px', height: '12px' }} /> Copy All</>
                        )}
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {displayedQA.map((qa, i) => (
                        <div key={i}>
                          <p className="t-small" style={{ fontWeight: 600, color: 'var(--text-1)', marginBottom: '4px' }}>
                            {i + 1}. {qa.question}
                          </p>
                          <p className="t-small" style={{ paddingLeft: '12px', borderLeft: '2px solid var(--border)' }}>
                            {qa.answer}
                          </p>
                        </div>
                      ))}
                      {hasMoreQuestions && (
                        <div style={{
                          padding: '16px',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--accent-subtle)',
                          border: '1px solid rgba(13,148,136,0.15)',
                          textAlign: 'center'
                        }}>
                          <p className="t-small" style={{ color: 'var(--accent)', fontWeight: 500 }}>
                            Free tier: 5 questions shown. Upgrade to see all {questionCount} questions.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{
                    background: 'var(--surface-2)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}>
                    <div className="t-label" style={{ marginBottom: '24px' }}>Fit Score</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '64px', fontWeight: 650, color: 'var(--accent)', lineHeight: 1 }}>{parsed.fitScore}</span>
                      <span style={{ fontSize: '22px', fontWeight: 400, color: 'var(--text-3)' }}>/10</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', borderRadius: 'var(--radius-pill)', background: 'var(--surface)', marginBottom: '16px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        background: 'var(--accent)',
                        width: `${parsed.fitScore * 10}%`,
                        transition: 'width 900ms cubic-bezier(0.34,1.56,0.64,1)'
                      }} />
                    </div>
                    <p className="t-small">{parsed.fitReasoning}</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', gap: '12px' }}>
                  <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite', color: 'var(--accent)' }} />
                  <span className="t-body">Generating your advice...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
