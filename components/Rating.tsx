interface RatingProps {
  rating: number;
  count?: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
  showStar?: boolean;
}

export default function Rating({
  rating,
  count,
  showCount = true,
  size = "md",
  showStar = true,
}: RatingProps) {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="rating">
      <span className={`rating-number ${sizeClasses[size]}`}>
        {rating.toFixed(1)}
      </span>
      {showStar && <span className="rating-star">★</span>}
      {showCount && count && (
        <span className="rating-count">
          ({count} {count === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
}
