"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";

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

const inputClassName =
  "block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20 placeholder:text-gray-400";

const labelClassName = "block text-sm font-medium text-gray-700 mb-1.5";

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
          cancellation_policy: mc.additional_info?.[0]?.cancellation_policy || "",
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
      let profileImageUrl = existingProfileImage;
      if (profileImage) {
        setStatus("Uploading profile image...");
        profileImageUrl = await uploadImage(profileImage, "profiles");
      }

      setStatus("Uploading gallery images...");
      const newPhotoUrls: string[] = [];
      for (const file of galleryImages) {
        const url = await uploadImage(file, "gallery");
        newPhotoUrls.push(url);
      }

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
      <div className="max-w-4xl space-y-6 animate-pulse">
        <div className="h-6 w-24 bg-gray-200 rounded-lg"></div>
        <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
        <div className="h-64 bg-white rounded-2xl border border-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl pb-12">
      {/* Back + Header */}
      <div className="mb-8">
        <Link
          href="/admin/mcs"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to MCs
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">Edit MC</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Update {formData.name || "MC"}&apos;s profile
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_2px_8px_rgba(227,28,95,0.04)]">
          <h2 className="text-lg font-bold text-gray-900 font-display mb-6">Basic Information</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClassName}>Name *</label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Email *</label>
              <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Phone</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Website</label>
              <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Languages</label>
              <input type="text" value={formData.languages} onChange={(e) => setFormData({ ...formData, languages: e.target.value })} placeholder="English, Mandarin" className={inputClassName} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClassName}>Bio</label>
              <textarea rows={4} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Slug</label>
              <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className={inputClassName} />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-[#E31C5F] focus:ring-[#E31C5F]"
              />
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-[#E31C5F]" />
                Featured MC
              </label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_2px_8px_rgba(227,28,95,0.04)]">
          <h2 className="text-lg font-bold text-gray-900 font-display mb-6">Images</h2>
          <div className="space-y-6">
            <div>
              <label className={labelClassName}>Profile Image</label>
              {(profileImagePreview || existingProfileImage) && (
                <img
                  src={profileImagePreview || existingProfileImage}
                  className="mb-3 h-28 w-28 rounded-xl object-cover border border-gray-200"
                  alt="Profile"
                />
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-600 hover:border-[#E31C5F]/30 hover:bg-rose-50/20 transition-colors w-fit">
                <Upload className="h-4 w-4 text-gray-400" />
                Change image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { setProfileImage(f); setProfileImagePreview(URL.createObjectURL(f)); }
                  }}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <label className={labelClassName}>Gallery</label>
              {existingPhotos.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-2 mb-3">
                  {existingPhotos.map((photo, i) => (
                    <div key={photo.id} className="relative flex-shrink-0">
                      <img src={photo.url} className="h-20 w-20 rounded-xl object-cover border border-gray-200" alt="Gallery" />
                      <button
                        type="button"
                        onClick={() => setExistingPhotos(existingPhotos.filter((_, idx) => idx !== i))}
                        className="absolute -right-1.5 -top-1.5 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-600 hover:border-[#E31C5F]/30 hover:bg-rose-50/20 transition-colors w-fit">
                <Upload className="h-4 w-4 text-gray-400" />
                Add more images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setGalleryImages(files);
                    setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
                  }}
                  className="hidden"
                />
              </label>
              {galleryPreviews.length > 0 && (
                <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
                  {galleryPreviews.map((p, i) => (
                    <img key={i} src={p} className="h-20 w-20 rounded-xl object-cover border border-gray-200 flex-shrink-0" alt="New" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Packages */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_2px_8px_rgba(227,28,95,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 font-display">Packages</h2>
            <button type="button" onClick={() => setPackages([...packages, { name: "", price: "", duration: "", ideal_for: "", inclusions: "", popular: false }])} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
          <div className="space-y-4">
            {packages.map((pkg, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-gray-700">Package {i + 1}</span>
                  <button type="button" onClick={() => setPackages(packages.filter((_, idx) => idx !== i))} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input placeholder="Name" value={pkg.name} onChange={(e) => { const u = [...packages]; u[i].name = e.target.value; setPackages(u); }} className={inputClassName} />
                  <input placeholder="Price" type="number" value={pkg.price} onChange={(e) => { const u = [...packages]; u[i].price = e.target.value; setPackages(u); }} className={inputClassName} />
                  <input placeholder="Duration" value={pkg.duration} onChange={(e) => { const u = [...packages]; u[i].duration = e.target.value; setPackages(u); }} className={inputClassName} />
                  <input placeholder="Ideal For" value={pkg.ideal_for} onChange={(e) => { const u = [...packages]; u[i].ideal_for = e.target.value; setPackages(u); }} className={inputClassName} />
                  <textarea placeholder="Inclusions (one per line)" rows={3} value={pkg.inclusions} onChange={(e) => { const u = [...packages]; u[i].inclusions = e.target.value; setPackages(u); }} className={`sm:col-span-2 ${inputClassName}`} />
                  <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" checked={pkg.popular} onChange={(e) => { const u = [...packages]; u[i].popular = e.target.checked; setPackages(u); }} className="h-4 w-4 rounded border-gray-300 text-[#E31C5F] focus:ring-[#E31C5F]" />
                    Most Popular
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Videos */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_2px_8px_rgba(227,28,95,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 font-display">Videos</h2>
            <button type="button" onClick={() => setVideos([...videos, { platform: "youtube", video_id: "", title: "" }])} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
          <div className="space-y-4">
            {videos.map((vid, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-gray-700">Video {i + 1}</span>
                  <button type="button" onClick={() => setVideos(videos.filter((_, idx) => idx !== i))} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <select value={vid.platform} onChange={(e) => { const u = [...videos]; u[i].platform = e.target.value as "youtube" | "vimeo"; setVideos(u); }} className={inputClassName}>
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                  </select>
                  <input placeholder="Video ID" value={vid.video_id} onChange={(e) => { const u = [...videos]; u[i].video_id = e.target.value; setVideos(u); }} className={inputClassName} />
                  <input placeholder="Title" value={vid.title} onChange={(e) => { const u = [...videos]; u[i].title = e.target.value; setVideos(u); }} className={inputClassName} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_2px_8px_rgba(227,28,95,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 font-display">Reviews</h2>
            <button type="button" onClick={() => setReviews([...reviews, { reviewer_name: "", rating: 5, review_text: "", review_date: "" }])} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors">
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
          <div className="mb-5">
            <label className={labelClassName}>Google Reviews Link</label>
            <input type="url" value={formData.google_reviews_link} onChange={(e) => setFormData({ ...formData, google_reviews_link: e.target.value })} placeholder="https://g.page/..." className={inputClassName} />
          </div>
          <div className="space-y-4">
            {reviews.map((rev, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-gray-700">Review {i + 1}</span>
                  <button type="button" onClick={() => setReviews(reviews.filter((_, idx) => idx !== i))} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input placeholder="Reviewer Name" value={rev.reviewer_name} onChange={(e) => { const u = [...reviews]; u[i].reviewer_name = e.target.value; setReviews(u); }} className={inputClassName} />
                  <select value={rev.rating} onChange={(e) => { const u = [...reviews]; u[i].rating = parseInt(e.target.value); setReviews(u); }} className={inputClassName}>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                  <input type="date" value={rev.review_date} onChange={(e) => { const u = [...reviews]; u[i].review_date = e.target.value; setReviews(u); }} className={inputClassName} />
                  <textarea placeholder="Review text" rows={3} value={rev.review_text} onChange={(e) => { const u = [...reviews]; u[i].review_text = e.target.value; setReviews(u); }} className={`sm:col-span-2 ${inputClassName}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_2px_8px_rgba(227,28,95,0.04)]">
          <h2 className="text-lg font-bold text-gray-900 font-display mb-6">Additional Information</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClassName}>Response Time</label>
              <input value={formData.response_time} onChange={(e) => setFormData({ ...formData, response_time: e.target.value })} placeholder="Within 24 hours" className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Booking Deposit</label>
              <input value={formData.booking_deposit} onChange={(e) => setFormData({ ...formData, booking_deposit: e.target.value })} placeholder="20% deposit" className={inputClassName} />
            </div>
            <div>
              <label className={labelClassName}>Cancellation Policy</label>
              <input value={formData.cancellation_policy} onChange={(e) => setFormData({ ...formData, cancellation_policy: e.target.value })} placeholder="Full refund 30+ days" className={inputClassName} />
            </div>
          </div>
        </div>

        {/* Status */}
        {status && (
          <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-100 px-5 py-4">
            {status === "Success!" ? (
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            ) : (
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0" />
            )}
            <p className="text-sm font-medium text-blue-800">{status}</p>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 px-5 py-4">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#E31C5F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#C4184F] transition-colors disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/mcs")}
            disabled={saving}
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
