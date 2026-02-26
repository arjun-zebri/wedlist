"use client";

import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Link from "next/link";
import {
  Plus,
  ExternalLink,
  Pencil,
  Trash2,
  FileText,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  published_at: string | null;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data } = await supabaseAdmin
        .from("blog_posts")
        .select("id, title, slug, published, created_at, published_at")
        .order("created_at", { ascending: false });

      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deletePost(id: string, title: string) {
    if (
      !confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeleting(id);
    try {
      const { error } = await supabaseAdmin
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setPosts(posts.filter((post) => post.id !== id));
    } catch (error: any) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post: " + error.message);
    } finally {
      setDeleting(null);
    }
  }

  const filteredPosts = searchQuery
    ? posts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-40 bg-gray-200 rounded-lg"></div>
        <div className="h-12 bg-gray-200 rounded-xl"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-white rounded-xl border border-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">Blog Posts</h1>
          <p className="mt-1 text-sm text-gray-500">
            {posts.length} {posts.length === 1 ? "post" : "posts"} total
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#E31C5F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#C4184F] transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20 transition-all"
        />
      </div>

      {/* Post Cards List */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-base font-medium text-gray-900">
            {searchQuery ? "No posts match your search" : "No blog posts yet"}
          </p>
          <p className="mt-1.5 text-sm text-gray-500">
            {searchQuery ? "Try a different search term" : "Create your first post to get started"}
          </p>
          {!searchQuery && (
            <Link
              href="/admin/blog/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#E31C5F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#C4184F] transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Post
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="group flex items-center justify-between gap-4 rounded-2xl bg-white p-4 sm:p-5 border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(227,28,95,0.06)] transition-shadow duration-200"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-[#E31C5F]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm truncate">{post.title}</p>
                    {post.published ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200/60 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                        <CheckCircle className="h-2.5 w-2.5" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/60 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        <AlertCircle className="h-2.5 w-2.5" />
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-xs text-gray-500 truncate">/blog/{post.slug}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {new Date(post.created_at).toLocaleDateString("en-AU", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Link
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="View post"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href={`/admin/blog/${post.slug}/edit`}
                  className="p-2 rounded-lg text-gray-400 hover:text-[#E31C5F] hover:bg-rose-50 transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => deletePost(post.id, post.title)}
                  disabled={deleting === post.id}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
