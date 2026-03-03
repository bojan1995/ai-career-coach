"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
            className="h-8 md:h-9 px-3 md:px-4 rounded-xl text-xs md:text-sm font-medium flex items-center transition-all duration-180 hover:-translate-y-[1px]"
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

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-1)' }}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden absolute top-[60px] left-0 right-0 bg-white border-b border-[var(--border)] shadow-lg">
          <div className="flex flex-col p-4 gap-3">
            <Link 
              href="/how-it-works" 
              className="text-sm py-2 px-3 rounded-lg transition-colors"
              style={{ color: 'var(--text-2)' }}
              onClick={() => setIsOpen(false)}
            >
              How it works
            </Link>
            <Link 
              href="/coach"
              className="h-10 px-4 rounded-xl text-sm font-medium flex items-center justify-center"
              style={{ 
                background: 'var(--accent)', 
                color: 'white'
              }}
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
