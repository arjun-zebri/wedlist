'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Mail, Phone, DollarSign, Calendar, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function EditMCPage() {
  const router = useRouter();
  const params = useParams();
  const mcId = params.mcId as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: 'James Brown', // TODO: Load from database
    email: 'james@example.com',
    phone: '0412 345 683',
    stage: 'active',
    listingStatus: 'paid',
    monthlyRevenue: '150',
    renewalDate: '2025-06-15',
    notes: 'High-performing MC, regular referrals to other MCs',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to update MC
      console.log('Updating MC:', mcId, formData);

      router.push('/super-admin/crm/mcs');
      router.refresh();
    } catch (error) {
      console.error('Error updating MC:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to delete MC
      console.log('Deleting MC:', mcId);

      router.push('/super-admin/crm/mcs');
      router.refresh();
    } catch (error) {
      console.error('Error deleting MC:', error);
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
            <h1 className="text-4xl font-bold text-gray-900">Edit MC</h1>
            <p className="text-gray-600 mt-1">Update MC details and pipeline status</p>
          </div>
        </div>

        <button
          onClick={() => setShowDeleteDialog(true)}
          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete MC"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email *
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </div>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline & Listing Status */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Status</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                MC Stage *
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
              >
                <option value="prospect">Prospect</option>
                <option value="trial">Trial</option>
                <option value="listed">Listed</option>
                <option value="active">Active</option>
                <option value="churned">Churned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Listing Status *
              </label>
              <select
                name="listingStatus"
                value={formData.listingStatus}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
              >
                <option value="free">Free</option>
                <option value="trial">Trial</option>
                <option value="paid">Paid</option>
                <option value="expired">Expired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Monthly Revenue (MRR)
                </div>
              </label>
              <input
                type="number"
                name="monthlyRevenue"
                value={formData.monthlyRevenue}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Renewal Date
                </div>
              </label>
              <input
                type="date"
                name="renewalDate"
                value={formData.renewalDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
              />
            </div>
          </div>
        </div>

        {/* Internal Notes */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Internal Notes</h2>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#E31C5F] text-white font-semibold py-3 rounded-xl hover:bg-[#C4184F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/super-admin/crm/mcs"
            className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-[1300] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-[0_20px_25px_rgba(0,0,0,0.15)]">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete MC Record?</h2>
            <p className="text-gray-600 mb-6">
              This will permanently delete {formData.name}&apos;s MC record. This action cannot be undone.
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
