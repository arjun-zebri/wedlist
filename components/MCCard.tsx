'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart } from 'lucide-react';
import { MCProfileWithRelations } from '@/types/database';
import { formatPrice } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface MCCardProps {
  mc: MCProfileWithRelations;
}

export default function MCCard({ mc }: MCCardProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
  const favorited = isLoaded && isFavorite(mc.id);

  const averageRating = mc.reviews && mc.reviews.length > 0
    ? mc.reviews.reduce((acc, review) => acc + review.rating, 0) / mc.reviews.length
    : 0;

  const minPrice = mc.packages && mc.packages.length > 0
    ? Math.min(...mc.packages.map(pkg => pkg.price))
    : null;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(mc.id);
  };

  return (
    <Link
      href={`/mc/${mc.slug}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(227,28,95,0.06)] hover:shadow-[0_6px_16px_rgba(227,28,95,0.12)] hover:-translate-y-1 transition-[transform,box-shadow] duration-300 ease-out focus-visible:outline-2 focus-visible:outline-[#E31C5F] focus-visible:outline-offset-2"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {mc.profile_image ? (
          <Image
            src={mc.profile_image}
            alt={mc.name}
            fill
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <span className="text-4xl font-bold">{mc.name[0]}</span>
          </div>
        )}

        {/* Heart icon */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-[transform,background-color] duration-200"
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={cn(
              'h-5 w-5 transition-colors',
              favorited
                ? 'fill-red-500 text-red-500'
                : 'text-gray-700 hover:text-gray-900'
            )}
          />
        </button>

        {mc.featured && (
          <div className="absolute right-3 bottom-3 rounded-full bg-[#E31C5F] px-3 py-1 text-xs font-medium text-white">
            Featured
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#E31C5F] transition-colors">
          {mc.name}
        </h3>

        {mc.bio && (
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
            {mc.bio}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#E31C5F] text-[#E31C5F]" />
                <span className="text-sm font-medium text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
                {mc.reviews && (
                  <span className="text-sm text-gray-500">
                    ({mc.reviews.length})
                  </span>
                )}
              </div>
            )}

            {mc.languages && mc.languages.length > 0 && (
              <span className="text-sm text-gray-500">
                {mc.languages.join(', ')}
              </span>
            )}
          </div>

          {minPrice && (
            <span className="text-sm font-semibold text-gray-900">
              From {formatPrice(minPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
