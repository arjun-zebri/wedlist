"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";

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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update your blog post content and settings
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-900"
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
            className="block text-sm font-medium text-gray-900"
          >
            Slug
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
            className="block text-sm font-medium text-gray-900"
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
            className="block text-sm font-medium text-gray-900"
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
                className="block text-sm font-medium text-gray-900"
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
                className="block text-sm font-medium text-gray-900"
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
            className="ml-2 block text-sm text-gray-900"
          >
            Published (visible to public)
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
            disabled={saving}
            className="rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
