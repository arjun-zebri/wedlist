import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Check, Star, Users, TrendingUp, Shield, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "List Your MC Services | WedList - Sydney Wedding MC Directory",
  description:
    "Join WedList and connect with couples planning their Sydney weddings. Showcase your MC services to thousands of engaged couples.",
};

export default function ListWithUsPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Grow Your Wedding MC Business
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Join Sydney's premier directory of wedding MCs and connect with
              couples actively searching for professional masters of ceremony.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href="#pricing"
                className="rounded-md bg-gray-900 px-8 py-4 text-base font-medium text-white shadow-sm hover:bg-gray-800"
              >
                See Pricing
              </a>
              <a
                href="#features"
                className="rounded-md border border-gray-300 bg-white px-8 py-4 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-50"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="features" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Why List With WedList?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Everything you need to attract more wedding clients
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-900">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  Targeted Audience
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Connect with engaged couples actively searching for wedding
                  MCs in Sydney. No wasted exposure.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-900">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  Showcase Your Work
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Display your packages, videos, photos, and reviews all in one
                  professional profile.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-900">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  SEO Optimized
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Benefit from our strong Google rankings for "wedding MC
                  Sydney" and related searches.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-900">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  Verified Listings
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  All MCs are verified, giving couples confidence when choosing
                  their wedding host.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-900">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  Direct Inquiries
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Receive inquiries directly via email and phone. No middleman,
                  no commissions.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-900">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  Easy Management
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Simple profile management. Update your packages, photos, and
                  availability anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Your Profile Includes
              </h2>
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-6">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Complete Profile Page
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Dedicated page with your bio, contact details, and service
                    area
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-6">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Package Listings
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Display multiple packages with pricing, duration, and
                    inclusions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-6">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Photo & Video Gallery
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Showcase your work with unlimited photos and YouTube/Vimeo
                    video embeds
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-6">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Client Reviews
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Display your top Google reviews with link to see all reviews
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-6">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Direct Contact Form
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Couples can contact you directly. Inquiries sent to your
                    email instantly
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-6">
                <Check className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Search & Filter Visibility
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Appear in search results and filters (price, language,
                    availability)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                No commissions. No hidden fees. Just great value.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Basic */}
              <div className="rounded-lg border-2 border-gray-200 bg-white p-8">
                <h3 className="text-2xl font-bold text-gray-900">Basic</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Perfect for getting started
                </p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Complete profile page
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Up to 3 packages
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      10 photos + 2 videos
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Reviews display
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Direct inquiries
                    </span>
                  </li>
                </ul>
                <a
                  href="mailto:hello@wedlist.com.au?subject=Basic Listing Inquiry"
                  className="mt-8 block w-full rounded-md border border-gray-900 bg-white px-4 py-3 text-center text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  Get Started
                </a>
              </div>

              {/* Professional (Popular) */}
              <div className="relative rounded-lg border-2 border-gray-900 bg-white p-8 shadow-lg">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-gray-900 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Professional
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Best value for most MCs
                </p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">$149</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Everything in Basic
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Unlimited packages
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Unlimited photos & videos
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Featured badge
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Priority support
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Analytics dashboard
                    </span>
                  </li>
                </ul>
                <a
                  href="mailto:hello@wedlist.com.au?subject=Professional Listing Inquiry"
                  className="mt-8 block w-full rounded-md bg-gray-900 px-4 py-3 text-center text-sm font-medium text-white hover:bg-gray-800"
                >
                  Get Started
                </a>
              </div>

              {/* Premium */}
              <div className="rounded-lg border-2 border-gray-200 bg-white p-8">
                <h3 className="text-2xl font-bold text-gray-900">Premium</h3>
                <p className="mt-2 text-sm text-gray-600">Maximum visibility</p>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-gray-900">$249</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Everything in Professional
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Homepage feature spot
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Top of search results
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Blog feature article
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Social media promotion
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Dedicated account manager
                    </span>
                  </li>
                </ul>
                <a
                  href="mailto:hello@wedlist.com.au?subject=Premium Listing Inquiry"
                  className="mt-8 block w-full rounded-md border border-gray-900 bg-white px-4 py-3 text-center text-sm font-medium text-gray-900 hover:bg-gray-50"
                >
                  Get Started
                </a>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              All plans include a 30-day money-back guarantee. Cancel anytime.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Get listed in 3 simple steps
              </p>
            </div>

            <div className="mt-12 space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-xl font-bold text-white">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Choose Your Plan
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Select the plan that best fits your business needs. You can
                    upgrade or downgrade anytime.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-xl font-bold text-white">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Create Your Profile
                  </h3>
                  <p className="mt-2 text-gray-600">
                    We'll help you set up your profile with your packages,
                    photos, videos, and reviews. Takes about 30 minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-xl font-bold text-white">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Start Receiving Inquiries
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Once live, couples will find your profile and send you
                    direct inquiries. No commissions, no middleman.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to Grow Your Business?
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Join Sydney's leading wedding MC directory today
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hello@wedlist.com.au?subject=Listing Inquiry"
                className="inline-flex items-center rounded-md bg-white px-8 py-4 text-base font-medium text-gray-900 hover:bg-gray-100"
              >
                Get Started Today
              </a>
              <a
                href="mailto:hello@wedlist.com.au?subject=Question About Listing"
                className="inline-flex items-center text-base font-medium text-white hover:text-gray-300"
              >
                Have questions? Contact us →
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
