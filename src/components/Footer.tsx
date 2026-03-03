export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-8" style={{ 
      background: 'var(--surface)', 
      borderColor: 'var(--border)' 
    }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm" style={{ color: 'var(--text-3)' }}>
        <p>© 2025 AI Career Coach</p>
        <p>
          Built by{' '}
          <a 
            href="https://github.com/bojan1995" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-colors hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            Bojan
          </a>
        </p>
      </div>
    </footer>
  );
}
