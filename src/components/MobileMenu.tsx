"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden p-2 rounded-lg transition-colors"
        style={{ color: 'var(--text-1)' }}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

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
    </>
  );
}
