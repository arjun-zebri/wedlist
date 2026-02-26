"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const steps = [
  {
    emoji: "🔍",
    label: "Browse & Explore",
    title: "Search & Compare",
    description:
      "Browse verified MCs with real photos, authentic reviews, transparent pricing, and complete packages. Compare side-by-side without any surprises.",
  },
  {
    emoji: "💬",
    label: "Connect Directly",
    title: "Message & Discuss",
    description:
      "Found the perfect fit? Send a message with your wedding date, vision, and special requests. Have a direct conversation with no middleman.",
  },
  {
    emoji: "✨",
    label: "Confirm & Celebrate",
    title: "Book with Confidence",
    description:
      "We guarantee a response within 4 hours. Finalize all details, confirm availability, agree on pricing. Your perfect MC is locked in.",
  },
];

export default function HowItWorks() {
  const outerRef = useRef<HTMLDivElement>(null);
  const desktopGridRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [progress, setProgress] = useState(0);
  const [lineLayout, setLineLayout] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const measureLine = useCallback(() => {
    const grid = desktopGridRef.current;
    const firstBadge = badgeRefs.current[0];
    const lastBadge = badgeRefs.current[2];
    if (!grid || !firstBadge || !lastBadge) return;

    const gridRect = grid.getBoundingClientRect();
    const firstRect = firstBadge.getBoundingClientRect();
    const startX = firstRect.left + firstRect.width / 2 - gridRect.left;
    const endX = gridRect.width;
    const centerY = firstRect.top + firstRect.height / 2 - gridRect.top;

    setLineLayout({ top: centerY, left: startX, width: endX - startX });
  }, []);

  const handleScroll = useCallback(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const rect = outer.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrollable = outer.offsetHeight - vh;
    if (scrollable <= 0) { setProgress(3); return; }

    const scrolled = Math.max(0, -rect.top);
    const animRange = scrollable * 0.85;
    const ratio = Math.min(1, scrolled / animRange);
    setProgress(ratio * 3);
  }, []);

  useEffect(() => {
    handleScroll();
    measureLine();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    window.addEventListener("resize", measureLine);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      window.removeEventListener("resize", measureLine);
    };
  }, [handleScroll, measureLine]);

  useEffect(() => {
    const id = requestAnimationFrame(measureLine);
    return () => cancelAnimationFrame(id);
  }, [measureLine]);

  const getCP = (i: number) =>
    Math.max(0, Math.min(1, (progress - i * 0.85) / 0.7));

  const lineProgress = Math.max(0, Math.min(1, progress / 2.55));

  return (
    <>
      {/* ===== MOBILE — Static layout, no sticky/scroll animation ===== */}
      <div className="md:hidden bg-white px-4 sm:px-6 py-16">
        <div className="mx-auto max-w-7xl w-full">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-900 font-display">
              How it works
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[13px] top-0 bottom-0 w-px bg-[#E31C5F]/20 pointer-events-none" />

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className="relative pl-12">
                  <span className="absolute left-0 top-0 z-10 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#E31C5F] text-white font-bold text-xs shadow-[0_2px_8px_rgba(227,28,95,0.3)]">
                    {i + 1}
                  </span>

                  <div className="overflow-hidden rounded-xl mb-3">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-50 aspect-video flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-1.5">{step.emoji}</div>
                        <p className="text-gray-500 font-medium text-xs">
                          {step.label}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-1 font-display">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP — Sticky scroll-driven animation ===== */}
      <div ref={outerRef} className="relative hidden md:block" style={{ height: "150vh" }}>
        <div className="sticky top-0 z-10 h-screen overflow-hidden bg-white px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="mx-auto max-w-7xl w-full relative z-10">
            <div className="mb-8">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-display">
                How it works
              </h2>
            </div>

            <div
              ref={desktopGridRef}
              className="grid grid-cols-3 gap-6 lg:gap-8 relative"
            >
              {lineLayout && (
                <div
                  className="absolute pointer-events-none z-0"
                  style={{
                    top: lineLayout.top,
                    left: lineLayout.left,
                    width: lineLayout.width,
                    height: "1px",
                    overflow: "hidden",
                    transform: "translateY(-0.5px)",
                  }}
                >
                  <div
                    className="h-full bg-[#E31C5F]/30 origin-left"
                    style={{ transform: `scaleX(${lineProgress})` }}
                  />
                </div>
              )}

              {steps.map((step, i) => {
                const cp = getCP(i);
                const visible = cp > 0;

                return (
                  <div key={i} className="flex flex-col">
                    <div
                      className="overflow-hidden rounded-xl mb-4"
                      style={{
                        opacity: cp,
                        transform: `translateY(${(1 - cp) * -30}px)`,
                        visibility: visible ? "visible" : "hidden",
                      }}
                    >
                      <div className="bg-gradient-to-br from-gray-100 to-gray-50 aspect-[16/10] flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-1.5">{step.emoji}</div>
                          <p className="text-gray-500 font-medium text-xs">
                            {step.label}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="relative flex items-center mb-4 h-7"
                      style={{
                        opacity: cp,
                        visibility: visible ? "visible" : "hidden",
                      }}
                    >
                      <span
                        ref={(el) => { badgeRefs.current[i] = el; }}
                        className="relative z-10 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#E31C5F] text-white font-bold text-xs shadow-[0_2px_8px_rgba(227,28,95,0.3)]"
                        style={{ transform: `scale(${0.4 + cp * 0.6})` }}
                      >
                        {i + 1}
                      </span>
                    </div>

                    <div
                      style={{
                        opacity: cp,
                        transform: `translateY(${(1 - cp) * 30}px)`,
                        visibility: visible ? "visible" : "hidden",
                      }}
                    >
                      <h3 className="text-base font-bold text-gray-900 mb-1.5 font-display">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
