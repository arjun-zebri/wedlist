export type SortOption =
  | 'featured'
  | 'price-low'
  | 'price-high'
  | 'rating'
  | 'name'
  | 'newest';

export interface DirectorySearchParams {
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  language?: string;
  sort?: SortOption;
}

export interface DirectoryStats {
  totalMCs: number;
  avgRating: number;
  reviewCount: number;
}

export interface FilterState {
  search: string;
  minPrice: string;
  maxPrice: string;
  language: string;
  sortBy: SortOption;
}
