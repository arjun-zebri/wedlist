'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  resultsPerPage?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalResults,
  resultsPerPage = 20,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    router.push(`/wedding-mc-sydney?${params.toString()}`);
  };

  // Calculate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-12">
      {/* Results count */}
      <p className="text-sm text-gray-600">
        Showing {startResult} – {endResult} of {totalResults} results
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-2">
        {/* Previous */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'p-2 rounded-lg border transition-all',
            currentPage === 1
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:border-gray-900'
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={cn(
              'px-4 py-2 rounded-lg border transition-all text-sm font-medium',
              page === currentPage
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-300 text-gray-700 hover:border-gray-900'
            )}
          >
            {page}
          </button>
        ))}

        {/* Ellipsis if there are more pages */}
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <>
            <span className="px-2 text-gray-400">...</span>
            <button
              onClick={() => goToPage(totalPages)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:border-gray-900 transition-all text-sm font-medium"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2 rounded-lg border transition-all',
            currentPage === totalPages
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:border-gray-900'
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
