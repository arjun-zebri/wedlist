"use client";

import { useEffect, useRef, useState } from "react";

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

  return (
    <div ref={sectionRef} className="px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E31C5F]" />
            <span className="text-xs font-semibold text-gray-700">
              Simple Process
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 font-display mb-4 leading-tight">
            How it works
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Three simple steps from browsing to booking.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 500ms cubic-bezier(0.22,1,0.36,1) ${i * 150}ms, transform 500ms cubic-bezier(0.22,1,0.36,1) ${i * 150}ms`,
              }}
            >
              {/* Emoji card */}
              <div className="w-full aspect-[16/10] rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/80 border border-gray-200 flex items-center justify-center mb-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="text-center">
                  <div className="text-4xl mb-1.5">{step.emoji}</div>
                  <p className="text-gray-500 font-medium text-xs">
                    {step.label}
                  </p>
                </div>
              </div>

              {/* Step number badge with connecting line */}
              <div className="relative w-full flex justify-center mb-4">
                {/* Connecting line segment — extends from badge to the right edge (except last step) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-[calc(50%+20px)] right-[-2rem] lg:right-[-2.5rem] h-px bg-gradient-to-r from-[#E31C5F]/30 to-[#E31C5F]/10 -translate-y-1/2 pointer-events-none" />
                )}
                {/* Connecting line segment — extends from the left edge to badge (except first step) */}
                {i > 0 && (
                  <div className="hidden md:block absolute top-1/2 right-[calc(50%+20px)] left-[-2rem] lg:left-[-2.5rem] h-px bg-gradient-to-r from-[#E31C5F]/10 to-[#E31C5F]/30 -translate-y-1/2 pointer-events-none" />
                )}
                <div className="relative z-10 w-8 h-8 rounded-full bg-[#E31C5F] text-white flex items-center justify-center text-sm font-bold shadow-[0_2px_8px_rgba(227,28,95,0.3)]">
                  {i + 1}
                </div>
              </div>

              {/* Text */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-display">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
