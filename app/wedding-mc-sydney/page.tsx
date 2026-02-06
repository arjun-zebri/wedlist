import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MCCard from "@/components/MCCard";
import MCFilterBar from "@/components/MCFilterBar";
import Pagination from "@/components/Pagination";
import { MCProfileWithRelations } from "@/types/database";
import { DirectoryStats } from "@/types/filters";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, CheckCircle, Star, Clock, Search } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sydney Wedding MCs | Compare 50+ Masters of Ceremony | WedList",
  description:
    "Compare Sydney wedding MC prices ($800-$2,500), read verified Google reviews, and get responses within 4 hours. WedList makes finding and booking your wedding MC simple and transparent.",
  keywords: [
    "wedding MC Sydney",
    "master of ceremonies Sydney",
    "wedding emcee Sydney",
    "professional wedding MC",
    "Sydney wedding hosts",
  ],
  openGraph: {
    title: "Sydney Wedding MCs | Compare Prices & Book Today | WedList",
    description:
      "Find the perfect wedding MC in Sydney. Compare verified MCs with transparent pricing and guaranteed 4-hour responses.",
  },
};

async function getDirectoryStats(): Promise<DirectoryStats> {
  const supabase = await createClient();

  const [mcResult, reviewResult] = await Promise.all([
    supabase.from("mc_profiles").select("id", { count: "exact", head: true }),
    supabase.from("google_reviews").select("rating"),
  ]);

  const totalMCs = mcResult.count ?? 0;
  const reviews = reviewResult.data ?? [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return { totalMCs, avgRating, reviewCount: reviews.length };
}

async function getMCs(searchParams: {
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  language?: string;
  sort?: string;
  page?: string;
}) {
  const supabase = await createClient();
  const sortBy = searchParams.sort || "featured";
  const page = parseInt(searchParams.page || "1");
  const perPage = 20;
  const offset = (page - 1) * perPage;

  let query = supabase.from("mc_profiles").select(
    `
      *,
      photos:mc_photos(*),
      videos:mc_videos(*),
      packages:mc_packages(*),
      additional_info:mc_additional_info(*),
      reviews:google_reviews(*)
    `,
    { count: "exact" }
  );

  // Database-level sorting
  if (sortBy === "featured" || sortBy === "") {
    query = query.order("featured", { ascending: false }).order("name");
  } else if (sortBy === "name") {
    query = query.order("name", { ascending: true });
  } else if (sortBy === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    // Default to featured for other sorts (will be done client-side)
    query = query.order("featured", { ascending: false }).order("name");
  }

  // Apply search filter
  if (searchParams.search) {
    query = query.ilike("name", `%${searchParams.search}%`);
  }

  // Apply language filter
  if (searchParams.language) {
    query = query.contains("languages", [searchParams.language]);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching MCs:", error);
    return {
      mcs: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
    };
  }

  let mcs = data as MCProfileWithRelations[];
  const totalCount = count || 0;

  // Apply price filtering (client-side since it involves related packages)
  if (searchParams.minPrice || searchParams.maxPrice) {
    const minPrice = searchParams.minPrice
      ? parseFloat(searchParams.minPrice)
      : 0;
    const maxPrice = searchParams.maxPrice
      ? parseFloat(searchParams.maxPrice)
      : Infinity;

    mcs = mcs.filter((mc) => {
      if (!mc.packages || mc.packages.length === 0) return false;
      const mcMinPrice = Math.min(...mc.packages.map((pkg) => pkg.price));
      return mcMinPrice >= minPrice && mcMinPrice <= maxPrice;
    });
  }

  // Client-side sorting for complex operations
  if (sortBy === "price-low") {
    mcs.sort((a, b) => {
      const aMin = a.packages?.length
        ? Math.min(...a.packages.map((p) => p.price))
        : Infinity;
      const bMin = b.packages?.length
        ? Math.min(...b.packages.map((p) => p.price))
        : Infinity;
      return aMin - bMin;
    });
  } else if (sortBy === "price-high") {
    mcs.sort((a, b) => {
      const aMax = a.packages?.length
        ? Math.max(...a.packages.map((p) => p.price))
        : -Infinity;
      const bMax = b.packages?.length
        ? Math.max(...b.packages.map((p) => p.price))
        : -Infinity;
      return bMax - aMax;
    });
  } else if (sortBy === "rating") {
    mcs.sort((a, b) => {
      const aRating =
        a.reviews && a.reviews.length > 0
          ? a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length
          : 0;
      const bRating =
        b.reviews && b.reviews.length > 0
          ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
          : 0;
      return bRating - aRating;
    });
  }

  // Calculate total pages based on filtered results
  const filteredCount = mcs.length;
  const totalPages = Math.ceil(filteredCount / perPage);

  // Apply pagination
  mcs = mcs.slice(offset, offset + perPage);

  return {
    mcs,
    totalCount: filteredCount,
    currentPage: page,
    totalPages,
  };
}

export default async function WeddingMCSydney({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    language?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const [result, stats] = await Promise.all([
    getMCs(params),
    getDirectoryStats(),
  ]);

  const { mcs, totalCount, currentPage, totalPages } = result;

  // Schema.org structured data
  const itemListSchema =
    mcs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: mcs.slice(0, 10).map((mc, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://wedlist.com.au/mc/${mc.slug}`,
            name: mc.name,
            ...(mc.reviews && mc.reviews.length > 0
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: (
                      mc.reviews.reduce((sum, r) => sum + r.rating, 0) /
                      mc.reviews.length
                    ).toFixed(1),
                    reviewCount: mc.reviews.length,
                  },
                }
              : {}),
            ...(mc.packages && mc.packages.length > 0
              ? {
                  offers: {
                    "@type": "AggregateOffer",
                    priceCurrency: "AUD",
                    lowPrice: Math.min(...mc.packages.map((p) => p.price)),
                    highPrice: Math.max(...mc.packages.map((p) => p.price)),
                  },
                }
              : {}),
          })),
        }
      : null;

  return (
    <>
      <Header />

      {/* Schema.org JSON-LD */}
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}

      <main className="min-h-screen bg-gray-50">
        {/* Filter Bar & Results Section */}
        <MCFilterBar />

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {totalCount} {totalCount === 1 ? "MC" : "MCs"} found
              </p>
            </div>

            {mcs.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center max-w-2xl mx-auto shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Search className="h-6 w-6 text-gray-600" />
                </div>
                <p className="text-lg font-medium text-gray-900">
                  No MCs found
                </p>
                <p className="mt-2 text-sm text-gray-600 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <Link
                  href="/wedding-mc-sydney"
                  className="inline-block rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  Clear all filters
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-8">
                  {mcs.map((mc) => (
                    <MCCard key={mc.id} mc={mc} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalResults={totalCount}
                  />
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
