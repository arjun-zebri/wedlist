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
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import Rating from "@/components/Rating";
import ImageGallery from "@/components/ImageGallery";
import PackageModalTrigger from "@/components/PackageModalTrigger";
import ReviewsModalTrigger from "@/components/ReviewsModalTrigger";
import { MCProfileWithRelations } from "@/types/database";
import { formatPrice, getYouTubeEmbedUrl, getVimeoEmbedUrl } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

async function getMCBySlug(
  slug: string
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
    `
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

  // Get most recent review date
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

      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-gray-200 bg-white">
          <div className="container mx-auto max-w-[1400px] px-4 py-3 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900 hover:underline">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/wedding-mc-sydney"
                className="hover:text-gray-900 hover:underline"
              >
                Wedding MCs
              </Link>
              <span>/</span>
              <span className="font-medium text-gray-900">{mc.name}</span>
            </nav>
          </div>
        </div>

        {/* Image Gallery */}
        <section className="bg-white">
          <div className="container mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
            {sortedPhotos.length > 0 ? (
              <ImageGallery
                photos={sortedPhotos}
                mcName={mc.name}
                featured={mc.featured}
              />
            ) : (
              <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
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
                    <span className="text-8xl font-bold text-gray-400">
                      {mc.name[0]}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Profile Content */}
        <section className="bg-white">
          <div className="container mx-auto max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2">
                {/* Header */}
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-start justify-between">
                    <h1 className="text-3xl font-semibold text-gray-900">
                      {mc.name}
                    </h1>
                    {mostRecentReviewDate && (
                      <p className="text-sm text-gray-600">
                        Last reviewed {mostRecentReviewDate}
                      </p>
                    )}
                  </div>
                  <p className="mt-1 text-base text-gray-600">
                    Professional Wedding MC in Sydney
                  </p>

                  {/* Icons Row - All same size */}
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    {averageRating > 0 && (
                      <div className="flex items-center gap-2">
                        <Rating
                          rating={averageRating}
                          count={mc.reviews?.length}
                          size="sm"
                        />
                      </div>
                    )}

                    {mc.languages && mc.languages.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Languages className="h-5 w-5 text-gray-400" />
                        <span>{mc.languages.join(", ")}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span>Sydney, NSW</span>
                    </div>

                    {minPrice && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <span>From {formatPrice(minPrice)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* About */}
                {mc.bio && (
                  <div className="border-b border-gray-200 py-10">
                    <h2 className="text-xl font-semibold text-gray-900">
                      About
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-gray-700">
                      {mc.bio}
                    </p>
                  </div>
                )}

                {/* Packages */}
                {sortedPackages.length > 0 && (
                  <div className="border-b border-gray-200 py-10">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Packages
                    </h2>
                    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                      {sortedPackages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className={`rounded-lg border p-3 ${
                            pkg.popular
                              ? "border-gray-900 bg-gray-50"
                              : "border-gray-200"
                          }`}
                        >
                          {pkg.popular && (
                            <span className="mb-2 inline-block rounded bg-gray-900 px-2 py-0.5 text-xs font-medium text-white">
                              Popular
                            </span>
                          )}
                          <h3 className="text-sm font-semibold text-gray-900">
                            {pkg.name}
                          </h3>
                        </div>
                      ))}
                    </div>
                    <PackageModalTrigger packages={sortedPackages} />
                  </div>
                )}

                {/* Videos */}
                {sortedVideos.length > 0 && (
                  <div className="border-b border-gray-200 py-10">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Videos
                    </h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {sortedVideos.map((video) => (
                        <div
                          key={video.id}
                          className="overflow-hidden rounded-lg"
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
                            <p className="mt-2 text-sm font-medium text-gray-900">
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
                    <h2 className="text-xl font-semibold text-gray-900">
                      Google Reviews
                    </h2>

                    {/* Mobile - Horizontal scroll */}
                    <div className="mt-6 flex gap-4 overflow-x-auto pb-4 md:hidden">
                      {sortedReviews.map((review) => (
                        <div
                          key={review.id}
                          className="w-[280px] flex-shrink-0 rounded-lg border border-gray-200 p-4"
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
                                  review.review_date
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
                    <div className="mt-6 hidden grid-cols-2 gap-6 md:grid">
                      {sortedReviews.slice(0, 4).map((review) => (
                        <div key={review.id} className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <Rating
                              rating={review.rating}
                              showCount={false}
                              size="sm"
                            />
                            {review.review_date && (
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  review.review_date
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
                            <p className="line-clamp-3 text-sm leading-relaxed text-gray-700">
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
                  <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
                    {/* Contact Details Above Form */}
                    <div className="mb-6 space-y-3 border-b border-gray-200 pb-6">
                      {mc.phone && (
                        <Link
                          href={`tel:${mc.phone}`}
                          className="flex items-center gap-3 text-sm text-gray-700 transition-colors hover:text-gray-900"
                        >
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{mc.phone}</span>
                        </Link>
                      )}
                      {mc.email && (
                        <Link
                          href={`mailto:${mc.email}`}
                          className="flex items-center gap-3 text-sm text-gray-700 transition-colors hover:text-gray-900"
                        >
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{mc.email}</span>
                        </Link>
                      )}
                      {mc.website && (
                        <Link
                          href={mc.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-gray-700 transition-colors hover:text-gray-900"
                        >
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="truncate">
                            {mc.website.replace(/^https?:\/\/(www\.)?/, "")}
                          </span>
                        </Link>
                      )}
                    </div>

                    <ContactForm mcId={mc.id} mcName={mc.name} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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
