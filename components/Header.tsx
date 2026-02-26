'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-gray-900 font-display"
            >
              WedList
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/wedding-mc-sydney"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Find an MC
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/list-with-us"
              className="rounded-md bg-[#E31C5F] px-4 py-2 text-sm font-medium text-white hover:bg-[#C4184F] transition-colors"
            >
              List with us
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors focus-visible:outline-2 focus-visible:outline-[#E31C5F] focus-visible:outline-offset-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile slide-in panel + backdrop */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Side panel */}
      <div
        className={`fixed inset-y-0 right-0 w-72 bg-white shadow-xl z-50 md:hidden transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-gray-200">
          <span className="text-lg font-bold tracking-tight text-gray-900 font-display">
            WedList
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Panel links */}
        <div className="px-4 py-6 space-y-1">
          <Link
            href="/wedding-mc-sydney"
            className="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Find an MC
          </Link>
          <Link
            href="/blog"
            className="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/list-with-us"
            className="block rounded-md mx-3 mt-4 px-3 py-2.5 bg-[#E31C5F] text-sm font-medium text-white text-center hover:bg-[#C4184F] transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            List with us
          </Link>
        </div>
      </div>
    </header>
  );
}
