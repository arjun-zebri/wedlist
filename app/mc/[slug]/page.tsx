import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Globe,
  Phone,
  Mail,
  Languages,
  ExternalLink,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
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
      photos:mc_photos(*)  ,
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
  params: { slug: string };
}): Promise<Metadata> {
  const mc = await getMCBySlug(params.slug);

  if (!mc) {
    return {
      title: "MC Not Found",
    };
  }

  return {
    title: `${mc.name} - Wedding MC Sydney | WedList`,
    description:
      mc.bio ||
      `Book ${mc.name}, a professional wedding MC in Sydney. View packages, reviews, and availability.`,
    openGraph: {
      title: `${mc.name} - Wedding MC Sydney`,
      description: mc.bio || `Professional wedding MC in Sydney`,
      images: mc.profile_image ? [mc.profile_image] : [],
    },
  };
}

export default async function MCProfilePage({
  params,
}: {
  params: { slug: string };
}) {
  const mc = await getMCBySlug(params.slug);

  if (!mc) {
    notFound();
  }

  const averageRating =
    mc.reviews && mc.reviews.length > 0
      ? mc.reviews.reduce((acc, review) => acc + review.rating, 0) /
        mc.reviews.length
      : 0;

  // Sort photos by order_index
  const sortedPhotos =
    mc.photos?.sort((a, b) => a.order_index - b.order_index) || [];

  // Sort videos by order_index
  const sortedVideos =
    mc.videos?.sort((a, b) => a.order_index - b.order_index) || [];

  // Sort packages by order_index
  const sortedPackages =
    mc.packages?.sort((a, b) => a.order_index - b.order_index) || [];

  // Sort reviews by order_index
  const sortedReviews =
    mc.reviews?.sort((a, b) => a.order_index - b.order_index) || [];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <nav className="flex text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-700">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/wedding-mc-sydney" className="hover:text-gray-700">
                Wedding MCs Sydney
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{mc.name}</span>
            </nav>
          </div>
        </div>

        {/* Profile Header */}
        <section className="bg-white px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Profile Image */}
              <div className="lg:col-span-1">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                  {mc.profile_image ? (
                    <Image
                      src={mc.profile_image}
                      alt={mc.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <span className="text-6xl font-bold">{mc.name[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {mc.name}
                    </h1>
                    {averageRating > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.round(averageRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {averageRating.toFixed(1)} ({mc.reviews?.length}{" "}
                          reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  {mc.featured && (
                    <span className="rounded-full bg-gray-900 px-4 py-1 text-sm font-medium text-white">
                      Featured
                    </span>
                  )}
                </div>

                {mc.bio && (
                  <p className="mt-6 text-gray-700 leading-relaxed">{mc.bio}</p>
                )}

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {mc.languages && mc.languages.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Languages className="h-5 w-5" />
                      <span>{mc.languages.join(", ")}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-5 w-5" />
                    <span>Sydney, NSW</span>
                  </div>

                  {mc.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-5 w-5 text-gray-600" />
                      <a
                        href={mc.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 hover:text-gray-700"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  {mc.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <a
                        href={`tel:${mc.phone}`}
                        className="text-gray-900 hover:text-gray-700"
                      >
                        {mc.phone}
                      </a>
                    </div>
                  )}
                </div>

                {mc.additional_info && (
                  <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-3">
                    {mc.additional_info.response_time && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Response Time
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {mc.additional_info.response_time}
                        </p>
                      </div>
                    )}
                    {mc.additional_info.booking_deposit && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Booking Deposit
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {mc.additional_info.booking_deposit}
                        </p>
                      </div>
                    )}
                    {mc.additional_info.cancellation_policy && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Cancellation Policy
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          {mc.additional_info.cancellation_policy}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Packages */}
        {sortedPackages.length > 0 && (
          <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-gray-900">
                Packages & Pricing
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative rounded-lg border-2 bg-white p-6 ${
                      pkg.popular ? "border-gray-900" : "border-gray-200"
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-gray-900 px-4 py-1 text-xs font-medium text-white">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {pkg.name}
                      </h3>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-gray-900">
                          {formatPrice(pkg.price)}
                        </span>
                      </div>
                      {pkg.duration && (
                        <p className="mt-2 text-sm text-gray-600">
                          {pkg.duration}
                        </p>
                      )}
                      {pkg.ideal_for && (
                        <p className="mt-2 text-sm italic text-gray-500">
                          {pkg.ideal_for}
                        </p>
                      )}
                    </div>
                    {pkg.inclusions && pkg.inclusions.length > 0 && (
                      <ul className="mt-6 space-y-3">
                        {pkg.inclusions.map((inclusion, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <span className="text-green-500">✓</span>
                            <span>{inclusion}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Photos */}
        {sortedPhotos.length > 0 && (
          <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-gray-900">Gallery</h2>
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {sortedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                  >
                    <Image
                      src={photo.url}
                      alt={photo.alt_text || mc.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Videos */}
        {sortedVideos.length > 0 && (
          <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-gray-900">Videos</h2>
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {sortedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="overflow-hidden rounded-lg bg-white"
                  >
                    <div className="relative aspect-video">
                      <iframe
                        src={
                          video.platform === "youtube"
                            ? getYouTubeEmbedUrl(video.video_id)
                            : getVimeoEmbedUrl(video.video_id)
                        }
                        title={video.title || mc.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                      />
                    </div>
                    {video.title && (
                      <div className="p-4">
                        <p className="text-sm font-medium text-gray-900">
                          {video.title}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Reviews */}
        {sortedReviews.length > 0 && (
          <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                {mc.google_reviews_link && (
                  <a
                    href={mc.google_reviews_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-700"
                  >
                    See all reviews
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg border border-gray-200 bg-white p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      {review.review_date && (
                        <span className="text-xs text-gray-500">
                          {new Date(review.review_date).toLocaleDateString(
                            "en-AU",
                            {
                              year: "numeric",
                              month: "short",
                            }
                          )}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-medium text-gray-900">
                      {review.reviewer_name}
                    </p>
                    {review.review_text && (
                      <p className="mt-2 text-sm text-gray-700">
                        {review.review_text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Form */}
        <section className="bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <ContactForm mcId={mc.id} mcName={mc.name} />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
