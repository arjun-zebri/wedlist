"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

interface Photo {
  id: string;
  url: string;
}

export default function EditMCPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const [mcId, setMcId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    email: "",
    phone: "",
    bio: "",
    website: "",
    languages: "",
    featured: false,
    google_reviews_link: "",
    response_time: "",
    booking_deposit: "",
    cancellation_policy: "",
  });

  const [existingProfileImage, setExistingProfileImage] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [existingPhotos, setExistingPhotos] = useState<Photo[]>([]);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [packages, setPackages] = useState<Package[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function load() {
      const { slug } = await params;

      try {
        const { data: mc, error: mcError } = await supabase
          .from("mc_profiles")
          .select(
            `*, photos:mc_photos(*), videos:mc_videos(*), packages:mc_packages(*), additional_info:mc_additional_info(*), reviews:google_reviews(*)`,
          )
          .eq("slug", slug)
          .single();

        if (mcError) throw mcError;

        setMcId(mc.id);
        setFormData({
          name: mc.name || "",
          slug: mc.slug || "",
          email: mc.email || "",
          phone: mc.phone || "",
          bio: mc.bio || "",
          website: mc.website || "",
          languages: mc.languages?.join(", ") || "",
          featured: mc.featured || false,
          google_reviews_link: mc.google_reviews_link || "",
          response_time: mc.additional_info?.[0]?.response_time || "",
          booking_deposit: mc.additional_info?.[0]?.booking_deposit || "",
          cancellation_policy:
            mc.additional_info?.[0]?.cancellation_policy || "",
        });

        setExistingProfileImage(mc.profile_image || "");
        setExistingPhotos(mc.photos || []);

        setPackages(
          (mc.packages || []).map((p: any) => ({
            name: p.name,
            price: p.price.toString(),
            duration: p.duration || "",
            ideal_for: p.ideal_for || "",
            inclusions: p.inclusions?.join("\n") || "",
            popular: p.popular || false,
          })),
        );

        setVideos(
          (mc.videos || []).map((v: any) => ({
            platform: v.platform,
            video_id: v.video_id,
            title: v.title || "",
          })),
        );

        setReviews(
          (mc.reviews || []).map((r: any) => ({
            reviewer_name: r.reviewer_name,
            rating: r.rating,
            review_text: r.review_text,
            review_date: r.review_date || "",
          })),
        );
      } catch (err: any) {
        setError("Failed to load MC data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params]);

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const name = `${Math.random().toString(36).substring(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("mc-images")
      .upload(`${path}/${name}`, file);
    if (error) throw error;
    return supabase.storage.from("mc-images").getPublicUrl(`${path}/${name}`)
      .data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setStatus("Saving...");

    try {
      // 1. Upload new profile image if provided
      let profileImageUrl = existingProfileImage;
      if (profileImage) {
        setStatus("Uploading profile image...");
        profileImageUrl = await uploadImage(profileImage, "profiles");
      }

      // 2. Upload new gallery images
      setStatus("Uploading gallery images...");
      const newPhotoUrls: string[] = [];
      for (const file of galleryImages) {
        const url = await uploadImage(file, "gallery");
        newPhotoUrls.push(url);
      }

      // 3. Call API to save everything
      setStatus("Saving to database...");
      const response = await fetch(`/api/admin/mcs/${formData.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mcId,
          formData,
          profileImageUrl,
          existingPhotos,
          newPhotoUrls,
          packages,
          videos,
          reviews,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save");
      }

      setStatus("Success!");
      setTimeout(() => router.push("/admin/mcs"), 1000);
    } catch (err: any) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save");
      setStatus("");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl pb-12">
      <h1 className="text-2xl font-bold text-gray-900">Edit MC</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        {/* Basic Info */}
        <section className="rounded-lg border border-gray-200 bg-white p-6">
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
                placeholder="English, Mandarin"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <label className="ml-2 text-sm text-gray-900">Featured MC</label>
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Images</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Profile Image
              </label>
              {(profileImagePreview || existingProfileImage) && (
                <img
                  src={profileImagePreview || existingProfileImage}
                  className="mt-2 h-32 w-32 rounded object-cover border"
                  alt="Profile"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setProfileImage(f);
                    setProfileImagePreview(URL.createObjectURL(f));
                  }
                }}
                className="mt-2 block w-full text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Gallery
              </label>
              {existingPhotos.length > 0 && (
                <div className="mt-2 grid grid-cols-4 gap-4">
                  {existingPhotos.map((photo, i) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.url}
                        className="h-24 w-24 rounded object-cover border"
                        alt="Gallery"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setExistingPhotos(
                            existingPhotos.filter((_, idx) => idx !== i),
                          )
                        }
                        className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-xs text-white"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setGalleryImages(files);
                  setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
                }}
                className="mt-2 block w-full text-sm"
              />
              {galleryPreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {galleryPreviews.map((p, i) => (
                    <img
                      key={i}
                      src={p}
                      className="h-24 w-24 rounded object-cover border"
                      alt="New"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="rounded-lg border border-gray-200 bg-white p-6">
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
              className="rounded bg-gray-900 px-3 py-1 text-sm text-white"
            >
              Add
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {packages.map((pkg, i) => (
              <div key={i} className="rounded border bg-gray-50 p-4">
                <div className="flex justify-between mb-3">
                  <span className="font-medium">Package {i + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setPackages(packages.filter((_, idx) => idx !== i))
                    }
                    className="text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    placeholder="Name"
                    value={pkg.name}
                    onChange={(e) => {
                      const u = [...packages];
                      u[i].name = e.target.value;
                      setPackages(u);
                    }}
                    className="rounded border px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Price"
                    type="number"
                    value={pkg.price}
                    onChange={(e) => {
                      const u = [...packages];
                      u[i].price = e.target.value;
                      setPackages(u);
                    }}
                    className="rounded border px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Duration"
                    value={pkg.duration}
                    onChange={(e) => {
                      const u = [...packages];
                      u[i].duration = e.target.value;
                      setPackages(u);
                    }}
                    className="rounded border px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Ideal For"
                    value={pkg.ideal_for}
                    onChange={(e) => {
                      const u = [...packages];
                      u[i].ideal_for = e.target.value;
                      setPackages(u);
                    }}
                    className="rounded border px-3 py-2 text-sm"
                  />
                  <textarea
                    placeholder="Inclusions (one per line)"
                    rows={3}
                    value={pkg.inclusions}
                    onChange={(e) => {
                      const u = [...packages];
                      u[i].inclusions = e.target.value;
                      setPackages(u);
                    }}
                    className="md:col-span-2 w-full rounded border px-3 py-2 text-sm"
                  />
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={pkg.popular}
                      onChange={(e) => {
                        const u = [...packages];
                        u[i].popular = e.target.checked;
                        setPackages(u);
                      }}
                      className="mr-2"
                    />
                    Most Popular
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Videos */}
        <section className="rounded-lg border border-gray-200 bg-white p-6">
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
              className="rounded bg-gray-900 px-3 py-1 text-sm text-white"
            >
              Add
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {videos.map((vid, i) => (
              <div key={i} className="rounded border bg-gray-50 p-4">
                <div className="flex justify-between mb-3">
                  <span className="font-medium">Video {i + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setVideos(videos.filter((_, idx) => idx !== i))
                    }
                    className="text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <select
                    value={vid.platform}
                    onChange={(e) => {
                      const u = [...videos];
                      u[i].platform = e.target.value as "youtube" | "vimeo";
                      setVideos(u);
                    }}
                    className="rounded border px-3 py-2 text-sm"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                  </select>
                  <input
                    placeholder="Video ID"
                    value={vid.video_id}
                    onChange={(e) => {
                      const u = [...videos];
                      u[i].video_id = e.target.value;
                      setVideos(u);
                    }}
                    className="rounded border px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Title"
                    value={vid.title}
                    onChange={(e) => {
                      const u = [...videos];
                      u[i].title = e.target.value;
                      setVideos(u);
                    }}
                    className="rounded border px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
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
              className="rounded bg-gray-900 px-3 py-1 text-sm text-white"
            >
              Add
            </button>
          </div>
          <div className="mt-4 mb-4">
            <label className="block text-sm font-medium text-gray-900">
              Google Reviews Link
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
              placeholder="https://g.page/..."
              className="mt-1 block w-full rounded border px-3 py-2"
            />
          </div>
          <div className="space-y-4">
            {reviews.map((rev, i) => (
              <div key={i} className="rounded border bg-gray-50 p-4">
                <div className="flex justify-between mb-3">
                  <span className="font-medium">Review {i + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setReviews(reviews.filter((_, idx) => idx !== i))
                    }
                    className="text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    placeholder="Reviewer Name"
                    value={rev.reviewer_name}
                    onChange={(e) => {
                      const u = [...reviews];
                      u[i].reviewer_name = e.target.value;
                      setReviews(u);
                    }}
                    className="rounded border px-3 py-2 text-sm"
                  />
                  <select
                    value={rev.rating}
                    onChange={(e) => {
                      const u = [...reviews];
                      u[i].rating = parseInt(e.target.value);
                      setReviews(u);
                    }}
                    className="rounded border px-3 py-2 text-sm"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5</option>
                    <option value="4">⭐⭐⭐⭐ 4</option>
                    <option value="3">⭐⭐⭐ 3</option>
                    <option value="2">⭐⭐ 2</option>
                    <option value="1">⭐ 1</option>
                  </select>
                  <input
                    type="date"
                    value={rev.review_date}
                    onChange={(e) => {
                      const u = [...reviews];
                      u[i].review_date = e.target.value;
                      setReviews(u);
                    }}
                    className="rounded border px-3 py-2 text-sm"
                  />
                  <textarea
                    placeholder="Review text"
                    rows={3}
                    value={rev.review_text}
                    onChange={(e) => {
                      const u = [...reviews];
                      u[i].review_text = e.target.value;
                      setReviews(u);
                    }}
                    className="md:col-span-2 w-full rounded border px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Info */}
        <section className="rounded-lg border border-gray-200 bg-white p-6">
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
                placeholder="Within 24 hours"
                className="mt-1 block w-full rounded border px-3 py-2"
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
                placeholder="20% deposit"
                className="mt-1 block w-full rounded border px-3 py-2"
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
                placeholder="Full refund 30+ days"
                className="mt-1 block w-full rounded border px-3 py-2"
              />
            </div>
          </div>
        </section>

        {status && (
          <div className="rounded bg-blue-50 p-4 text-sm font-medium text-blue-800">
            {status}
          </div>
        )}
        {error && (
          <div className="rounded bg-red-50 p-4 text-sm font-medium text-red-800">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-gray-900 px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/mcs")}
            disabled={saving}
            className="rounded border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
