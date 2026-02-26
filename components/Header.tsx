'use client';

import { useState } from 'react';
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-1">
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
              className="block rounded-md mx-3 mt-2 px-3 py-2.5 bg-[#E31C5F] text-sm font-medium text-white text-center hover:bg-[#C4184F] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              List with us
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
