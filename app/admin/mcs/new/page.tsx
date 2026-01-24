"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface Package {
  name: string;
  price: string;
  duration: string;
  ideal_for: string;
  inclusions: string;
  popular: boolean;
}

interface Video {
  platform: "youtube" | "vimeo";
  video_id: string;
  title: string;
}

interface Review {
  reviewer_name: string;
  rating: number;
  review_text: string;
  review_date: string;
}

export default function NewMCPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    email: "",
    phone: "",
    bio: "",
    website: "",
    languages: "English",
    featured: false,
    google_reviews_link: "",
    response_time: "",
    booking_deposit: "",
    cancellation_policy: "",
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [packages, setPackages] = useState<Package[]>([
    {
      name: "",
      price: "",
      duration: "",
      ideal_for: "",
      inclusions: "",
      popular: false,
    },
  ]);
  const [videos, setVideos] = useState<Video[]>([
    { platform: "youtube", video_id: "", title: "" },
  ]);
  const [reviews, setReviews] = useState<Review[]>([
    { reviewer_name: "", rating: 5, review_text: "", review_date: "" },
  ]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    setGalleryImages(files);
    setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    // Use admin client for storage operations
    const { error: uploadError } = await supabaseAdmin.storage
      .from("mc-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("mc-images").getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUploadProgress("Creating MC profile...");

    try {
      const slug =
        formData.slug ||
        formData.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      let profileImageUrl = null;
      if (profileImage) {
        setUploadProgress("Uploading profile image...");
        profileImageUrl = await uploadImage(profileImage, "profiles");
      }

      const { data: mcProfile, error: mcError } = await supabaseAdmin
        .from("mc_profiles")
        .insert({
          name: formData.name,
          slug,
          email: formData.email,
          phone: formData.phone || null,
          bio: formData.bio || null,
          website: formData.website || null,
          profile_image: profileImageUrl,
          languages: formData.languages.split(",").map((l) => l.trim()),
          featured: formData.featured,
          google_reviews_link: formData.google_reviews_link || null,
        })
        .select()
        .single();

      if (mcError) throw mcError;
      const mcId = mcProfile.id;

      if (galleryImages.length > 0) {
        setUploadProgress(`Uploading ${galleryImages.length} images...`);
        const photoInserts = [];
        for (let i = 0; i < galleryImages.length; i++) {
          const url = await uploadImage(galleryImages[i], "gallery");
          photoInserts.push({
            mc_id: mcId,
            url,
            alt_text: `${formData.name} - Photo ${i + 1}`,
            order_index: i,
          });
        }
        await supabaseAdmin.from("mc_photos").insert(photoInserts);
      }

      const validPackages = packages.filter((p) => p.name && p.price);
      if (validPackages.length > 0) {
        setUploadProgress("Adding packages...");
        await supabaseAdmin.from("mc_packages").insert(
          validPackages.map((pkg, index) => ({
            mc_id: mcId,
            name: pkg.name,
            price: parseFloat(pkg.price),
            duration: pkg.duration || null,
            ideal_for: pkg.ideal_for || null,
            inclusions: pkg.inclusions
              ? pkg.inclusions.split("\n").filter((i) => i.trim())
              : [],
            popular: pkg.popular,
            order_index: index,
          }))
        );
      }

      if (
        formData.response_time ||
        formData.booking_deposit ||
        formData.cancellation_policy
      ) {
        await supabaseAdmin.from("mc_additional_info").insert({
          mc_id: mcId,
          response_time: formData.response_time || null,
          booking_deposit: formData.booking_deposit || null,
          cancellation_policy: formData.cancellation_policy || null,
        });
      }

      const validVideos = videos.filter((v) => v.video_id);
      if (validVideos.length > 0) {
        await supabaseAdmin.from("mc_videos").insert(
          validVideos.map((video, index) => ({
            mc_id: mcId,
            platform: video.platform,
            video_id: video.video_id,
            title: video.title || null,
            order_index: index,
          }))
        );
      }

      const validReviews = reviews.filter(
        (r) => r.reviewer_name && r.review_text
      );
      if (validReviews.length > 0) {
        await supabaseAdmin.from("google_reviews").insert(
          validReviews.map((review, index) => ({
            mc_id: mcId,
            reviewer_name: review.reviewer_name,
            rating: review.rating,
            review_text: review.review_text,
            review_date: review.review_date || null,
            order_index: index,
          }))
        );
      }

      setUploadProgress("Success!");
      setTimeout(() => router.push("/admin/mcs"), 1000);
    } catch (err: any) {
      setError(err.message || "Failed to create MC");
      setUploadProgress("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl pb-12">
      <h1 className="text-2xl font-bold text-gray-900">Add New MC</h1>
      <p className="text-sm text-gray-600">
        Create complete MC profile with images, packages, videos & reviews
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        {/* Basic Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900">
                Name *
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Email *
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Languages
              </label>
              <input
                type="text"
                value={formData.languages}
                onChange={(e) =>
                  setFormData({ ...formData, languages: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="English, Mandarin"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-900">
                Bio
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <label className="ml-2 text-sm text-gray-900">Featured MC</label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Images</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
              />
              {profileImagePreview && (
                <img
                  src={profileImagePreview}
                  alt="Profile preview"
                  className="mt-4 h-32 w-32 rounded object-cover border border-gray-200"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Gallery Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImagesChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-gray-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
              />
              {galleryPreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {galleryPreviews.map((preview, i) => (
                    <img
                      key={i}
                      src={preview}
                      alt={`Gallery ${i + 1}`}
                      className="h-24 w-24 rounded object-cover border border-gray-200"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Packages */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Packages</h2>
            <button
              type="button"
              onClick={() =>
                setPackages([
                  ...packages,
                  {
                    name: "",
                    price: "",
                    duration: "",
                    ideal_for: "",
                    inclusions: "",
                    popular: false,
                  },
                ])
              }
              className="rounded bg-gray-900 px-3 py-1 text-sm font-medium text-white hover:bg-gray-800"
            >
              Add Package
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className="rounded border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Package {i + 1}</h3>
                  {packages.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPackages(packages.filter((_, idx) => idx !== i))
                      }
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    placeholder="Package Name"
                    value={pkg.name}
                    onChange={(e) => {
                      const p = [...packages];
                      p[i].name = e.target.value;
                      setPackages(p);
                    }}
                    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <input
                    placeholder="Price (AUD)"
                    type="number"
                    value={pkg.price}
                    onChange={(e) => {
                      const p = [...packages];
                      p[i].price = e.target.value;
                      setPackages(p);
                    }}
                    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <input
                    placeholder="Duration (e.g. 4 hours)"
                    value={pkg.duration}
                    onChange={(e) => {
                      const p = [...packages];
                      p[i].duration = e.target.value;
                      setPackages(p);
                    }}
                    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <input
                    placeholder="Ideal For (e.g. Small weddings)"
                    value={pkg.ideal_for}
                    onChange={(e) => {
                      const p = [...packages];
                      p[i].ideal_for = e.target.value;
                      setPackages(p);
                    }}
                    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <div className="md:col-span-2">
                    <textarea
                      placeholder="Inclusions (one per line)&#10;Reception hosting&#10;Timeline management&#10;Microphone coordination"
                      rows={3}
                      value={pkg.inclusions}
                      onChange={(e) => {
                        const p = [...packages];
                        p[i].inclusions = e.target.value;
                        setPackages(p);
                      }}
                      className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={pkg.popular}
                      onChange={(e) => {
                        const p = [...packages];
                        p[i].popular = e.target.checked;
                        setPackages(p);
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <label className="ml-2 text-sm text-gray-900">
                      Most Popular
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Videos */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Videos</h2>
            <button
              type="button"
              onClick={() =>
                setVideos([
                  ...videos,
                  { platform: "youtube", video_id: "", title: "" },
                ])
              }
              className="rounded bg-gray-900 px-3 py-1 text-sm font-medium text-white hover:bg-gray-800"
            >
              Add Video
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {videos.map((vid, i) => (
              <div
                key={i}
                className="rounded border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Video {i + 1}</h3>
                  {videos.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setVideos(videos.filter((_, idx) => idx !== i))
                      }
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <select
                    value={vid.platform}
                    onChange={(e) => {
                      const v = [...videos];
                      v[i].platform = e.target.value as "youtube" | "vimeo";
                      setVideos(v);
                    }}
                    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                  </select>
                  <input
                    placeholder="Video ID (e.g. dQw4w9WgXcQ)"
                    value={vid.video_id}
                    onChange={(e) => {
                      const v = [...videos];
                      v[i].video_id = e.target.value;
                      setVideos(v);
                    }}
                    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <input
                    placeholder="Video Title"
                    value={vid.title}
                    onChange={(e) => {
                      const v = [...videos];
                      v[i].title = e.target.value;
                      setVideos(v);
                    }}
                    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Reviews (Top 5)
            </h2>
            <button
              type="button"
              onClick={() =>
                setReviews([
                  ...reviews,
                  {
                    reviewer_name: "",
                    rating: 5,
                    review_text: "",
                    review_date: "",
                  },
                ])
              }
              className="rounded bg-gray-900 px-3 py-1 text-sm font-medium text-white hover:bg-gray-800"
            >
              Add Review
            </button>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900">
              Google Reviews Link (for "See all reviews" button)
            </label>
            <input
              type="url"
              value={formData.google_reviews_link}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  google_reviews_link: e.target.value,
                })
              }
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="https://g.page/..."
            />
          </div>
          <div className="mt-4 space-y-4">
            {reviews.map((rev, i) => (
              <div
                key={i}
                className="rounded border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Review {i + 1}</h3>
                  {reviews.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setReviews(reviews.filter((_, idx) => idx !== i))
                      }
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    placeholder="Reviewer Name (e.g. Sarah & Tom)"
                    value={rev.reviewer_name}
                    onChange={(e) => {
                      const r = [...reviews];
                      r[i].reviewer_name = e.target.value;
                      setReviews(r);
                    }}
                    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <select
                    value={rev.rating}
                    onChange={(e) => {
                      const r = [...reviews];
                      r[i].rating = parseInt(e.target.value);
                      setReviews(r);
                    }}
                    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                    <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                    <option value="3">⭐⭐⭐ 3 Stars</option>
                    <option value="2">⭐⭐ 2 Stars</option>
                    <option value="1">⭐ 1 Star</option>
                  </select>
                  <input
                    type="date"
                    value={rev.review_date}
                    onChange={(e) => {
                      const r = [...reviews];
                      r[i].review_date = e.target.value;
                      setReviews(r);
                    }}
                    className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                  <div className="md:col-span-2">
                    <textarea
                      placeholder="Review text..."
                      rows={3}
                      value={rev.review_text}
                      onChange={(e) => {
                        const r = [...reviews];
                        r[i].review_text = e.target.value;
                        setReviews(r);
                      }}
                      className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Additional Information
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Response Time
              </label>
              <input
                value={formData.response_time}
                onChange={(e) =>
                  setFormData({ ...formData, response_time: e.target.value })
                }
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="Within 24 hours"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Booking Deposit
              </label>
              <input
                value={formData.booking_deposit}
                onChange={(e) =>
                  setFormData({ ...formData, booking_deposit: e.target.value })
                }
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="20% deposit required"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Cancellation Policy
              </label>
              <input
                value={formData.cancellation_policy}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cancellation_policy: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="Full refund 30+ days before"
              />
            </div>
          </div>
        </div>

        {uploadProgress && (
          <div className="rounded bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-800">
              {uploadProgress}
            </p>
          </div>
        )}
        {error && (
          <div className="rounded bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Creating MC Profile..." : "Create MC Profile"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/mcs")}
            disabled={loading}
            className="rounded border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
