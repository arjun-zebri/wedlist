"use client";

import { useState, useEffect, useRef } from "react";
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
  {
    id: "placeholder-5",
    reviewer_name: "Rachel & Chris",
    rating: 5,
    review_text:
      "We were so nervous about choosing an MC but WedList made it simple. Our MC read the room perfectly all night.",
    review_date: "2023-12-15",
    mc: null,
  },
  {
    id: "placeholder-6",
    reviewer_name: "Amanda & Ben",
    rating: 5,
    review_text:
      "Incredible experience from start to finish. The booking process was smooth and our MC exceeded all expectations.",
    review_date: "2023-12-10",
    mc: null,
  },
  {
    id: "placeholder-7",
    reviewer_name: "Chloe & Ryan",
    rating: 5,
    review_text:
      "Our MC was the highlight of the night. Every guest complimented how well the evening flowed.",
    review_date: "2023-12-05",
    mc: null,
  },
  {
    id: "placeholder-8",
    reviewer_name: "Megan & Josh",
    rating: 5,
    review_text:
      "Transparent pricing and genuine reviews helped us pick the right MC. No surprises, just a perfect night.",
    review_date: "2023-11-28",
    mc: null,
  },
  {
    id: "placeholder-9",
    reviewer_name: "Natalie & Sam",
    rating: 5,
    review_text:
      "We found our MC in under 10 minutes. The whole process was so refreshing compared to other wedding vendors.",
    review_date: "2023-11-20",
    mc: null,
  },
  {
    id: "placeholder-10",
    reviewer_name: "Olivia & Matt",
    rating: 5,
    review_text:
      "Our MC kept the vibe exactly where we wanted it — fun but classy. Couldn't have asked for more.",
    review_date: "2023-11-15",
    mc: null,
  },
  {
    id: "placeholder-11",
    reviewer_name: "Sophie & Daniel",
    rating: 5,
    review_text:
      "From the first message to the big day, everything was seamless. Our MC was worth every cent.",
    review_date: "2023-11-10",
    mc: null,
  },
  {
    id: "placeholder-12",
    reviewer_name: "Hannah & Luke",
    rating: 5,
    review_text:
      "The 4-hour response guarantee is real. We had our MC locked in before we even chose our florist!",
    review_date: "2023-11-05",
    mc: null,
  },
  {
    id: "placeholder-13",
    reviewer_name: "Kate & Andrew",
    rating: 5,
    review_text:
      "We almost didn't hire an MC — so glad we changed our minds. He tied the whole night together beautifully.",
    review_date: "2023-10-28",
    mc: null,
  },
];

function getInitials(name: string): string {
  const words = name.split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function ReviewCard({
  review,
}: {
  review: Review;
}) {
  return (
    <div className="bg-white rounded-xl p-7 border border-gray-200 relative overflow-hidden flex flex-col group transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(227,28,95,0.12)] h-full">
      {/* Corner Border Accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#E31C5F]/60 rounded-tl-lg group-hover:border-[#E31C5F] group-hover:w-8 group-hover:h-8 transition-all duration-300" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#E31C5F]/60 rounded-br-lg group-hover:border-[#E31C5F] group-hover:w-8 group-hover:h-8 transition-all duration-300" />

      {/* Header with stars and Google icon */}
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
        <GoogleIcon />
      </div>

      {/* Review quote — clamped to 4 lines for uniform height */}
      {review.review_text && (
        <p className="text-gray-700 leading-relaxed flex-grow mb-6 text-sm line-clamp-4">
          &ldquo;{review.review_text}&rdquo;
        </p>
      )}

      {/* Reviewer info with avatar */}
      <div className="pt-6 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-50 text-[#E31C5F] flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {getInitials(review.reviewer_name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {review.reviewer_name}
            </p>
            {review.mc && (
              <Link
                href={`/mc/${review.mc.slug}`}
                className="text-xs text-[#E31C5F] hover:text-[#C4184F] transition-colors font-medium mt-0.5 block"
              >
                Booked {review.mc.name}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const [showAll, setShowAll] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [buttonVisible, setButtonVisible] = useState(false);

  // Combine real reviews with placeholders to reach 15 total (6 initial + 9 more)
  const allReviews = [
    ...reviews,
    ...placeholderReviews.slice(0, Math.max(0, 15 - reviews.length)),
  ].slice(0, 15);

  const initialReviews = allReviews.slice(0, 6);
  const extraReviews = allReviews.slice(6, 15);

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

  // Distribute into 3 columns round-robin for masonry
  const distributeToColumns = (items: Review[]): Review[][] => {
    const cols: Review[][] = [[], [], []];
    items.forEach((review, idx) => {
      cols[idx % 3].push(review);
    });
    return cols;
  };

  const initialColumns = distributeToColumns(initialReviews);
  const extraColumns = distributeToColumns(extraReviews);

  return (
    <>
      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4 scrollbar-hide">
        {allReviews.slice(0, 6).map((review) => (
          <div
            key={review.id}
            className="w-[280px] snap-center flex-shrink-0"
          >
            <ReviewCard review={review} />
          </div>
        ))}
      </div>

      {/* Desktop: 3-Column Masonry with Raised Middle */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {initialColumns.map((col, colIdx) => (
          <div
            key={colIdx}
            className="flex flex-col gap-6"
            style={colIdx === 1 ? { marginTop: "-2.5rem" } : undefined}
          >
            {col.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
            {/* Extra reviews appended to same columns */}
            {showAll &&
              extraColumns[colIdx].map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
          </div>
        ))}
      </div>

      {/* See More Button - hidden on mobile */}
      {extraReviews.length > 0 && (
        <div
          ref={buttonRef}
          className="mt-16 hidden md:flex justify-center"
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

      {/* Scrollbar hide styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
