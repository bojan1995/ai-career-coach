import Link from "next/link";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 h-[60px] backdrop-blur-md" style={{ 
      background: 'rgba(248,247,244,0.85)', 
      borderBottom: '1px solid var(--border)' 
    }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        <Link href="/" className="font-semibold text-sm md:text-[15px]" style={{ color: 'var(--text-1)' }}>
          CareerCoach
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-3 md:gap-6">
          <Link href="/how-it-works" className="text-xs md:text-sm" style={{ color: 'var(--text-2)' }}>
            How it works
          </Link>
          <Link 
            href="/coach"
            className="h-8 md:h-9 px-3 md:px-4 rounded-xl text-xs md:text-sm font-medium flex items-center transition-all duration-180"
            style={{ 
              background: 'var(--accent)', 
              color: 'white',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            Get Started
          </Link>
        </div>

        <MobileMenu />
      </div>
    </nav>
  );
}
