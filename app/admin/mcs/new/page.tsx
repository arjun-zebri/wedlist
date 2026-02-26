"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
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

const inputClassName =
  "block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20 placeholder:text-gray-400";

const labelClassName = "block text-sm font-medium text-gray-700 mb-1.5";

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
    { name: "", price: "", duration: "", ideal_for: "", inclusions: "", popular: false },
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

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryImages(files);
    setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

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

      if (formData.response_time || formData.booking_deposit || formData.cancellation_policy) {
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

      const validReviews = reviews.filter((r) => r.reviewer_name && r.review_text);
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">Add New MC</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Create a complete MC profile with images, packages, videos & reviews
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_2px_8px_rgba(227,28,95,0.04)]">
          <h2 className="text-lg font-bold text-gray-900 font-display mb-6">Basic Information</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClassName}>Name *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClassName}
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className={labelClassName}>Email *</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClassName}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className={labelClassName}>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClassName}
                placeholder="0412 345 678"
              />
            </div>
            <div>
              <label className={labelClassName}>Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className={inputClassName}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className={labelClassName}>Languages</label>
              <input
                type="text"
                value={formData.languages}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                className={inputClassName}
                placeholder="English, Mandarin"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClassName}>Bio</label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className={inputClassName}
                placeholder="Tell couples about this MC's style and experience..."
              />
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
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-6 py-8 hover:border-[#E31C5F]/30 hover:bg-rose-50/20 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload</span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </label>
              {profileImagePreview && (
                <img
                  src={profileImagePreview}
                  alt="Profile preview"
                  className="mt-4 h-28 w-28 rounded-xl object-cover border border-gray-200"
                />
              )}
            </div>
            <div>
              <label className={labelClassName}>Gallery Images</label>
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-6 py-8 hover:border-[#E31C5F]/30 hover:bg-rose-50/20 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload multiple</span>
                <span className="text-xs text-gray-400 mt-1">Select multiple images at once</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImagesChange}
                  className="hidden"
                />
              </label>
              {galleryPreviews.length > 0 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {galleryPreviews.map((preview, i) => (
                    <img
                      key={i}
                      src={preview}
                      alt={`Gallery ${i + 1}`}
                      className="h-20 w-20 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                    />
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
            <button
              type="button"
              onClick={() =>
                setPackages([...packages, { name: "", price: "", duration: "", ideal_for: "", inclusions: "", popular: false }])
              }
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
          <div className="space-y-4">
            {packages.map((pkg, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-gray-700">Package {i + 1}</span>
                  {packages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPackages(packages.filter((_, idx) => idx !== i))}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    placeholder="Package Name"
                    value={pkg.name}
                    onChange={(e) => { const p = [...packages]; p[i].name = e.target.value; setPackages(p); }}
                    className={inputClassName}
                  />
                  <input
                    placeholder="Price (AUD)"
                    type="number"
                    value={pkg.price}
                    onChange={(e) => { const p = [...packages]; p[i].price = e.target.value; setPackages(p); }}
                    className={inputClassName}
                  />
                  <input
                    placeholder="Duration (e.g. 4 hours)"
                    value={pkg.duration}
                    onChange={(e) => { const p = [...packages]; p[i].duration = e.target.value; setPackages(p); }}
                    className={inputClassName}
                  />
                  <input
                    placeholder="Ideal For"
                    value={pkg.ideal_for}
                    onChange={(e) => { const p = [...packages]; p[i].ideal_for = e.target.value; setPackages(p); }}
                    className={inputClassName}
                  />
                  <div className="sm:col-span-2">
                    <textarea
                      placeholder={"Inclusions (one per line)\nReception hosting\nTimeline management"}
                      rows={3}
                      value={pkg.inclusions}
                      onChange={(e) => { const p = [...packages]; p[i].inclusions = e.target.value; setPackages(p); }}
                      className={inputClassName}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={pkg.popular}
                      onChange={(e) => { const p = [...packages]; p[i].popular = e.target.checked; setPackages(p); }}
                      className="h-4 w-4 rounded border-gray-300 text-[#E31C5F] focus:ring-[#E31C5F]"
                    />
                    <label className="text-sm text-gray-700">Most Popular</label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Videos */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_2px_8px_rgba(227,28,95,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 font-display">Videos</h2>
            <button
              type="button"
              onClick={() => setVideos([...videos, { platform: "youtube", video_id: "", title: "" }])}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
          <div className="space-y-4">
            {videos.map((vid, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-gray-700">Video {i + 1}</span>
                  {videos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setVideos(videos.filter((_, idx) => idx !== i))}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <select
                    value={vid.platform}
                    onChange={(e) => { const v = [...videos]; v[i].platform = e.target.value as "youtube" | "vimeo"; setVideos(v); }}
                    className={inputClassName}
                  >
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                  </select>
                  <input
                    placeholder="Video ID"
                    value={vid.video_id}
                    onChange={(e) => { const v = [...videos]; v[i].video_id = e.target.value; setVideos(v); }}
                    className={inputClassName}
                  />
                  <input
                    placeholder="Title"
                    value={vid.title}
                    onChange={(e) => { const v = [...videos]; v[i].title = e.target.value; setVideos(v); }}
                    className={inputClassName}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-[0_2px_8px_rgba(227,28,95,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 font-display">Reviews</h2>
            <button
              type="button"
              onClick={() => setReviews([...reviews, { reviewer_name: "", rating: 5, review_text: "", review_date: "" }])}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
          <div className="mb-5">
            <label className={labelClassName}>Google Reviews Link</label>
            <input
              type="url"
              value={formData.google_reviews_link}
              onChange={(e) => setFormData({ ...formData, google_reviews_link: e.target.value })}
              className={inputClassName}
              placeholder="https://g.page/..."
            />
          </div>
          <div className="space-y-4">
            {reviews.map((rev, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-gray-700">Review {i + 1}</span>
                  {reviews.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setReviews(reviews.filter((_, idx) => idx !== i))}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    placeholder="Reviewer Name"
                    value={rev.reviewer_name}
                    onChange={(e) => { const r = [...reviews]; r[i].reviewer_name = e.target.value; setReviews(r); }}
                    className={inputClassName}
                  />
                  <select
                    value={rev.rating}
                    onChange={(e) => { const r = [...reviews]; r[i].rating = parseInt(e.target.value); setReviews(r); }}
                    className={inputClassName}
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                  <input
                    type="date"
                    value={rev.review_date}
                    onChange={(e) => { const r = [...reviews]; r[i].review_date = e.target.value; setReviews(r); }}
                    className={inputClassName}
                  />
                  <div className="sm:col-span-2">
                    <textarea
                      placeholder="Review text..."
                      rows={3}
                      value={rev.review_text}
                      onChange={(e) => { const r = [...reviews]; r[i].review_text = e.target.value; setReviews(r); }}
                      className={inputClassName}
                    />
                  </div>
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
              <input
                value={formData.response_time}
                onChange={(e) => setFormData({ ...formData, response_time: e.target.value })}
                className={inputClassName}
                placeholder="Within 24 hours"
              />
            </div>
            <div>
              <label className={labelClassName}>Booking Deposit</label>
              <input
                value={formData.booking_deposit}
                onChange={(e) => setFormData({ ...formData, booking_deposit: e.target.value })}
                className={inputClassName}
                placeholder="20% deposit required"
              />
            </div>
            <div>
              <label className={labelClassName}>Cancellation Policy</label>
              <input
                value={formData.cancellation_policy}
                onChange={(e) => setFormData({ ...formData, cancellation_policy: e.target.value })}
                className={inputClassName}
                placeholder="Full refund 30+ days"
              />
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {uploadProgress && (
          <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-100 px-5 py-4">
            {uploadProgress === "Success!" ? (
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            ) : (
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0" />
            )}
            <p className="text-sm font-medium text-blue-800">{uploadProgress}</p>
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
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#E31C5F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#C4184F] transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creating..." : "Create MC Profile"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/mcs")}
            disabled={loading}
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
