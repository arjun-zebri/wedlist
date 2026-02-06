"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Star, DollarSign, Award, Globe, Clock, ChevronDown } from "lucide-react";
import { SortOption } from "@/types/filters";
import { useFilterPersistence } from "@/hooks/useFilterPersistence";
import { cn } from "@/lib/utils";
import FilterModal from "./FilterModal";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Rating (Highest First)" },
  { value: "name", label: "Name (A-Z)" },
  { value: "newest", label: "Newest" },
];

type CategoryPill =
  | "top-rated"
  | "budget-friendly"
  | "experienced"
  | "bilingual"
  | "recent"
  | null;

export default function MCFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useFilterPersistence();
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [language, setLanguage] = useState(searchParams.get("language") || "");
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "featured"
  );
  const [activePills, setActivePills] = useState<Set<string>>(new Set());
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [priceModalMin, setPriceModalMin] = useState(minPrice);
  const [priceModalMax, setPriceModalMax] = useState(maxPrice);

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

      if (searchVal) params.set("search", searchVal);
      if (minPriceVal) params.set("minPrice", minPriceVal);
      if (maxPriceVal) params.set("maxPrice", maxPriceVal);
      if (languageVal) params.set("language", languageVal);
      if (sortVal && sortVal !== "featured") params.set("sort", sortVal);

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

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    };

    if (sortDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [sortDropdownOpen]);

  const handleClearAll = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setLanguage("");
    setSort("featured");
    setActivePills(new Set());
    router.push("/wedding-mc-sydney");
  };

  const handlePillClick = (pill: CategoryPill) => {
    if (!pill) return;

    const newActivePills = new Set(activePills);
    const isPillActive = newActivePills.has(pill);

    if (isPillActive) {
      // Toggle off
      newActivePills.delete(pill);
      if (pill === "top-rated") {
        setSort("featured");
      } else if (pill === "recent") {
        setSort("featured");
      }
    } else {
      // Toggle on
      if (pill === "top-rated") {
        newActivePills.delete("recent");
        setSort("rating");
      } else if (pill === "recent") {
        newActivePills.delete("top-rated");
        setSort("newest");
      } else if (pill === "budget-friendly") {
        setPriceModalMin("");
        setPriceModalMax("1000");
        setPriceModalOpen(true);
      }
      newActivePills.add(pill);
    }

    setActivePills(newActivePills);
  };

  const handlePriceModalApply = () => {
    setMinPrice(priceModalMin);
    setMaxPrice(priceModalMax);
  };

  const hasActiveFilters =
    search || minPrice || maxPrice || language || (sort && sort !== "featured");

  return (
    <>
      <div
        id="filters"
        className="sticky top-0 z-[1100] bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
      >
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1400px]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-4">
              {/* Search Bar - Left Side */}
              <div className="flex-shrink-0 lg:w-80">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search MCs by name..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all"
                  />
                </div>
              </div>

              {/* Category Pills - Right Side (Horizontal Scroll) */}
              <div className="flex-1 overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-2 pb-1 min-w-min">
                  <button
                    onClick={() => handlePillClick("top-rated")}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition-all duration-200",
                      activePills.has("top-rated")
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                    )}
                  >
                    <Star className="h-4 w-4" />
                    <span>Top Rated</span>
                  </button>

                  <button
                    onClick={() => handlePillClick("budget-friendly")}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition-all duration-200",
                      activePills.has("budget-friendly")
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                    )}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Budget</span>
                  </button>

                  <button
                    onClick={() => handlePillClick("experienced")}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition-all duration-200",
                      activePills.has("experienced")
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                    )}
                  >
                    <Award className="h-4 w-4" />
                    <span>Experienced</span>
                  </button>

                  <button
                    onClick={() => handlePillClick("bilingual")}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition-all duration-200",
                      activePills.has("bilingual")
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                    )}
                  >
                    <Globe className="h-4 w-4" />
                    <span>Bilingual</span>
                  </button>

                  <button
                    onClick={() => handlePillClick("recent")}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition-all duration-200",
                      activePills.has("recent")
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-900"
                    )}
                  >
                    <Clock className="h-4 w-4" />
                    <span>Recent</span>
                  </button>

                  {/* Clear All */}
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearAll}
                      className="ml-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors whitespace-nowrap"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Sort Dropdown - Custom */}
              <div className="flex-shrink-0 relative" ref={sortDropdownRef}>
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="rounded-full border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:border-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  {SORT_OPTIONS.find((o) => o.value === sort)?.label || "Sort"}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      sortDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {sortDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-[1200] min-w-max overflow-hidden">
                    {SORT_OPTIONS.map((option, index) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSort(option.value);
                          setSortDropdownOpen(false);
                        }}
                        className={cn(
                          "block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors",
                          sort === option.value ? "bg-gray-100 font-medium text-gray-900" : "text-gray-700",
                          index === 0 ? "rounded-t-xl" : "",
                          index === SORT_OPTIONS.length - 1 ? "rounded-b-xl" : ""
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="mt-3 flex flex-wrap gap-2 items-center">
                {search && (
                  <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-900">
                    {search}
                    <button
                      onClick={() => setSearch("")}
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
                      onClick={() => setMinPrice("")}
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
                      onClick={() => setMaxPrice("")}
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
                      onClick={() => setLanguage("")}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price Range Modal */}
      <FilterModal
        isOpen={priceModalOpen}
        onClose={() => setPriceModalOpen(false)}
        title="Price Range"
        onApply={handlePriceModalApply}
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="modal-min-price"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Minimum Price ($)
            </label>
            <input
              id="modal-min-price"
              type="number"
              value={priceModalMin}
              onChange={(e) => setPriceModalMin(e.target.value)}
              placeholder="e.g., 500"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="modal-max-price"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Maximum Price ($)
            </label>
            <input
              id="modal-max-price"
              type="number"
              value={priceModalMax}
              onChange={(e) => setPriceModalMax(e.target.value)}
              placeholder="e.g., 2000"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>
      </FilterModal>
    </>
  );
}
