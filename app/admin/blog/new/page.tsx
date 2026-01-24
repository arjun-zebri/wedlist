"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    meta_title: "",
    meta_description: "",
    published: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create slug from title if not provided
      const slug =
        formData.slug ||
        formData.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");

      const { error: insertError } = await supabaseAdmin
        .from("blog_posts")
        .insert({
          title: formData.title,
          slug,
          content: formData.content,
          excerpt: formData.excerpt || null,
          meta_title: formData.meta_title || formData.title,
          meta_description:
            formData.meta_description || formData.excerpt || null,
          published: formData.published,
          published_at: formData.published ? new Date().toISOString() : null,
        });

      if (insertError) {
        throw insertError;
      }

      router.push("/admin/blog");
    } catch (err: any) {
      setError(err.message || "Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Blog Post
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Write a new blog post for SEO and engagement
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="How to Choose the Perfect Wedding MC in Sydney"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug (auto-generated if left empty)
          </label>
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="how-to-choose-wedding-mc-sydney"
          />
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="block text-sm font-medium text-gray-700"
          >
            Excerpt (short summary)
          </label>
          <textarea
            id="excerpt"
            rows={2}
            value={formData.excerpt}
            onChange={(e) =>
              setFormData({ ...formData, excerpt: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="A brief summary of the post..."
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content * (Markdown supported)
          </label>
          <textarea
            id="content"
            rows={15}
            required
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="Write your blog post content here..."
          />
          <p className="mt-1 text-xs text-gray-500">
            You can use Markdown formatting. For now, plain text or basic HTML
            works too.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-900">SEO Settings</h3>

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="meta_title"
                className="block text-sm font-medium text-gray-700"
              >
                Meta Title (for SEO)
              </label>
              <input
                type="text"
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) =>
                  setFormData({ ...formData, meta_title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="Defaults to post title if empty"
              />
            </div>

            <div>
              <label
                htmlFor="meta_description"
                className="block text-sm font-medium text-gray-700"
              >
                Meta Description (for SEO)
              </label>
              <textarea
                id="meta_description"
                rows={2}
                value={formData.meta_description}
                onChange={(e) =>
                  setFormData({ ...formData, meta_description: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="Defaults to excerpt if empty"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) =>
              setFormData({ ...formData, published: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <label
            htmlFor="published"
            className="ml-2 block text-sm text-gray-700"
          >
            Publish immediately (otherwise save as draft)
          </label>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : formData.published
              ? "Publish Post"
              : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
