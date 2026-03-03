interface FormattedResponseProps {
  text: string;
}

export function FormattedResponse({ text }: FormattedResponseProps) {
  const sections = text.split('##').filter(Boolean);

  return (
    <div className="space-y-8">
      {sections.map((section, idx) => {
        const lines = section.trim().split('\n');
        const title = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();

        if (title.toLowerCase().includes('cover letter')) {
          const bullets = content.split('\n').filter(line => line.trim().startsWith('-'));
          return (
            <div key={idx} className="space-y-3">
              <h3 className="text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
                Cover Letter Bullets
              </h3>
              <ul className="space-y-2">
                {bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                    <span style={{ color: 'var(--accent)' }}>•</span>
                    <span>{bullet.replace(/^-\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        if (title.toLowerCase().includes('interview')) {
          const qaPairs = content.split(/\d+\.\s+/).filter(Boolean);
          return (
            <div key={idx} className="space-y-4">
              <h3 className="text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
                Interview Prep
              </h3>
              <div className="space-y-4">
                {qaPairs.map((pair, i) => {
                  const [question, answer] = pair.split('**Sample answer:**');
                  const q = question.replace('**Question:**', '').trim();
                  const a = answer?.trim();
                  return (
                    <div key={i} className="space-y-2">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>
                        {i + 1}. {q}
                      </p>
                      {a && (
                        <p className="text-sm leading-relaxed pl-4" style={{ 
                          color: 'var(--text-2)',
                          borderLeft: '2px solid var(--border)'
                        }}>
                          {a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        if (title.toLowerCase().includes('fit score')) {
          const scoreMatch = content.match(/\*\*Score:\*\*\s*(\d+)\/10/);
          const reasoningMatch = content.match(/\*\*Reasoning:\*\*\s*([\s\S]+)/);
          const score = scoreMatch ? scoreMatch[1] : '0';
          const reasoning = reasoningMatch ? reasoningMatch[1].trim() : '';

          return (
            <div key={idx} className="space-y-4">
              <h3 className="text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
                Fit Score
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-semibold" style={{ color: 'var(--accent)' }}>{score}</span>
                <span className="text-2xl" style={{ color: 'var(--text-3)' }}>/10</span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--surface-2)' }}>
                <div 
                  className="h-full rounded-full transition-all duration-700"
                  style={{ 
                    background: 'var(--accent)',
                    width: `${parseInt(score) * 10}%`
                  }}
                />
              </div>
              {reasoning && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>
                  {reasoning}
                </p>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
