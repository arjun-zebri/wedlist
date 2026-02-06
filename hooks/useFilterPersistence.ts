'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const STORAGE_KEY = 'wedlist_mc_filters';

export function useFilterPersistence() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Restore from localStorage on mount if URL empty
  useEffect(() => {
    const hasUrlParams = Array.from(searchParams.keys()).length > 0;
    if (!hasUrlParams) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const filters = JSON.parse(stored);
          const params = new URLSearchParams();

          if (filters.search) params.set('search', filters.search);
          if (filters.minPrice) params.set('minPrice', filters.minPrice);
          if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
          if (filters.language) params.set('language', filters.language);
          if (filters.sort) params.set('sort', filters.sort);

          if (params.toString()) {
            router.replace(`/wedding-mc-sydney?${params.toString()}`);
          }
        } catch (e) {
          console.error('Failed to restore filters from localStorage:', e);
        }
      }
    }
  }, []);

  // Save whenever URL changes
  useEffect(() => {
    const filters = {
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      language: searchParams.get('language') || undefined,
      sort: searchParams.get('sort') || undefined,
    };

    // Remove undefined values
    Object.keys(filters).forEach(
      key => filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [searchParams]);
}
