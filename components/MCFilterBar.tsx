'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { SortOption } from '@/types/filters';
import { useFilterPersistence } from '@/hooks/useFilterPersistence';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating (Highest First)' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'newest', label: 'Newest' },
];

export default function MCFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useFilterPersistence();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [language, setLanguage] = useState(searchParams.get('language') || '');
  const [sort, setSort] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Debounced filter application
  const applyFilters = useCallback(
    (
      searchVal: string,
      minPriceVal: string,
      maxPriceVal: string,
      languageVal: string,
      sortVal: SortOption
    ) => {
      const params = new URLSearchParams();

      if (searchVal) params.set('search', searchVal);
      if (minPriceVal) params.set('minPrice', minPriceVal);
      if (maxPriceVal) params.set('maxPrice', maxPriceVal);
      if (languageVal) params.set('language', languageVal);
      if (sortVal && sortVal !== 'featured') params.set('sort', sortVal);

      router.push(`/wedding-mc-sydney?${params.toString()}`);
    },
    [router]
  );

  // Auto-apply with 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters(search, minPrice, maxPrice, language, sort);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, minPrice, maxPrice, language, sort, applyFilters]);

  const handleClearAll = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setLanguage('');
    setSort('featured');
    router.push('/wedding-mc-sydney');
    setShowMobileFilters(false);
  };

  const handleRemoveFilter = (filterType: string) => {
    switch (filterType) {
      case 'search':
        setSearch('');
        break;
      case 'minPrice':
        setMinPrice('');
        break;
      case 'maxPrice':
        setMaxPrice('');
        break;
      case 'language':
        setLanguage('');
        break;
    }
  };

  const hasActiveFilters = search || minPrice || maxPrice || language || (sort && sort !== 'featured');

  return (
    <div id="filters" className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showMobileFilters ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Filter Inputs Container */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block space-y-4 md:space-y-0`}>
            {/* Main Filter Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
              {/* Search Input */}
              <div>
                <label htmlFor="search" className="block text-xs font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name..."
                    className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-9 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Min Price Input */}
              <div>
                <label htmlFor="minPrice" className="block text-xs font-medium text-gray-700 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  id="minPrice"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="$500"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              {/* Max Price Input */}
              <div>
                <label htmlFor="maxPrice" className="block text-xs font-medium text-gray-700 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="$2000"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              {/* Language Select */}
              <div>
                <label htmlFor="language" className="block text-xs font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                >
                  <option value="">All Languages</option>
                  <option value="English">English</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="Cantonese">Cantonese</option>
                  <option value="Italian">Italian</option>
                  <option value="Greek">Greek</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>

            {/* Sort Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:items-center lg:justify-between gap-4">
              <div>
                <label htmlFor="sort" className="block text-xs font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear All Button */}
              {hasActiveFilters && (
                <div className="lg:flex lg:items-center lg:gap-2">
                  <button
                    onClick={handleClearAll}
                    className="w-full lg:w-auto rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 items-center pt-2">
                {search && (
                  <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-900">
                    Search: {search}
                    <button
                      onClick={() => handleRemoveFilter('search')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {minPrice && (
                  <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-900">
                    Min: ${minPrice}
                    <button
                      onClick={() => handleRemoveFilter('minPrice')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {maxPrice && (
                  <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-900">
                    Max: ${maxPrice}
                    <button
                      onClick={() => handleRemoveFilter('maxPrice')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {language && (
                  <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-900">
                    {language}
                    <button
                      onClick={() => handleRemoveFilter('language')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                {sort && sort !== 'featured' && (
                  <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-900">
                    Sort: {SORT_OPTIONS.find(o => o.value === sort)?.label}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
