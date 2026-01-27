"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Rating from "./Rating";
import Link from "next/link";

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string | null;
  review_date: string | null;
}

interface ReviewsModalProps {
  reviews: Review[];
  isOpen: boolean;
  onClose: () => void;
  googleReviewsLink?: string | null;
  averageRating: number;
}

export default function ReviewsModal({
  reviews,
  isOpen,
  onClose,
  googleReviewsLink,
  averageRating,
}: ReviewsModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  if (!isOpen) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const currentReview = reviews[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 md:p-8"
        style={{ maxHeight: "calc(100vh - 32px)" }}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 border-b border-gray-200 pb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Google Reviews
          </h2>
          <div className="mt-2">
            <Rating rating={averageRating} count={reviews.length} size="md" />
          </div>
        </div>

        {/* Review Carousel */}
        <div className="relative min-h-[200px]">
          {/* Navigation - Hidden on Mobile, Only show on hover on desktop */}
          {reviews.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className={`absolute -left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-50 md:flex ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToNext}
                className={`absolute -right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-50 md:flex ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div className="px-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">
                  {currentReview.reviewer_name}
                </p>
                {currentReview.review_date && (
                  <p className="text-sm text-gray-500">
                    {new Date(currentReview.review_date).toLocaleDateString(
                      "en-AU",
                      {
                        year: "numeric",
                        month: "long",
                      }
                    )}
                  </p>
                )}
              </div>
              <Rating
                rating={currentReview.rating}
                showCount={false}
                size="sm"
              />
            </div>

            {currentReview.review_text && (
              <p className="text-base leading-relaxed text-gray-700">
                {currentReview.review_text}
              </p>
            )}
          </div>
        </div>

        {/* Dots */}
        {reviews.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-6 bg-gray-900"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}

        {/* See More on Google */}
        {googleReviewsLink && (
          <div className="mt-8 border-t border-gray-200 pt-6 text-center">
            <Link
              href={googleReviewsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 underline hover:text-gray-700"
            >
              See all reviews on Google
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
