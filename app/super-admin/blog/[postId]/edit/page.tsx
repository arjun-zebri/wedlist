'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, X, Trash2 } from 'lucide-react';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Top 10 Wedding MC Tips for 2025', // TODO: Load from database
    slug: 'top-10-wedding-mc-tips-2025',
    excerpt: 'Essential tips to help you become an exceptional wedding MC and create memorable moments for every couple.',
    content: 'Your content here...',
    image: 'https://example.com/image.jpg',
    status: 'published',
    seoTitle: 'Top 10 Wedding MC Tips - WedList',
    seoDescription: 'Learn the best practices for wedding MCs to deliver unforgettable speeches and keep guests engaged.',
    tags: ['wedding', 'mc', 'tips', 'ceremony'],
    newTag: '',
    publishedDate: '2025-02-20',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: '',
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to update blog post
      console.log('Updating blog post:', postId, formData);

      router.push('/super-admin/blog');
      router.refresh();
    } catch (error) {
      console.error('Error updating blog post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to delete blog post
      console.log('Deleting blog post:', postId);

      router.push('/super-admin/blog');
      router.refresh();
    } catch (error) {
      console.error('Error deleting blog post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Edit Blog Post</h1>
            <p className="text-gray-600 mt-1">Update and manage your blog post</p>
          </div>
        </div>

        <button
          onClick={() => setShowDeleteDialog(true)}
          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete post"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Excerpt *
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows={2}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Feature Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
              />
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>

          <div className="mb-3 flex gap-2 text-xs border-b border-gray-200 pb-3">
            <button type="button" className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium">
              Bold
            </button>
            <button type="button" className="px-3 py-1 rounded-lg hover:bg-gray-100 text-gray-600">
              Italic
            </button>
            <button type="button" className="px-3 py-1 rounded-lg hover:bg-gray-100 text-gray-600">
              Link
            </button>
            <button type="button" className="px-3 py-1 rounded-lg hover:bg-gray-100 text-gray-600">
              H2
            </button>
            <button type="button" className="px-3 py-1 rounded-lg hover:bg-gray-100 text-gray-600">
              List
            </button>
          </div>

          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={12}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20 font-mono"
          />
        </div>

        {/* Tags */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={formData.newTag}
              onChange={(e) => setFormData(prev => ({ ...prev, newTag: e.target.value }))}
              placeholder="Add a tag..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2.5 rounded-xl bg-[#E31C5F] text-white font-medium hover:bg-[#C4184F] transition-colors"
            >
              Add
            </button>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-full text-xs font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-rose-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEO */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Meta Title
              </label>
              <input
                type="text"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.seoTitle.length}/60 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Meta Description
              </label>
              <textarea
                name="seoDescription"
                value={formData.seoDescription}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.seoDescription.length}/160 characters</p>
            </div>
          </div>
        </div>

        {/* Status & Publishing */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Published Date
              </label>
              <input
                type="date"
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#E31C5F] text-white font-semibold py-3 rounded-xl hover:bg-[#C4184F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-[1300] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-[0_20px_25px_rgba(0,0,0,0.15)]">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Blog Post?</h2>
            <p className="text-gray-600 mb-6">
              This will permanently delete &quot;{formData.title}&quot;. This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 text-white font-semibold py-2.5 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
