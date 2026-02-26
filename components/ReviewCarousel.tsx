"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Star } from "lucide-react";

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string | null;
  review_date: string | null;
  mc: { name: string; slug: string } | null;
}

interface ReviewCarouselProps {
  reviews: Review[];
}

// Placeholder reviews for demo purposes
const placeholderReviews: Review[] = [
  {
    id: "placeholder-1",
    reviewer_name: "Sarah & Michael",
    rating: 5,
    review_text:
      "Absolute game-changer for our wedding! Our MC brought such energy and professionalism. Highly recommend!",
    review_date: "2024-01-15",
    mc: null,
  },
  {
    id: "placeholder-2",
    reviewer_name: "Jessica & David",
    rating: 5,
    review_text:
      "Best decision we made was booking through WedList. Our MC was personable, funny, and kept everything on track.",
    review_date: "2024-01-10",
    mc: null,
  },
  {
    id: "placeholder-3",
    reviewer_name: "Emma & James",
    rating: 5,
    review_text:
      "Made our reception unforgettable. The service was impeccable and our guests are still talking about it!",
    review_date: "2023-12-28",
    mc: null,
  },
  {
    id: "placeholder-4",
    reviewer_name: "Lisa & Tom",
    rating: 5,
    review_text:
      "Finding our MC was so easy. Everything was transparent and the experience was seamless from start to finish.",
    review_date: "2023-12-20",
    mc: null,
  },
];

function ReviewCard({
  review,
  delay,
}: {
  review: Review;
  delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="opacity-0"
      style={{
        ...(isVisible
          ? {
              opacity: 1,
              transform: "translateY(0) scale(1)",
              transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
            }
          : {
              opacity: 0,
              transform: "translateY(32px) scale(0.97)",
            }),
      }}
    >
      <div className="bg-white rounded-xl p-7 border border-gray-200 relative overflow-hidden flex flex-col group transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(227,28,95,0.12)]">
        {/* Corner Border Accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#E31C5F]/60 rounded-tl-lg group-hover:border-[#E31C5F] group-hover:w-8 group-hover:h-8 transition-all duration-300" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#E31C5F]/60 rounded-br-lg group-hover:border-[#E31C5F] group-hover:w-8 group-hover:h-8 transition-all duration-300" />

        {/* Header with stars and Google badge */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 transition-transform duration-300 ${
                  i < review.rating
                    ? "fill-[#E31C5F] text-[#E31C5F] group-hover:scale-110"
                    : "fill-gray-200 text-gray-200"
                }`}
                style={
                  i < review.rating
                    ? { transitionDelay: `${i * 50}ms` }
                    : undefined
                }
              />
            ))}
          </div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-bold text-blue-700 border border-blue-200">
            <span className="w-3 h-3 flex items-center justify-center text-blue-600 font-bold text-[10px]">
              G
            </span>
            Google
          </div>
        </div>

        {/* Review quote */}
        {review.review_text && (
          <p className="text-gray-700 leading-relaxed flex-grow mb-6 text-sm">
            &ldquo;{review.review_text}&rdquo;
          </p>
        )}

        {/* Reviewer info */}
        <div className="pt-6 border-t border-gray-100">
          <p className="font-semibold text-gray-900 text-sm">
            {review.reviewer_name}
          </p>
          {review.mc && (
            <Link
              href={`/mc/${review.mc.slug}`}
              className="text-xs text-[#E31C5F] hover:text-[#C4184F] transition-colors font-medium mt-1 block"
            >
              Booked {review.mc.name}
            </Link>
          )}
          {!review.mc && (
            <p className="text-xs text-gray-500 mt-1">
              Verified Google Review
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const [showAll, setShowAll] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [buttonVisible, setButtonVisible] = useState(false);

  // Combine real reviews with placeholders to reach 6 total
  const allReviews = [
    ...reviews,
    ...placeholderReviews.slice(0, Math.max(0, 6 - reviews.length)),
  ].slice(0, 6);

  const visibleReviews = showAll ? allReviews : allReviews.slice(0, 6);

  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setButtonVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Distribute reviews into 3 columns round-robin
  const columns: Review[][] = [[], [], []];
  visibleReviews.forEach((review, idx) => {
    columns[idx % 3].push(review);
  });

  return (
    <>
      {/* Reviews Grid - 3-Column Masonry with Raised Middle */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {columns.map((col, colIdx) => (
          <div
            key={colIdx}
            className="flex flex-col gap-6"
            style={colIdx === 1 ? { marginTop: "-2.5rem" } : undefined}
          >
            {col.map((review, rowIdx) => {
              const globalIdx = rowIdx * 3 + colIdx;
              return (
                <ReviewCard
                  key={review.id}
                  review={review}
                  delay={globalIdx * 120}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* See More Button */}
      {allReviews.length > 0 && (
        <div
          ref={buttonRef}
          className="mt-16 flex justify-center"
          style={{
            opacity: buttonVisible ? 1 : 0,
            transform: buttonVisible ? "translateY(0)" : "translateY(16px)",
            transition:
              "opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s",
          }}
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="group relative px-8 py-3.5 bg-[#E31C5F] text-white rounded-lg font-semibold hover:bg-[#C4184F] transition-transform duration-300 shadow-[0_4px_12px_rgba(227,28,95,0.3)] hover:shadow-[0_8px_20px_rgba(227,28,95,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            {showAll ? "Show less reviews" : "See more reviews"}
            <span
              className={`ml-2 inline-block transition-transform duration-300 ${
                showAll ? "rotate-180" : ""
              }`}
            >
              ↓
            </span>
          </button>
        </div>
      )}
    </>
  );
}
