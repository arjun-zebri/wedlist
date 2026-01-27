"use client";

import { useState } from "react";
import ReviewsModal from "./ReviewsModal";

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string | null;
  review_date: string | null;
}

interface ReviewsModalTriggerProps {
  reviews: Review[];
  averageRating: number;
  googleReviewsLink?: string | null;
}

export default function ReviewsModalTrigger({
  reviews,
  averageRating,
  googleReviewsLink,
}: ReviewsModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-6 text-sm font-semibold text-gray-900 underline hover:text-gray-700"
      >
        Show all {reviews.length} reviews
      </button>

      <ReviewsModal
        reviews={reviews}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        googleReviewsLink={googleReviewsLink}
        averageRating={averageRating}
      />
    </>
  );
}
