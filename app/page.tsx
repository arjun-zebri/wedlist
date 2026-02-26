import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MCCard from "@/components/MCCard";
import FAQAccordion from "@/components/FAQAccordion";
import HowItWorks from "@/components/HowItWorks";
import ReviewCarousel from "@/components/ReviewCarousel";
import BeforeAfterComparison from "@/components/BeforeAfterComparison";
import { MCProfileWithRelations } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Page-level SEO metadata (overrides layout defaults)
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "Find Your Perfect Wedding MC in Sydney | WedList",
  description:
    "Discover verified wedding MCs in Sydney with real prices, genuine reviews, and 4-hour response guarantees. Book the perfect MC for your celebration.",
};

// ---------------------------------------------------------------------------
// Data-fetching helpers (all run in parallel via Promise.all)
// ---------------------------------------------------------------------------

async function getFeaturedMCs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mc_profiles")
    .select(
      `
      *,
      photos:mc_photos(*),
      videos:mc_videos(*),
      packages:mc_packages(*),
      additional_info:mc_additional_info(*),
      reviews:google_reviews(*)
    `
    )
    .eq("featured", true)
    .limit(3);

  if (error) {
    console.error("Error fetching featured MCs:", error);
    return [];
  }

  return data as MCProfileWithRelations[];
}

async function getRecentReviews() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("google_reviews")
    .select("*, mc:mc_profiles(name, slug)")
    .gte("rating", 4)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data as Array<{
    id: string;
    reviewer_name: string;
    rating: number;
    review_text: string | null;
    review_date: string | null;
    mc: { name: string; slug: string } | null;
  }>;
}

async function getAggregateStats() {
  const supabase = await createClient();

  const [mcResult, reviewResult] = await Promise.all([
    supabase.from("mc_profiles").select("id", { count: "exact", head: true }),
    supabase.from("google_reviews").select("rating"),
  ]);

  const mcCount = mcResult.count ?? 0;
  const reviews = reviewResult.data ?? [];
  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  return { mcCount, reviewCount, avgRating };
}

async function getPopularPackages() {
  const supabase = await createClient();

  // Fetch popular packages with their MC info
  const { data: popular, error: popError } = await supabase
    .from("mc_packages")
    .select("*, mc:mc_profiles(name, slug)")
    .eq("popular", true)
    .limit(3);

  if (popError) {
    console.error("Error fetching popular packages:", popError);
  }

  // Fetch min/max price across all packages
  const { data: allPkgs, error: priceErr } = await supabase
    .from("mc_packages")
    .select("price");

  if (priceErr) {
    console.error("Error fetching price range:", priceErr);
  }

  const prices = (allPkgs ?? []).map((p) => p.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  return {
    packages: (popular ?? []) as Array<{
      id: string;
      name: string;
      price: number;
      duration: string | null;
      inclusions: string[];
      mc: { name: string; slug: string } | null;
    }>,
    minPrice,
    maxPrice,
  };
}

// ---------------------------------------------------------------------------
// FAQ content
// ---------------------------------------------------------------------------

const faqItems = [
  {
    question: "What does a wedding MC actually do?",
    answer:
      "A wedding MC (Master of Ceremonies) hosts your reception — they introduce speeches, coordinate the timeline with your vendors, keep energy levels high, and make sure everything runs smoothly so you can relax and enjoy your night. Think of them as the glue between your DJ, photographer, caterer, and guests.",
  },
  {
    question: "How much does a wedding MC cost in Sydney?",
    answer:
      "Sydney wedding MC prices typically range from $500 to $2,500 depending on experience, package inclusions, and event duration. On WedList, every MC lists their exact packages and prices upfront so you can compare without needing to request quotes.",
  },
  {
    question: "How far in advance should I book a wedding MC?",
    answer:
      "Most couples book their MC 6 to 12 months before the wedding. Popular dates (especially Saturdays in spring and autumn) book out quickly, so the earlier you start looking, the more options you'll have.",
  },
  {
    question: "What's the difference between a wedding MC and a DJ?",
    answer:
      "A DJ focuses on music and sound, while an MC focuses on hosting — introductions, speeches, timeline management, and guest engagement. Some MCs also DJ (and vice versa), but they're distinct roles. Many couples hire both for the best experience.",
  },
  {
    question: "Can I see an MC perform before booking?",
    answer:
      "Many MCs on WedList have video samples on their profiles so you can see their hosting style. You can also read verified Google reviews from real couples. If you want to meet in person, most MCs offer a free consultation call or meeting.",
  },
  {
    question: "What happens if I need to cancel or change my booking?",
    answer:
      "Cancellation policies vary by MC — each MC on WedList lists their cancellation and deposit terms on their profile. We recommend reviewing these before booking. Most MCs require a deposit to secure your date, with the balance due closer to the event.",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function Home() {
  const [featuredMCs, reviews, stats, popularData] = await Promise.all([
    getFeaturedMCs(),
    getRecentReviews(),
    getAggregateStats(),
    getPopularPackages(),
  ]);

  // Schema.org structured data
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WedList",
    url: "https://wedlist.com.au",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://wedlist.com.au/wedding-mc-sydney?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const itemListSchema =
    featuredMCs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: featuredMCs.map((mc, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://wedlist.com.au/mc/${mc.slug}`,
            name: mc.name,
          })),
        }
      : null;

  return (
    <>
      <Header />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}

      {/* Dynamic magical background wrapper */}
      <div className="relative min-h-screen bg-gradient-to-br from-white via-white to-rose-50/30" style={{ overflow: 'clip' }}>
        {/* Animated background orbs - magical floating effect */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#E31C5F]/15 to-pink-200/10 rounded-full filter blur-3xl opacity-70 animate-drift-slow"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-100/12 to-blue-100/8 rounded-full filter blur-3xl opacity-50 animate-float animation-delay-2000"></div>
        <div
          className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-t from-rose-100/15 via-amber-100/5 to-transparent rounded-full filter blur-3xl opacity-60 animate-drift-slow"
          style={{ animationDuration: "24s" }}
        ></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-100/8 to-blue-100/5 rounded-full filter blur-3xl opacity-40"></div>

        <main>
          {/* ================================================================
            1. HERO + PROBLEM — Unified, Compelling, Minimal
        ================================================================ */}
          <section className="relative bg-white/80 backdrop-blur-sm overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
            {/* Subtle background accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-50 rounded-full filter blur-3xl -translate-y-1/2"></div>

            <div className="mx-auto max-w-7xl relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left: Text content */}
                <div>
                  {/* Minimal badge */}
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E31C5F]"></div>
                    <span className="text-xs font-semibold text-gray-700">
                      Sydney Wedding MCs
                    </span>
                  </div>

                  {/* Clean headline */}
                  <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 font-display leading-tight mb-6">
                    Book your perfect MC in minutes
                  </h1>

                  {/* Subheading */}
                  <p className="text-lg text-gray-600 mb-10">
                    {stats.mcCount}+ verified professionals.{" "}
                    {stats.avgRating.toFixed(1)} ⭐ average. Responses in 4
                    hours or less.
                  </p>

                  {/* Simple CTA */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/wedding-mc-sydney"
                      className="group px-8 py-3 bg-[#E31C5F] text-white rounded-lg font-medium hover:bg-[#C4184F] transition-colors"
                    >
                      Browse MCs
                      <ArrowRight className="ml-2 inline-block h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <a
                      href="#how-it-works"
                      className="px-8 py-3 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      How it works
                    </a>
                  </div>
                </div>

                {/* Right: Hero + Problem Image */}
                <div className="hidden lg:block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E31C5F]/20 to-pink-200/20 rounded-2xl blur-xl"></div>
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl aspect-square flex items-center justify-center border border-gray-200 overflow-hidden">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📸</div>
                        <p className="text-gray-500 font-medium">
                          Happy couple at wedding
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          Joyful moment with MC
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Problem section - Before/After comparison */}
          <section className="relative bg-white/80 backdrop-blur-sm px-4 py-20 sm:px-6 lg:px-8">
            <BeforeAfterComparison />
          </section>

          {/* ================================================================
            3. HOW IT WORKS — Sequential Card Reveal with Connecting Line
        ================================================================ */}
          <section
            id="how-it-works"
            className="relative bg-white/80 backdrop-blur-sm"
          >
            <HowItWorks />
          </section>

          {/* How It Works CTA */}
          <div className="bg-white/80 backdrop-blur-sm px-4 pb-20 sm:px-6 lg:px-8">
            <div className="text-center max-w-7xl mx-auto">
              <p className="text-gray-600 mb-6">
                Ready to find your MC? Start browsing our verified
                professionals today.
              </p>
              <Link
                href="/wedding-mc-sydney"
                className="group inline-flex items-center px-8 py-3 bg-[#E31C5F] text-white rounded-lg font-medium hover:bg-[#C4184F] transition-colors duration-200"
              >
                Browse MCs
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ================================================================
            4. PRICING TRANSPARENCY — Integrated, Clear, No Games
        ================================================================ */}
          {popularData.minPrice !== null && popularData.maxPrice !== null && (
            <section className="bg-white/80 backdrop-blur-sm px-4 py-12 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-rose-50/50 to-transparent p-8 sm:p-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                    <div>
                      <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        Transparent Pricing
                      </p>
                      <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display mb-3">
                        No hidden fees
                      </h3>
                      <p className="text-gray-600">
                        Every MC on WedList shows their real pricing upfront. No
                        "contact for quote." No surprises at the end.
                      </p>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="text-sm text-gray-600 mb-2">
                        Sydney MC Pricing Range
                      </p>
                      <div className="flex items-baseline justify-center sm:justify-end gap-2">
                        <span className="text-4xl sm:text-5xl font-bold text-[#E31C5F]">
                          {formatPrice(popularData.minPrice)}
                        </span>
                        <span className="text-gray-500">to</span>
                        <span className="text-4xl sm:text-5xl font-bold text-[#E31C5F]">
                          {formatPrice(popularData.maxPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================================================================
            5. FEATURED MCs — Real Talent, Real Couples, Real Reviews
        ================================================================ */}
          {featuredMCs.length > 0 && (
            <section className="bg-white/80 backdrop-blur-sm px-4 py-12 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-7xl">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold tracking-tight text-gray-900 font-display sm:text-5xl">
                    Featured Sydney MCs
                  </h2>
                  <p className="mt-6 text-lg text-gray-600">
                    Verified professionals loved by couples. Real prices. Real
                    reviews.
                  </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {featuredMCs.map((mc) => (
                    <MCCard key={mc.id} mc={mc} />
                  ))}
                </div>

                <div className="mt-16 text-center">
                  <Link
                    href="/wedding-mc-sydney"
                    className="group inline-flex items-center px-8 py-3 bg-[#E31C5F] text-white rounded-lg font-medium hover:bg-[#C4184F] transition-colors"
                  >
                    View All Sydney MCs
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* ================================================================
            6. REAL COUPLES — Superpower-Style Testimonials
        ================================================================ */}
          <section className="relative bg-white/80 backdrop-blur-sm px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
            <div className="mx-auto max-w-7xl relative z-10">
              <div className="text-center mb-20">
                <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 font-display mb-6">
                  Real couples. Real weddings.
                </h2>
                <p className="text-xl text-gray-600">
                  Verified Google reviews from Sydney couples who found their
                  perfect MC
                </p>
              </div>

              {/* Reviews Grid - Superpower Style */}
              <ReviewCarousel reviews={reviews} />
            </div>
          </section>

          {/* ================================================================
            7. FAQ — Common Questions Answered
        ================================================================ */}
          <section className="bg-white/80 backdrop-blur-sm px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 font-display sm:text-5xl">
                  Questions about wedding MCs?
                </h2>
                <p className="mt-6 text-lg text-gray-600">
                  We've got answers. Below are the things couples most often ask
                  us.
                </p>
              </div>

              <div className="mt-12 max-w-3xl mx-auto">
                <FAQAccordion items={faqItems} />
              </div>
            </div>
          </section>

          {/* ================================================================
            8. FINAL CTA — Simple, Clear, Inviting
        ================================================================ */}
          <section className="relative bg-white/80 backdrop-blur-sm px-4 py-20 sm:px-6 lg:px-8 overflow-hidden">
            <div className="relative mx-auto max-w-7xl z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Text content */}
                <div className="text-center lg:text-left">
                  {/* Small badge */}
                  <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E31C5F]"></div>
                    <span className="text-xs font-semibold text-gray-700">
                      Ready to find your MC?
                    </span>
                  </div>

                  {/* Heading */}
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 font-display mb-6">
                    Browse verified MCs in Sydney
                  </h2>

                  {/* Subheading */}
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
                    Real photos. Real reviews. Real prices. Real response times.
                    Everything you need to book with confidence.
                  </p>

                  {/* CTA button */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/wedding-mc-sydney"
                      className="group px-8 py-3 bg-[#E31C5F] text-white rounded-lg font-medium hover:bg-[#C4184F] transition-colors"
                    >
                      Start Browsing
                      <ArrowRight className="ml-2 inline-block h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <a
                      href="#how-it-works"
                      className="px-8 py-3 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      How It Works
                    </a>
                  </div>

                  {/* Trust line */}
                  <p className="mt-8 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">
                      100% free to browse
                    </span>{" "}
                    • No account needed • Book only when ready
                  </p>
                </div>

                {/* Right: Celebration image placeholder */}
                <div className="hidden lg:block">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl aspect-video flex items-center justify-center border border-gray-200 overflow-hidden">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎉</div>
                      <p className="text-gray-500 font-medium">
                        Newlyweds celebrating
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Perfect MC helped make it special
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
