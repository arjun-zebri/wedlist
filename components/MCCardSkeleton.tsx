export default function MCCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Image skeleton */}
      <div className="relative aspect-[4/3] w-full bg-gray-200 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        {/* Name skeleton */}
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />

        {/* Bio skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        </div>

        {/* Rating and price skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
        </div>
      </div>
    </div>
  );
}
