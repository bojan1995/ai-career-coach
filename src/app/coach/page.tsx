"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Sparkles, Loader2, X, Copy, Check } from "lucide-react";
import { Navbar } from "@/components";

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
      const reasoningMatch = section.match(/\*\*Reasoning:\*\*\s*([\s\S]+)/);
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
  const [copiedBullet, setCopiedBullet] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [hasError, setHasError] = useState(false);

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
      setHasError(false);

      try {
        const res = await fetch("/api/advice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeAndJob: combined }),
        });

        if (!res.ok) {
          setHasError(true);
          setIsLoading(false);
          return;
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          setHasError(true);
          setIsLoading(false);
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
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [profile, jobDesc]
  );

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setShowToast(true);
    setTimeout(() => {
      setCopiedIndex(null);
      setShowToast(false);
    }, 2000);
  };

  const copyBullet = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedBullet(index);
    setTimeout(() => setCopiedBullet(null), 1500);
  };

  const resetForm = () => {
    setShowModal(false);
    setHasError(false);
    setResult("");
    setError(null);
  };

  const parsed = result ? parseAdvice(result) : null;
  const displayedQA = parsed ? parsed.interviewQA.slice(0, questionCount) : [];

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
        .t-title { font-size: 24px; font-weight: 600; letter-spacing: -0.025em; line-height: 1.2; color: var(--text-1); font-family: var(--font-inter), system-ui, sans-serif; }
        @media (min-width: 768px) {
          .t-title { font-size: 30px; }
        }
        .t-body { font-size: 14px; font-weight: 400; line-height: 1.75; color: var(--text-2); font-family: var(--font-inter), system-ui, sans-serif; }
        @media (min-width: 768px) {
          .t-body { font-size: 15px; }
        }
        .t-small { font-size: 13px; font-weight: 400; line-height: 1.6; color: var(--text-2); font-family: var(--font-inter), system-ui, sans-serif; }
        .t-label { font-size: 11px; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase; color: var(--text-3); font-family: var(--font-inter), system-ui, sans-serif; }
        .t-caption { font-size: 12px; font-weight: 400; color: var(--text-3); font-family: var(--font-inter), system-ui, sans-serif; }
      `}</style>

      <div className="relative z-[1] min-h-screen">
        <Navbar />

        <main className="max-w-[900px] mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="mb-8 md:mb-12">
            <h1 className="t-title mb-2">Get Tailored Advice</h1>
            <p className="t-body">Your background + any job post → cover letter, interview prep, fit score.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">
            <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-5 md:p-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label className="t-label block mb-2.5">Your Background</label>
                  <textarea
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    placeholder="Skills, experience, what you're looking for..."
                    disabled={isLoading}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm leading-relaxed text-[var(--text-1)] resize-vertical min-h-[120px] md:min-h-[180px] transition-all outline-none focus:border-[var(--border-focus)] focus:shadow-[0_0_0_3px_var(--accent-subtle)]"
                  />
                </div>

                <div>
                  <label className="t-label block mb-2.5">Job Description</label>
                  <textarea
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="Paste the full job posting..."
                    disabled={isLoading}
                    className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm leading-relaxed text-[var(--text-1)] resize-vertical min-h-[120px] md:min-h-[180px] transition-all outline-none focus:border-[var(--border-focus)] focus:shadow-[0_0_0_3px_var(--accent-subtle)]"
                  />
                </div>
              </div>

              <div className="mt-5 md:mt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="t-label">Interview Questions</label>
                  <span className="text-lg md:text-xl font-semibold" style={{ color: 'var(--accent)' }}>{questionCount}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={questionCount}
                    aria-label="Number of interview questions"
                    aria-valuetext={`${questionCount} questions`}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setError(null);
                      setQuestionCount(val);
                    }}
                    disabled={isLoading}
                    className="w-full"
                    style={{
                      background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((questionCount - 1) / 4) * 100}%, var(--surface-2) ${((questionCount - 1) / 4) * 100}%, var(--surface-2) 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="t-caption">1</span>
                  <span className="t-caption">5</span>
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--text-3)' }}>Free tier limited to 5 questions</p>
              </div>
            </div>

            {error && (
              <div className="p-4 md:p-5 rounded-xl bg-white border border-[var(--border)] shadow-sm flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 rounded-full bg-[rgba(13,148,136,0.1)] flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--accent)' }}>
                    <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-[var(--accent)] text-white rounded-xl h-11 md:h-12 px-5 text-sm font-medium flex items-center justify-center gap-2 border-none cursor-pointer transition-all w-full hover:bg-[var(--accent-hover)] hover:shadow-[0_4px_16px_var(--accent-glow)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing your fit...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Advice
                </>
              )}
            </button>
          </form>
        </main>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-[200] transition-all duration-300 ease-out" style={{
          animation: 'slideInUp 0.3s ease-out'
        }}>
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
          <span className="text-sm font-medium">Copied to clipboard</span>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 md:p-6"
          onClick={() => !isLoading && setShowModal(false)}
        >
          <div 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="modal-title"
            className="bg-white rounded-2xl max-w-[1200px] w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-[var(--border)] p-4 md:p-6 flex items-center justify-between z-10">
              <h2 id="modal-title" className="t-title m-0">Your Tailored Advice</h2>
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close dialog"
                className="bg-transparent border-none cursor-pointer p-2 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--surface-2)]"
              >
                <X className="w-5 h-5" style={{ color: 'var(--text-2)' }} />
              </button>
            </div>

            <div className="p-4 md:p-7">
              {hasError ? (
                <div className="flex flex-col items-center justify-center p-12 gap-4">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Something went wrong</h3>
                  <p className="text-sm text-gray-600 text-center max-w-md">
                    Please try again. If the problem persists, check your API key.
                  </p>
                  <button
                    onClick={resetForm}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : isLoading ? (
                <div className="grid grid-cols-1 gap-5 md:gap-6">
                  {/* Skeleton for Cover Letter */}
                  <div className="bg-[var(--surface-2)] rounded-xl p-5 md:p-6 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-32 mb-4"></div>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2.5 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-300 rounded w-full"></div>
                          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                        </div>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-300 rounded w-full"></div>
                          <div className="h-3 bg-gray-300 rounded w-4/6"></div>
                        </div>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-gray-300 rounded w-full"></div>
                          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skeleton for Interview Prep */}
                  <div className="bg-[var(--surface-2)] rounded-xl p-5 md:p-6 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-28 mb-4"></div>
                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6 mt-1"></div>
                      </div>
                      <div>
                        <div className="h-3 bg-gray-300 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-4/6 mt-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Skeleton for Fit Score */}
                  <div className="bg-[var(--surface-2)] rounded-xl p-5 md:p-6 flex flex-col items-center text-center animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-20 mb-6"></div>
                    <div className="h-16 w-24 bg-gray-300 rounded mb-4"></div>
                    <div className="w-full h-1 rounded-full bg-gray-200 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ) : parsed ? (
                <div className="grid grid-cols-1 gap-5 md:gap-6">
                  <div className="bg-[var(--surface-2)] rounded-xl p-5 md:p-6">
                    <div className="t-label mb-4">Cover Letter Bullets</div>
                    <div className="flex flex-col gap-3">
                      {parsed.coverLetterBullets.map((bullet, i) => (
                        <div key={i} className="flex gap-2.5 items-start group">
                          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-2 flex-shrink-0" />
                          <span className="t-small flex-1">{bullet}</span>
                          <button
                            onClick={() => copyBullet(bullet, i)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white rounded"
                            aria-label="Copy bullet"
                          >
                            {copiedBullet === i ? (
                              <Check className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <svg className="w-3.5 h-3.5" style={{ color: 'var(--text-3)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[var(--surface-2)] rounded-xl p-5 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="t-label">Interview Prep</div>
                      <button
                        onClick={() => {
                          const allQA = displayedQA.map((qa, i) => `${i + 1}. Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n');
                          copyToClipboard(allQA, -1);
                        }}
                        className="bg-[var(--accent)] text-white border-none cursor-pointer px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors hover:bg-[var(--accent-hover)]"
                      >
                        {copiedIndex === -1 ? (
                          <><Check className="w-3 h-3" /> Copied</>
                        ) : (
                          <><Copy className="w-3 h-3" /> Copy All</>
                        )}
                      </button>
                    </div>
                    <div className="flex flex-col gap-4">
                      {displayedQA.map((qa, i) => (
                        <div key={i}>
                          <p className="t-small font-semibold mb-1" style={{ color: 'var(--text-1)' }}>
                            {i + 1}. {qa.question}
                          </p>
                          <p className="t-small pl-3 border-l-2 border-[var(--border)]">
                            {qa.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[var(--surface-2)] rounded-xl p-5 md:p-6 flex flex-col items-center text-center">
                    <div className="t-label mb-6">Fit Score</div>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-5xl md:text-6xl font-semibold leading-none" style={{ color: 'var(--accent)' }}>{parsed.fitScore}</span>
                      <span className="text-xl md:text-2xl" style={{ color: 'var(--text-3)' }}>/10</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-white mb-4 overflow-hidden">
                      <div 
                        className="h-full bg-[var(--accent)] transition-all duration-700"
                        style={{ width: `${parsed.fitScore * 10}%` }}
                      />
                    </div>
                    <p className="t-small">{parsed.fitReasoning}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-12 gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--accent)' }} />
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
