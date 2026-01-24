import Link from "next/link";
import { ArrowRight, Search, Star, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MCCard from "@/components/MCCard";
import { MCProfileWithRelations } from "@/types/database";
import { createClient } from "@/lib/supabase/server";

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

export default async function Home() {
  const featuredMCs = await getFeaturedMCs();

  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Find Your Perfect Wedding MC in Sydney
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Browse Sydney's top professional masters of ceremony. Compare
              packages, read reviews, and book the ideal MC to make your special
              day unforgettable.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/wedding-mc-sydney"
                className="rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Browse All MCs
                <ArrowRight className="ml-2 inline-block h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Get Help Choosing
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Finding your perfect wedding MC is easy
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-900">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  Browse & Filter
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Search through our curated list of professional wedding MCs.
                  Filter by price, style, and availability.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-900">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  Compare & Review
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  View detailed profiles, packages, and real Google reviews from
                  couples who've worked with them.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-900">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  Book with Confidence
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Contact your chosen MC directly through our platform. Get
                  quick responses and secure your date.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured MCs */}
        {featuredMCs.length > 0 && (
          <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Featured Wedding MCs
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Handpicked professionals loved by Sydney couples
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
                  className="inline-flex items-center text-base font-medium text-gray-900 hover:text-gray-700"
                >
                  View all MCs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to Find Your Wedding MC?
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Browse our directory of professional masters of ceremony and find
              the perfect match for your special day.
            </p>
            <div className="mt-8">
              <Link
                href="/wedding-mc-sydney"
                className="inline-flex items-center rounded-md bg-white px-6 py-3 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
