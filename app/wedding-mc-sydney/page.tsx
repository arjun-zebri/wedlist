import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MCCard from "@/components/MCCard";
import MCFilters from "@/components/MCFilters";
import { MCProfileWithRelations } from "@/types/database";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Wedding MCs in Sydney | Find Your Perfect Master of Ceremonies",
  description:
    "Browse Sydney's best wedding MCs. Compare prices, read reviews, and book professional masters of ceremony for your special day. Expert hosts for weddings of all styles.",
  keywords: [
    "wedding MC Sydney",
    "master of ceremonies Sydney",
    "wedding emcee Sydney",
    "professional wedding MC",
    "Sydney wedding hosts",
  ],
  openGraph: {
    title: "Wedding MCs in Sydney | Professional Masters of Ceremony",
    description:
      "Find the perfect wedding MC in Sydney. Browse profiles, compare packages, and book today.",
  },
};

async function getMCs(searchParams: {
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  language?: string;
}) {
  const supabase = await createClient();
  let query = supabase
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
    .order("featured", { ascending: false })
    .order("name");

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
  };
}) {
  const mcs = await getMCs(searchParams);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Wedding MCs in Sydney
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Find and book Sydney's top professional masters of ceremony for
                your wedding day
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <MCFilters />
                </div>
              </div>

              {/* MC Grid */}
              <div className="lg:col-span-3">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {mcs.length} {mcs.length === 1 ? "MC" : "MCs"} found
                  </p>
                </div>

                {mcs.length === 0 ? (
                  <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                    <p className="text-lg font-medium text-gray-900">
                      No MCs found
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      Try adjusting your filters or search criteria
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {mcs.map((mc) => (
                      <MCCard key={mc.id} mc={mc} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl prose prose-gray">
            <h2>Why Choose a Professional Wedding MC in Sydney?</h2>
            <p>
              A professional wedding MC (master of ceremonies) is essential for
              ensuring your Sydney wedding runs smoothly from start to finish.
              They act as the host and coordinator for your reception, keeping
              guests entertained, managing the timeline, and ensuring all key
              moments happen at the right time.
            </p>

            <h3>What Does a Wedding MC Do?</h3>
            <p>
              Professional wedding MCs in Sydney provide comprehensive hosting
              services including welcoming guests, introducing the bridal party,
              announcing speeches and formalities, coordinating with vendors,
              and keeping the energy high throughout your reception. They're
              experienced in handling unexpected situations and ensuring your
              celebration flows seamlessly.
            </p>

            <h3>How Much Does a Wedding MC Cost in Sydney?</h3>
            <p>
              Wedding MC prices in Sydney typically range from $800 to $2,500
              depending on experience, package inclusions, and the length of
              service. Most MCs offer packages that include pre-wedding
              consultations, ceremony and reception hosting, microphone and
              sound equipment coordination, and assistance with running order
              planning.
            </p>

            <h3>Finding the Right MC for Your Sydney Wedding</h3>
            <p>
              When choosing a wedding MC in Sydney, consider their experience
              with your wedding style (formal, casual, cultural celebrations),
              their personality and energy level, language capabilities, and
              reviews from other Sydney couples. Many MCs offer virtual
              consultations to ensure you're comfortable with their hosting
              style before booking.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
