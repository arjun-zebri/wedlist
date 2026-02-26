"use client";

import { useEffect, useRef, useState } from "react";
import {
  Star,
  Clock,
  Lock,
  Check,
  XCircle,
  Sparkles,
  X,
  MessageSquare,
} from "lucide-react";

export default function BeforeAfterComparison() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const reveal = (delayMs: number) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? "translateY(0) scale(1)"
      : "translateY(32px) scale(0.97)",
    transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms`,
  });

  return (
    <div ref={sectionRef} className="mx-auto max-w-6xl relative z-10">
      {/* Heading */}
      <div className="text-center mb-14" style={reveal(0)}>
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-[#E31C5F]" />
          <span className="text-xs font-semibold text-gray-700">
            The Challenge
          </span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-display mb-4 leading-tight">
          See the difference
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Stop guessing. Start comparing.
        </p>
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* ── LEFT: The Old Way ── */}
        <div
          className="rounded-2xl bg-gray-900 border border-gray-700 shadow-[0_4px_24px_rgba(0,0,0,0.3)] overflow-hidden pointer-events-none select-none"
          style={reveal(200)}
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="ml-3 flex-1 rounded-md bg-gray-700 px-3 py-1 text-[11px] text-gray-400 truncate">
              random-mc-site.com.au
            </div>
          </div>

          {/* Mock page */}
          <div className="p-5 space-y-4">
            {/* Fake nav */}
            <div className="flex items-center gap-3">
              <div className="h-3 w-20 rounded bg-gray-700" />
              <div className="h-3 w-14 rounded bg-gray-700/60" />
              <div className="h-3 w-14 rounded bg-gray-700/60" />
              <div className="ml-auto h-3 w-16 rounded bg-gray-700/40" />
            </div>

            <div className="h-px bg-gray-700/50" />

            {/* Fake MC "card" */}
            <div className="rounded-xl bg-gray-800/80 p-4 space-y-3 border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-600" />
                <div className="space-y-1.5">
                  <div className="h-3 w-28 rounded bg-gray-600" />
                  <div className="h-2 w-20 rounded bg-gray-700" />
                </div>
              </div>

              {/* Hidden pricing */}
              <div className="flex items-center gap-2 rounded-lg bg-gray-700/60 px-3 py-2">
                <Lock className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-400 font-medium">
                  Contact for pricing
                </span>
                <div className="ml-auto h-3 w-16 rounded bg-gray-600/60 blur-[2px]" />
              </div>

              {/* Slow reply */}
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs text-red-400/80">
                  Sent 3 days ago &middot; No reply
                </span>
              </div>

              {/* Fake unverified reviews */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-600/60" />
                  <div className="h-2 w-32 rounded bg-gray-700/60" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-600/60" />
                  <div className="h-2 w-24 rounded bg-gray-700/60" />
                </div>
              </div>
            </div>

            {/* Fake cookie banner */}
            <div className="rounded-lg bg-gray-800 border border-gray-700/60 px-3 py-2 flex items-center gap-2">
              <X className="w-3 h-3 text-gray-500" />
              <div className="h-2 w-28 rounded bg-gray-700/60" />
              <div className="ml-auto h-5 w-14 rounded bg-gray-600/80" />
            </div>
          </div>

          {/* Label */}
          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/60 border-t border-gray-700/50">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-semibold text-gray-300">
              The Old Way
            </span>
          </div>
        </div>

        {/* ── RIGHT: The WedList Way ── */}
        <div
          className="rounded-2xl bg-white border border-gray-300 shadow-[0_4px_24px_rgba(227,28,95,0.08)] overflow-hidden pointer-events-none select-none transition-transform duration-300 hover:pointer-events-auto hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(227,28,95,0.15)]"
          style={reveal(400)}
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="ml-3 flex-1 flex items-center gap-1.5 rounded-md bg-white px-3 py-1 border border-gray-200">
              <Lock className="w-2.5 h-2.5 text-green-500" />
              <span className="text-[11px] text-gray-600 truncate">
                wedlist.com.au
              </span>
            </div>
          </div>

          {/* Mock page */}
          <div className="p-5 space-y-4">
            {/* Fake nav */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-900">WedList</span>
              <div className="h-3 w-14 rounded bg-gray-200/80" />
              <div className="h-3 w-14 rounded bg-gray-200/80" />
              <div className="ml-auto h-7 w-16 rounded-full bg-[#E31C5F]/10" />
            </div>

            <div className="h-px bg-gray-100" />

            {/* MC profile card */}
            <div className="rounded-xl bg-white p-4 space-y-3 border border-gray-300 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E31C5F]/20 to-[#E31C5F]/5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    James Mitchell
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-[#E31C5F] text-[#E31C5F]"
                      />
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1">
                      (48 reviews)
                    </span>
                  </div>
                </div>
                <span className="ml-auto text-[#E31C5F] font-bold text-sm">
                  From $1,200
                </span>
              </div>

              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-medium text-[#E31C5F]">
                  <Clock className="w-3 h-3" />
                  Responds in 4hrs
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700">
                  <Check className="w-3 h-3" />
                  Google Verified
                </span>
              </div>

              {/* Mini review */}
              <div className="rounded-lg bg-gray-50 px-3 py-2 space-y-1">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-2.5 h-2.5 fill-[#E31C5F] text-[#E31C5F]"
                    />
                  ))}
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  &ldquo;James made our wedding unforgettable. Professional,
                  funny, and kept the energy up all night!&rdquo;
                </p>
                <p className="text-[10px] text-gray-400">— Sarah &amp; Tom</p>
              </div>

              {/* CTA */}
              <button className="w-full rounded-full bg-[#E31C5F] text-white text-xs font-semibold py-2.5 cursor-default">
                Book Now
              </button>
            </div>

            {/* Availability hint */}
            <div className="flex items-center gap-2 text-[11px] text-gray-400">
              <MessageSquare className="w-3 h-3" />
              <span>Instant messaging available after enquiry</span>
            </div>
          </div>

          {/* Label */}
          <div className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-50/50 border-t border-gray-100">
            <Sparkles className="w-4 h-4 text-[#E31C5F]" />
            <span className="text-sm font-semibold text-gray-900">
              The WedList Way
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
