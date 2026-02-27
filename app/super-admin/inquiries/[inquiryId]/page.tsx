'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Mail, Phone, Calendar, User, MessageSquare, Send, Trash2, CheckCircle2, AlertCircle, Flag } from 'lucide-react';
import Link from 'next/link';

const INQUIRY_STATUSES = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  lost: 'Lost',
  closed: 'Closed',
};

const STATUS_COLORS = {
  new: 'bg-gray-100 text-gray-700',
  contacted: 'bg-blue-100 text-blue-700',
  qualified: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
  closed: 'bg-gray-200 text-gray-700',
};

// Sample couple inquiry for qualification workflow
const SAMPLE_INQUIRY = {
  id: 1,
  name: 'John & Jane Smith',
  type: 'couple' as const,
  email: 'john@example.com',
  phone: '0412 345 678',
  eventDate: '2025-06-15',
  venue: 'The Rocks, Sydney',
  guestCount: 150,
  status: 'new' as const,
  source: 'website',
  message: 'We are looking for an MC for our wedding in June 2025. Professional with great testimonials.',
  created: '2025-02-25',
  category: 'MC',
  qualificationNotes: '',
  vendorsMatched: [] as number[],
  budget: '$1000-1500',
};

// Available MCs in the system
const AVAILABLE_VENDORS = [
  { id: 6, name: 'James Brown', category: 'MC', rating: 4.9, reviews: 24, status: 'paid' },
  { id: 7, name: 'Victoria Smith', category: 'MC', rating: 5.0, reviews: 18, status: 'paid' },
  { id: 8, name: 'Robert Taylor', category: 'MC', rating: 4.8, reviews: 15, status: 'paid' },
];

export default function InquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = params.inquiryId as string;

  const [inquiry, setInquiry] = useState(SAMPLE_INQUIRY);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [qualificationNotes, setQualificationNotes] = useState(inquiry.qualificationNotes);
  const [selectedVendors, setSelectedVendors] = useState<number[]>(inquiry.vendorsMatched);
  const [showEmailDraft, setShowEmailDraft] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setInquiry(prev => ({ ...prev, status: newStatus as any }));
    setIsEditingStatus(false);
  };

  const handleToggleVendor = (vendorId: number) => {
    setSelectedVendors(prev =>
      prev.includes(vendorId)
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleQualify = async () => {
    setIsSubmitting(true);
    try {
      // Update inquiry with notes and matched vendors
      setInquiry(prev => ({
        ...prev,
        status: 'qualified',
        qualificationNotes,
        vendorsMatched: selectedVendors,
      }));
      setIsEditingStatus(false);
    } catch (error) {
      console.error('Error qualifying inquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectLead = async () => {
    setIsSubmitting(true);
    try {
      setInquiry(prev => ({ ...prev, status: 'lost' }));
    } catch (error) {
      console.error('Error rejecting lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendToVendors = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Send inquiry to selected vendors
      console.log('Sending to vendors:', selectedVendors);
      alert(`Lead sent to ${selectedVendors.length} vendor(s)`);
    } catch (error) {
      console.error('Error sending to vendors:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      router.push('/super-admin/inquiries');
      router.refresh();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
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
            <h1 className="text-4xl font-bold text-gray-900">{inquiry.name}</h1>
            <p className="text-gray-600 mt-1">{inquiry.category} Inquiry from {new Date(inquiry.created).toLocaleDateString()}</p>
          </div>
        </div>

        <button
          onClick={() => setShowDeleteDialog(true)}
          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete inquiry"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span
                  className="text-[#E31C5F] hover:underline cursor-pointer"
                  onClick={() => window.location.href = `mailto:${inquiry.email}`}
                >
                  {inquiry.email}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span
                  className="text-[#E31C5F] hover:underline cursor-pointer"
                  onClick={() => window.location.href = `tel:${inquiry.phone}`}
                >
                  {inquiry.phone}
                </span>
              </div>
              {inquiry.type === 'couple' && (
                <>
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      {new Date(inquiry.eventDate).toLocaleDateString('en-AU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{inquiry.venue} ({inquiry.guestCount} guests)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">Budget: {inquiry.budget}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Message
            </h2>

            <p className="text-gray-700 leading-relaxed">{inquiry.message}</p>
          </div>

          {/* Qualification Section (Couple Only) */}
          {inquiry.type === 'couple' && (
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Flag className="w-5 h-5" />
                Qualify & Match Vendors
              </h2>

              <div className="space-y-4">
                {/* Qualification Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualification Notes
                  </label>
                  <textarea
                    value={qualificationNotes}
                    onChange={(e) => setQualificationNotes(e.target.value)}
                    placeholder="Add notes about this lead... (budget fit, timing, requirements, etc.)"
                    rows={3}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
                  />
                </div>

                {/* Vendor Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Match to Vendors
                  </label>
                  <div className="space-y-2">
                    {AVAILABLE_VENDORS.map((vendor) => (
                      <div key={vendor.id} className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedVendors.includes(vendor.id)}
                          onChange={() => handleToggleVendor(vendor.id)}
                          className="w-4 h-4 rounded border-gray-300 text-[#E31C5F] focus:ring-[#E31C5F]"
                        />
                        <div className="ml-3 flex-1">
                          <p className="font-medium text-gray-900">{vendor.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>⭐ {vendor.rating} ({vendor.reviews} reviews)</span>
                            <span className="inline-block px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs">
                              {vendor.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleQualify}
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 text-white font-semibold py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Qualify Lead
                  </button>
                  <button
                    onClick={handleRejectLead}
                    disabled={isSubmitting}
                    className="flex-1 bg-red-50 text-red-700 font-semibold py-2.5 rounded-xl hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Reject Lead
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Send to Vendors (After Qualified) */}
          {inquiry.type === 'couple' && inquiry.status === 'qualified' && selectedVendors.length > 0 && (
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h2 className="text-lg font-semibold text-green-900 mb-4">Ready to Send</h2>
              <p className="text-sm text-green-700 mb-4">
                This lead is qualified and ready to be sent to {selectedVendors.length} vendor(s).
              </p>
              <button
                onClick={handleSendToVendors}
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send to Vendors'}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Status</h3>

            {isEditingStatus ? (
              <select
                value={inquiry.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                onBlur={() => setIsEditingStatus(false)}
                autoFocus
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {Object.entries(INQUIRY_STATUSES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            ) : (
              <button
                onClick={() => setIsEditingStatus(true)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-center ${STATUS_COLORS[inquiry.status as keyof typeof STATUS_COLORS]}`}
              >
                {INQUIRY_STATUSES[inquiry.status as keyof typeof INQUIRY_STATUSES]}
              </button>
            )}
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Details</h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Type</p>
                <p className="font-medium text-gray-900">{inquiry.category}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Source</p>
                <p className="font-medium text-gray-900 capitalize">{inquiry.source}</p>
              </div>
              {inquiry.status === 'qualified' && inquiry.vendorsMatched && (
                <div>
                  <p className="text-gray-500 mb-1">Matched Vendors</p>
                  <p className="font-medium text-gray-900">{inquiry.vendorsMatched.length}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Quick Actions</h3>

            <div className="space-y-2">
              <a
                href={`mailto:${inquiry.email}`}
                className="w-full block px-4 py-2.5 rounded-lg bg-[#E31C5F] text-white font-medium hover:bg-[#C4184F] transition-colors text-center text-sm"
              >
                Email
              </a>
              <a
                href={`tel:${inquiry.phone}`}
                className="w-full block px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-center text-sm"
              >
                Call
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-[1300] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-[0_20px_25px_rgba(0,0,0,0.15)]">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Inquiry?</h2>
            <p className="text-gray-600 mb-6">
              This will permanently delete this inquiry. This action cannot be undone.
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
