import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, Star, Clock, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MCCard from "@/components/MCCard";
import FAQAccordion from "@/components/FAQAccordion";
import { MCProfileWithRelations } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Page-level SEO metadata (overrides layout defaults)
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: "Wedding MC Sydney | Compare Prices & Book Today | WedList",
  description:
    "Compare Sydney wedding MC prices, read verified Google reviews, and get responses within 4 hours. WedList makes finding and booking your wedding MC simple and transparent.",
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

      <main>
        {/* ================================================================
            1. HERO — Empathy-Led Value Proposition
        ================================================================ */}
        <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl text-balance">
              Planning a wedding is stressful enough. Finding your MC shouldn&apos;t be.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Compare Sydney wedding MCs with transparent pricing, verified
              Google reviews, and guaranteed responses within 4 hours.
            </p>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-gray-700">
              {stats.mcCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  {stats.mcCount}+ Verified MCs
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
              <Link
                href="/wedding-mc-sydney"
                className="rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Browse Wedding MCs
                <ArrowRight className="ml-2 inline-block h-4 w-4" />
              </Link>
              <a
                href="#pricing"
                className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                See Pricing
              </a>
            </div>
          </div>
        </section>

        {/* ================================================================
            2. PAIN POINTS — Why Couples Choose WedList
        ================================================================ */}
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                We built WedList because finding a wedding MC was harder than it should be
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  problem: "Slow replies from vendors",
                  solution: "Every MC responds within 4 hours",
                },
                {
                  problem: "Hidden costs and 'contact for quote'",
                  solution: "All prices listed upfront, no surprises",
                },
                {
                  problem: "Fake or unverified reviews",
                  solution: "Only verified Google reviews, linked to source",
                },
                {
                  problem: "No easy way to compare",
                  solution: "Compare MCs, packages, and prices side-by-side",
                },
              ].map((item) => (
                <div
                  key={item.solution}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-6"
                >
                  <p className="text-sm text-gray-400 line-through">
                    {item.problem}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    {item.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            3. HOW IT WORKS — 3 Steps
        ================================================================ */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Book your wedding MC in 3 steps
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Browse & Compare",
                  description:
                    "Explore MC profiles with real photos, packages, pricing, and verified reviews — all in one place.",
                },
                {
                  step: "2",
                  title: "Send an Inquiry",
                  description:
                    "Found someone you like? Send them a message directly through their profile. No account needed.",
                },
                {
                  step: "3",
                  title: "Get a Fast Response",
                  description:
                    "Every MC on WedList commits to responding within 4 hours. No more chasing vendors.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-lg font-bold text-white">
                    {item.step}
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-10 text-center text-sm text-gray-500">
              No account needed. No commitment until you&apos;re ready.
            </p>
          </div>
        </section>

        {/* ================================================================
            4. PRICING TRANSPARENCY
        ================================================================ */}
        <section id="pricing" className="scroll-mt-20 bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Wedding MC Pricing in Sydney
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Every MC on WedList lists their exact packages and prices. No
                &quot;contact for quote&quot; games.
              </p>
              {popularData.minPrice !== null && popularData.maxPrice !== null && (
                <p className="mt-2 text-sm text-gray-500">
                  Prices on WedList start from{" "}
                  <span className="font-semibold text-gray-900">
                    {formatPrice(popularData.minPrice)}
                  </span>{" "}
                  and go up to{" "}
                  <span className="font-semibold text-gray-900">
                    {formatPrice(popularData.maxPrice)}
                  </span>
                </p>
              )}
            </div>

            {popularData.packages.length > 0 ? (
              <>
                <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                  {popularData.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="rounded-xl border border-gray-200 bg-white p-6"
                    >
                      <p className="text-sm font-medium text-gray-500">
                        {pkg.mc ? (
                          <Link
                            href={`/mc/${pkg.mc.slug}`}
                            className="hover:text-gray-900 transition-colors"
                          >
                            {pkg.mc.name}
                          </Link>
                        ) : (
                          "MC"
                        )}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-gray-900">
                        {pkg.name}
                      </h3>
                      <p className="mt-2 text-2xl font-bold text-gray-900">
                        {formatPrice(pkg.price)}
                      </p>
                      {pkg.duration && (
                        <p className="mt-1 text-sm text-gray-500">
                          {pkg.duration}
                        </p>
                      )}
                      {pkg.inclusions.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {pkg.inclusions.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-gray-600"
                            >
                              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                      {pkg.mc && (
                        <Link
                          href={`/mc/${pkg.mc.slug}`}
                          className="mt-6 inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
                        >
                          View full profile
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                <p className="mt-8 text-center text-sm text-gray-500">
                  These are real packages from real MCs. Browse all to find your
                  fit.
                </p>
              </>
            ) : (
              <p className="mt-8 text-center text-sm text-gray-500">
                Every MC on WedList shows their full pricing. No hidden fees, no
                &quot;starting from&quot; tricks — just honest prices you can compare.
              </p>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/wedding-mc-sydney"
                className="inline-flex items-center rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Browse All Wedding MCs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================
            5. FEATURED MCs (enhanced)
        ================================================================ */}
        {featuredMCs.length > 0 && (
          <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Sydney&apos;s Top-Rated Wedding MCs
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Vetted professionals with verified reviews and transparent
                  pricing.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredMCs.map((mc) => (
                  <MCCard key={mc.id} mc={mc} />
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link
                  href="/wedding-mc-sydney"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                  View All MCs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ================================================================
            6. SOCIAL PROOF — Real Reviews
        ================================================================ */}
        {reviews.length > 0 && (
          <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  What Sydney couples are saying
                </h2>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-gray-200 bg-white p-6"
                  >
                    {/* Star rating */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    {/* Review text */}
                    {review.review_text && (
                      <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-4">
                        &ldquo;{review.review_text}&rdquo;
                      </p>
                    )}

                    {/* Reviewer + MC link */}
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {review.reviewer_name}
                        </p>
                        {review.mc && (
                          <Link
                            href={`/mc/${review.mc.slug}`}
                            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            MC: {review.mc.name}
                          </Link>
                        )}
                      </div>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                        Verified Google Review
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================================================================
            7. FAQ — SEO Power Section
        ================================================================ */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Frequently asked questions about wedding MCs
              </h2>
            </div>

            <div className="mt-12">
              <FAQAccordion items={faqItems} />
            </div>
          </div>
        </section>

        {/* ================================================================
            8. FINAL CTA
        ================================================================ */}
        <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Your wedding MC is one click away
            </h2>
            <div className="mt-8">
              <Link
                href="/wedding-mc-sydney"
                className="inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Browse Wedding MCs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Free to use. No account needed. No obligation.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
