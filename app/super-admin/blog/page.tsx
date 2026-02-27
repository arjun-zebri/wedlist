'use client';

import Link from 'next/link';
import { FileText, ArrowRight, Plus } from 'lucide-react';

const SAMPLE_POSTS = [
  {
    id: 1,
    title: '5 Tips for Wedding Planning',
    slug: 'wedding-planning-tips',
    status: 'published',
    publishedAt: '2025-02-20',
    excerpt: 'Learn the essential tips for planning your perfect wedding day...',
  },
  {
    id: 2,
    title: 'How to Choose the Right MC',
    slug: 'choosing-right-mc',
    status: 'published',
    publishedAt: '2025-02-15',
    excerpt: 'A guide to finding an MC that matches your vision and budget...',
  },
  {
    id: 3,
    title: 'Wedding Venue Trends 2025',
    slug: 'venue-trends-2025',
    status: 'draft',
    excerpt: 'The latest trending wedding venues for this year...',
  },
];

export default function BlogPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog</h1>
          <p className="text-gray-600">Create and manage blog posts</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E31C5F] text-white rounded-xl font-semibold hover:bg-[#C4184F] transition-colors">
          <Plus className="w-4 h-4" />
          New Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button className="px-3 py-1.5 rounded-full text-sm font-medium bg-[#E31C5F] text-white">All</button>
        <button className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">Published</button>
        <button className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">Drafts</button>
      </div>

      {/* Blog Posts */}
      <div className="space-y-3">
        {SAMPLE_POSTS.map((post) => (
          <Link
            key={post.id}
            href={`/super-admin/blog/${post.id}`}
            className="block rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] hover:shadow-[0_6px_16px_rgba(227,28,95,0.15)] hover:-translate-y-1 transition-all group border border-gray-100"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#E31C5F]">{post.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">/{post.slug}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{post.excerpt}</p>
              </div>
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <div
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {post.status === 'published' ? 'Published' : 'Draft'}
                </div>
                {post.publishedAt && (
                  <p className="text-xs text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString('en-AU', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
