"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Navbar } from "@/components";

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
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-hover)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(13,148,136,0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--accent)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                }}
              >
                <Sparkles className="w-[14px] h-[14px]" />
                Start Coaching — it's free
              </Link>
            </div>

            <p className="animate-fade-up opacity-0 delay-320 text-xs pt-3" style={{ color: 'var(--text-3)' }}>
              Built for developers and job seekers
            </p>

            <div className="animate-fade-up opacity-0 delay-320 flex items-center justify-center gap-2 md:gap-3 pt-8 flex-wrap">
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
          </div>
        </main>
      </div>
    </>
  );
}
