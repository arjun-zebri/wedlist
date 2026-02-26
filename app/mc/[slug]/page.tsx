import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Globe,
  Phone,
  Mail,
  Languages,
  DollarSign,
  Star,
  PlayCircle,
  ChevronRight,
  Clock,
  Shield,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import Rating from "@/components/Rating";
import ImageGallery from "@/components/ImageGallery";
import ReviewsModalTrigger from "@/components/ReviewsModalTrigger";
import PackagesSection from "@/components/PackagesSection";
import { MCProfileWithRelations } from "@/types/database";
import { formatPrice, getYouTubeEmbedUrl, getVimeoEmbedUrl } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

async function getMCBySlug(
  slug: string,
): Promise<MCProfileWithRelations | null> {
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
    `,
    )
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data as MCProfileWithRelations;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const mc = await getMCBySlug(slug);

  if (!mc) {
    return {
      title: "MC Not Found",
    };
  }

  const averageRating =
    mc.reviews && mc.reviews.length > 0
      ? mc.reviews.reduce((acc, review) => acc + review.rating, 0) /
        mc.reviews.length
      : 0;

  return {
    title: `${mc.name} - Professional Wedding MC in Sydney | WedList`,
    description:
      mc.bio?.slice(0, 155) ||
      `Hire ${mc.name}, a highly-rated professional wedding MC in Sydney. ${
        averageRating > 0
          ? `Rated ${averageRating.toFixed(1)}/5 from ${
              mc.reviews!.length
            } reviews.`
          : ""
      } View packages, pricing, videos & availability.`,
    keywords: [
      "wedding mc sydney",
      "master of ceremonies sydney",
      mc.name,
      "wedding host sydney",
      "reception mc",
      ...(mc.languages || []).map((lang) => `${lang} wedding mc`),
    ],
    openGraph: {
      title: `${mc.name} - Wedding MC Sydney`,
      description:
        mc.bio?.slice(0, 155) ||
        `Professional wedding MC in Sydney ${
          averageRating > 0 ? `• ${averageRating.toFixed(1)}/5 stars` : ""
        }`,
      images: mc.profile_image ? [mc.profile_image] : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${mc.name} - Wedding MC Sydney`,
      description: mc.bio?.slice(0, 155) || `Professional wedding MC in Sydney`,
      images: mc.profile_image ? [mc.profile_image] : [],
    },
  };
}

export default async function MCProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const mc = await getMCBySlug(slug);

  if (!mc) {
    notFound();
  }

  const averageRating =
    mc.reviews && mc.reviews.length > 0
      ? mc.reviews.reduce((acc, review) => acc + review.rating, 0) /
        mc.reviews.length
      : 0;

  const sortedPhotos =
    mc.photos?.sort((a, b) => a.order_index - b.order_index) || [];
  const sortedVideos =
    mc.videos?.sort((a, b) => a.order_index - b.order_index) || [];
  const sortedPackages =
    mc.packages?.sort((a, b) => a.order_index - b.order_index) || [];
  const sortedReviews =
    mc.reviews?.sort((a, b) => a.order_index - b.order_index) || [];

  const minPrice =
    sortedPackages.length > 0
      ? Math.min(...sortedPackages.map((pkg) => pkg.price))
      : null;

  const mostRecentReviewDate =
    sortedReviews.length > 0 && sortedReviews[0].review_date
      ? new Date(sortedReviews[0].review_date).toLocaleDateString("en-AU", {
          month: "short",
          year: "numeric",
        })
      : null;

  return (
    <>
      <Header />

      <div
        className="relative min-h-screen bg-gradient-to-br from-white via-white to-rose-50/30"
        style={{ overflow: "clip" }}
      >
        {/* Subtle background orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#E31C5F]/8 to-pink-200/6 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-100/8 to-blue-100/4 rounded-full filter blur-3xl opacity-30"></div>

        <main>
          {/* Breadcrumb */}
          <div className="relative bg-white/80 backdrop-blur-sm border-b border-gray-100">
            <div className="container mx-auto max-w-[1400px] px-4 py-3.5 sm:px-6 lg:px-8">
              <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
                <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
                  Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                <Link
                  href="/wedding-mc-sydney"
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Wedding MCs
                </Link>
                <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-medium text-gray-900">{mc.name}</span>
              </nav>
            </div>
          </div>

          {/* Image Gallery */}
          <section className="relative bg-white/60 backdrop-blur-sm">
            <div className="container mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
              {sortedPhotos.length > 0 ? (
                <ImageGallery
                  photos={sortedPhotos}
                  mcName={mc.name}
                  featured={mc.featured}
                />
              ) : (
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 via-gray-50 to-gray-100">
                  {mc.profile_image ? (
                    <Image
                      src={mc.profile_image}
                      alt={mc.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="w-24 h-24 rounded-2xl bg-white shadow-[0_4px_16px_rgba(227,28,95,0.08)] flex items-center justify-center">
                        <span className="text-5xl font-bold text-[#E31C5F] font-display">
                          {mc.name[0]}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Profile Content */}
          <section className="relative bg-white/60 backdrop-blur-sm">
            <div className="container mx-auto max-w-[1400px] px-4 pb-20 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-12 lg:gap-16 lg:grid-cols-3">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2">
                  {/* Header */}
                  <div className="border-b border-gray-200 pb-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-display tracking-tight">
                          {mc.name}
                        </h1>
                        <p className="mt-2 text-base text-gray-600">
                          Professional Wedding MC in Sydney
                        </p>
                      </div>
                      {mostRecentReviewDate && (
                        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-xs font-medium text-gray-500">
                            Reviewed {mostRecentReviewDate}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info Pills */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      {averageRating > 0 && (
                        <div className="flex items-center gap-2 rounded-full bg-rose-50 border border-[#E31C5F]/10 px-3.5 py-2">
                          <Star className="h-4 w-4 fill-[#E31C5F] text-[#E31C5F]" />
                          <Rating
                            rating={averageRating}
                            count={mc.reviews?.length}
                            size="sm"
                            showStar={false}
                          />
                        </div>
                      )}

                      {mc.languages && mc.languages.length > 0 && (
                        <div className="flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 px-3.5 py-2 text-sm text-gray-700">
                          <Languages className="h-4 w-4 text-gray-500" />
                          <span>{mc.languages.join(", ")}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 px-3.5 py-2 text-sm text-gray-700">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>Sydney, NSW</span>
                      </div>

                      {minPrice && (
                        <div className="flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 px-3.5 py-2 text-sm text-gray-700">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span>From {formatPrice(minPrice)}</span>
                        </div>
                      )}

                      {mc.featured && (
                        <div className="flex items-center gap-2 rounded-full bg-[#E31C5F] px-3.5 py-2 text-sm text-white">
                          <Shield className="h-4 w-4" />
                          <span className="font-medium">Featured</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* About */}
                  {mc.bio && (
                    <div className="border-b border-gray-200 py-10">
                      <h2 className="text-2xl font-bold text-gray-900 font-display">About</h2>
                      <p className="mt-5 text-base leading-relaxed text-gray-700">
                        {mc.bio}
                      </p>
                    </div>
                  )}

                  {/* Packages */}
                  {sortedPackages.length > 0 && (
                    <PackagesSection packages={sortedPackages} />
                  )}

                  {/* Videos */}
                  {sortedVideos.length > 0 && (
                    <div className="border-b border-gray-200 py-10">
                      <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 font-display">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50">
                          <PlayCircle className="h-5 w-5 text-[#E31C5F]" />
                        </div>
                        Videos
                      </h2>
                      <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        {sortedVideos.map((video) => (
                          <div
                            key={video.id}
                            className="overflow-hidden rounded-2xl border border-gray-200 shadow-[0_2px_8px_rgba(227,28,95,0.04)] hover:shadow-[0_8px_24px_rgba(227,28,95,0.08)] transition-shadow duration-300"
                          >
                            <div className="relative aspect-video bg-gray-900">
                              <iframe
                                src={
                                  video.platform === "youtube"
                                    ? getYouTubeEmbedUrl(video.video_id)
                                    : getVimeoEmbedUrl(video.video_id)
                                }
                                title={video.title || `${mc.name} - Video`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="h-full w-full"
                              />
                            </div>
                            {video.title && (
                              <p className="px-5 py-3.5 text-sm font-medium text-gray-900">
                                {video.title}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reviews */}
                  {sortedReviews.length > 0 && (
                    <div className="py-10">
                      <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 font-display">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50">
                          <Star className="h-5 w-5 fill-[#E31C5F] text-[#E31C5F]" />
                        </div>
                        Reviews
                      </h2>

                      {/* Mobile - Horizontal scroll */}
                      <div className="mt-8 flex gap-4 overflow-x-auto pb-4 md:hidden">
                        {sortedReviews.slice(0, 5).map((review) => (
                          <div
                            key={review.id}
                            className="w-[280px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_2px_8px_rgba(227,28,95,0.04)]"
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <Rating
                                rating={review.rating}
                                showCount={false}
                                size="sm"
                              />
                              {review.review_date && (
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    review.review_date,
                                  ).toLocaleDateString("en-AU", {
                                    year: "numeric",
                                    month: "short",
                                  })}
                                </span>
                              )}
                            </div>
                            <p className="font-medium text-gray-900">
                              {review.reviewer_name}
                            </p>
                            {review.review_text && (
                              <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-gray-700">
                                {review.review_text}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Desktop - Grid */}
                      <div className="mt-8 hidden grid-cols-2 gap-6 md:grid">
                        {sortedReviews.slice(0, 4).map((review) => (
                          <div key={review.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.04)] hover:shadow-[0_8px_24px_rgba(227,28,95,0.08)] transition-shadow duration-300">
                            <div className="flex items-center justify-between mb-3">
                              <Rating
                                rating={review.rating}
                                showCount={false}
                                size="sm"
                              />
                              {review.review_date && (
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    review.review_date,
                                  ).toLocaleDateString("en-AU", {
                                    year: "numeric",
                                    month: "short",
                                  })}
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-gray-900">
                              {review.reviewer_name}
                            </p>
                            {review.review_text && (
                              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-700">
                                {review.review_text}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      <ReviewsModalTrigger
                        reviews={sortedReviews}
                        averageRating={averageRating}
                        googleReviewsLink={mc.google_reviews_link}
                      />
                    </div>
                  )}
                </div>

                {/* Right Column - Sticky Contact Card */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <div className="rounded-2xl bg-white p-7 sm:p-8 shadow-[0_4px_24px_rgba(227,28,95,0.08)] border border-gray-200">
                      {/* Contact Details Above Form */}
                      {(mc.phone || mc.email || mc.website) && (
                        <div className="mb-7 space-y-3.5 border-b border-gray-200 pb-7">
                          {mc.phone && (
                            <Link
                              href={`tel:${mc.phone}`}
                              className="group flex items-center gap-3 text-sm transition-colors duration-200"
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 group-hover:bg-[#E31C5F] transition-colors duration-200">
                                <Phone className="h-4 w-4 text-[#E31C5F] group-hover:text-white transition-colors duration-200" />
                              </div>
                              <span className="font-medium text-gray-900 group-hover:text-[#E31C5F] transition-colors">
                                {mc.phone}
                              </span>
                            </Link>
                          )}
                          {mc.email && (
                            <Link
                              href={`mailto:${mc.email}`}
                              className="group flex items-center gap-3 text-sm transition-colors duration-200"
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 group-hover:bg-[#E31C5F] transition-colors duration-200">
                                <Mail className="h-4 w-4 text-[#E31C5F] group-hover:text-white transition-colors duration-200" />
                              </div>
                              <span className="font-medium text-gray-900 group-hover:text-[#E31C5F] transition-colors">
                                {mc.email}
                              </span>
                            </Link>
                          )}
                          {mc.website && (
                            <Link
                              href={mc.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center gap-3 text-sm transition-colors duration-200"
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 group-hover:bg-[#E31C5F] transition-colors duration-200">
                                <Globe className="h-4 w-4 text-[#E31C5F] group-hover:text-white transition-colors duration-200" />
                              </div>
                              <span className="font-medium text-gray-900 group-hover:text-[#E31C5F] transition-colors truncate">
                                {mc.website.replace(/^https?:\/\/(www\.)?/, "")}
                              </span>
                            </Link>
                          )}
                        </div>
                      )}

                      <ContactForm mcId={mc.id} mcName={mc.name} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Schema.org Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: mc.name,
            description: mc.bio,
            jobTitle: "Wedding Master of Ceremonies",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Sydney",
              addressRegion: "NSW",
              addressCountry: "AU",
            },
            ...(averageRating > 0 && {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: averageRating.toFixed(1),
                reviewCount: mc.reviews?.length,
                bestRating: "5",
                worstRating: "1",
              },
            }),
            ...(mc.website && { url: mc.website }),
            ...(mc.phone && { telephone: mc.phone }),
            ...(mc.email && { email: mc.email }),
            ...(minPrice && {
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "AUD",
                lowPrice: minPrice,
              },
            }),
          }),
        }}
      />

      <Footer />
    </>
  );
}
