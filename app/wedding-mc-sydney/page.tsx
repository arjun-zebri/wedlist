import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MCCard from "@/components/MCCard";
import MCFilterBar from "@/components/MCFilterBar";
import { MCProfileWithRelations } from "@/types/database";
import { DirectoryStats } from "@/types/filters";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, CheckCircle, Star, Clock, DollarSign, Search } from "lucide-react";
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
}) {
  const supabase = await createClient();
  const sortBy = searchParams.sort || "featured";

  let query = supabase.from("mc_profiles").select(
    `
      *,
      photos:mc_photos(*),
      videos:mc_videos(*),
      packages:mc_packages(*),
      additional_info:mc_additional_info(*),
      reviews:google_reviews(*)
    `
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

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching MCs:", error);
    return [];
  }

  let mcs = data as MCProfileWithRelations[];

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

  return mcs;
}

export default async function WeddingMCSydney({
  searchParams,
}: {
  searchParams: {
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    language?: string;
    sort?: string;
  };
}) {
  const [mcs, stats] = await Promise.all([
    getMCs(searchParams),
    getDirectoryStats(),
  ]);

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
        {/* Hero Section - Empathy-Driven */}
        <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl text-balance">
              Find Your Perfect Wedding MC in Sydney. Compare Prices in Minutes.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Compare {stats.totalMCs}+ verified MCs with transparent pricing,
              verified Google reviews, and guaranteed responses within 4 hours.
            </p>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-gray-700">
              {stats.totalMCs > 0 && (
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  {stats.totalMCs}+ Verified MCs
                </span>
              )}
              {stats.avgRating > 0 && (
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {stats.avgRating.toFixed(1)} Avg Rating
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gray-900" />
                4-Hour Responses
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#filters"
                className="rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Start Browsing
                <ArrowRight className="ml-2 inline-block h-4 w-4" />
              </a>
              <a
                href="#how-it-works"
                className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                How It Works
              </a>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Book your wedding MC in 3 steps
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  step: 1,
                  title: "Filter & Sort",
                  description:
                    "Use filters to narrow by price, language, and rating. Sort by featured, price, or newest.",
                },
                {
                  step: 2,
                  title: "Compare Profiles",
                  description:
                    "See exact pricing, verified Google reviews, and video samples from each MC.",
                },
                {
                  step: 3,
                  title: "Send Inquiry",
                  description:
                    "Contact MCs directly and expect responses within 4 hours.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-lg font-semibold text-white">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filter Bar & Results Section */}
        <MCFilterBar />

        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {mcs.length} {mcs.length === 1 ? "MC" : "MCs"} found
              </p>
            </div>

            {mcs.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center max-w-2xl mx-auto">
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
                  className="inline-block rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  Clear all filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {mcs.map((mc) => (
                  <MCCard key={mc.id} mc={mc} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SEO Content Section - Card Grid */}
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Everything You Need to Know About Wedding MCs in Sydney
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {[
                {
                  title: "Why Choose a Professional MC",
                  description:
                    "A professional MC ensures your Sydney wedding runs smoothly from start to finish. They welcome guests, introduce speeches, coordinate timing with vendors, manage unexpected situations, and keep energy high throughout your reception.",
                  icon: CheckCircle,
                },
                {
                  title: "What Does a Wedding MC Do",
                  description:
                    "Professional MCs provide hosting services including welcoming guests, introducing the bridal party, announcing speeches, coordinating with vendors, and managing the timeline. They're experienced in keeping celebrations flowing seamlessly.",
                  icon: Star,
                },
                {
                  title: "How Much Does a Wedding MC Cost",
                  description:
                    "Sydney wedding MC prices typically range from $800 to $2,500 depending on experience and package inclusions. Most MCs offer packages with pre-wedding consultations, reception hosting, and vendor coordination.",
                  icon: DollarSign,
                  cta: {
                    text: "Browse prices",
                    href: "#filters",
                  },
                },
                {
                  title: "Finding the Right MC for Your Wedding",
                  description:
                    "Consider their experience with your wedding style, personality, language capabilities, and Google reviews from other Sydney couples. Many MCs offer free consultations to ensure compatibility.",
                  icon: Search,
                  cta: {
                    text: "Start browsing",
                    href: "#filters",
                  },
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {card.description}
                    </p>
                    {card.cta && (
                      <a
                        href={card.cta.href}
                        className="inline-text text-sm font-medium text-gray-900 hover:text-gray-700 underline"
                      >
                        {card.cta.text}
                        <ArrowRight className="ml-1 inline-block h-4 w-4" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="mt-12 text-center">
              <Link
                href="#filters"
                className="inline-block rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Browse All Sydney Wedding MCs
                <ArrowRight className="ml-2 inline-block h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
