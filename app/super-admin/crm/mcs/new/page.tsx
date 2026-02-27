'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, DollarSign, Calendar } from 'lucide-react';
import Link from 'next/link';
import CustomSelect from '@/components/CustomSelect';
import CustomDatePicker from '@/components/CustomDatePicker';

export default function NewMCPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    stage: 'prospect',
    listingStatus: 'free',
    monthlyRevenue: '',
    renewalDate: '',
    notes: '',
    linkAccount: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement API call to create MC
      console.log('Creating MC:', formData);

      // For now, just redirect back to MC list
      router.push('/super-admin/crm/mcs');
      router.refresh();
    } catch (error) {
      console.error('Error creating MC:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Add New MC</h1>
          <p className="text-gray-600 mt-1">Create a new MC record to begin outreach</p>
        </div>
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
                placeholder="e.g. James Brown"
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
                  placeholder="james@example.com"
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
                  placeholder="0412 345 678"
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
            <CustomSelect
              label="MC Stage"
              value={formData.stage}
              onChange={(value) => handleChange({ target: { name: 'stage', value } } as any)}
              options={[
                { value: 'prospect', label: 'Prospect' },
                { value: 'trial', label: 'Trial' },
                { value: 'listed', label: 'Listed' },
                { value: 'active', label: 'Active' },
                { value: 'churned', label: 'Churned' },
              ]}
              required
            />

            <CustomSelect
              label="Listing Status"
              value={formData.listingStatus}
              onChange={(value) => handleChange({ target: { name: 'listingStatus', value } } as any)}
              options={[
                { value: 'free', label: 'Free' },
                { value: 'trial', label: 'Trial' },
                { value: 'paid', label: 'Paid' },
                { value: 'expired', label: 'Expired' },
                { value: 'rejected', label: 'Rejected' },
              ]}
              required
            />
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
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
              />
            </div>

            <div>
              <CustomDatePicker
                label="Renewal Date"
                value={formData.renewalDate}
                onChange={(value) => handleChange({ target: { name: 'renewalDate', value } } as any)}
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
            placeholder="Add any internal notes about this MC..."
            rows={4}
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
          />
        </div>

        {/* Account Linking */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Linking</h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="linkAccount"
              checked={formData.linkAccount}
              onChange={handleChange}
              className="w-4 h-4 rounded border border-gray-300 text-[#E31C5F] focus:ring-[#E31C5F]"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Link existing WedList account</p>
              <p className="text-xs text-gray-500 mt-0.5">If this MC already has a WedList account, you can link it here</p>
            </div>
          </label>

          {formData.linkAccount && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <CustomSelect
                label="Select Account"
                value=""
                onChange={() => {}}
                placeholder="Choose an MC account..."
                options={[
                  /* TODO: Load existing MC accounts from database */
                ]}
              />
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#E31C5F] text-white font-semibold py-3 rounded-xl hover:bg-[#C4184F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Create MC'}
          </button>
          <Link
            href="/super-admin/crm/mcs"
            className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
