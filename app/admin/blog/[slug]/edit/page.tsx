"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  Search as SearchIcon,
} from "lucide-react";

const labelClassName = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";
const inputClassName = "block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20 placeholder:text-gray-400";

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const [postId, setPostId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    meta_title: "",
    meta_description: "",
    published: false,
  });

  useEffect(() => {
    async function loadPost() {
      const resolvedParams = await params;
      const slug = resolvedParams.slug;

      try {
        const { data: post, error: postError } = await supabaseAdmin
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .single();

        if (postError) throw postError;

        setPostId(post.id);
        setFormData({
          title: post.title || "",
          slug: post.slug || "",
          content: post.content || "",
          excerpt: post.excerpt || "",
          meta_title: post.meta_title || "",
          meta_description: post.meta_description || "",
          published: post.published || false,
        });
      } catch (err: any) {
        console.error("Error loading post:", err);
        setError("Failed to load blog post");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const { error: updateError } = await supabaseAdmin
        .from("blog_posts")
        .update({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          excerpt: formData.excerpt || null,
          meta_title: formData.meta_title || formData.title,
          meta_description:
            formData.meta_description || formData.excerpt || null,
          published: formData.published,
          published_at: formData.published ? new Date().toISOString() : null,
        })
        .eq("id", postId);

      if (updateError) throw updateError;

      router.push("/admin/blog");
    } catch (err: any) {
      setError(err.message || "Failed to update blog post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6 animate-pulse">
        <div className="h-5 w-32 bg-gray-200 rounded-lg"></div>
        <div className="h-10 w-64 bg-gray-200 rounded-lg"></div>
        <div className="h-[400px] bg-white rounded-2xl border border-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Back Link */}
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#E31C5F] transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">Edit Post</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Update your blog post content and settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Content Section */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-[0_2px_8px_rgba(227,28,95,0.04)] p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
              <FileText className="h-4 w-4 text-[#E31C5F]" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Post Content</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="title" className={labelClassName}>Title *</label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={inputClassName}
                placeholder="How to Choose the Perfect Wedding MC in Sydney"
              />
            </div>

            <div>
              <label htmlFor="slug" className={labelClassName}>Slug</label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className={inputClassName}
                placeholder="how-to-choose-wedding-mc-sydney"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className={labelClassName}>Excerpt (short summary)</label>
              <textarea
                id="excerpt"
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className={inputClassName}
                placeholder="A brief summary of the post..."
              />
            </div>

            <div>
              <label htmlFor="content" className={labelClassName}>Content * (Markdown supported)</label>
              <textarea
                id="content"
                rows={15}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className={`${inputClassName} font-mono`}
                placeholder="Write your blog post content here..."
              />
              <p className="mt-1.5 text-xs text-gray-400">
                You can use Markdown formatting. Plain text or basic HTML works too.
              </p>
            </div>
          </div>
        </div>

        {/* SEO Section */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-[0_2px_8px_rgba(227,28,95,0.04)] p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
              <SearchIcon className="h-4 w-4 text-[#E31C5F]" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">SEO Settings</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="meta_title" className={labelClassName}>Meta Title</label>
              <input
                type="text"
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                className={inputClassName}
                placeholder="Defaults to post title if empty"
              />
            </div>

            <div>
              <label htmlFor="meta_description" className={labelClassName}>Meta Description</label>
              <textarea
                id="meta_description"
                rows={2}
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                className={inputClassName}
                placeholder="Defaults to excerpt if empty"
              />
            </div>
          </div>
        </div>

        {/* Publish Toggle */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-[0_2px_8px_rgba(227,28,95,0.04)] p-6 sm:p-8">
          <label htmlFor="published" className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#E31C5F] focus:ring-[#E31C5F]"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">Published</p>
              <p className="text-xs text-gray-500">Visible to public when checked</p>
            </div>
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#E31C5F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#C4184F] transition-colors disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
