'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Mail, Phone, Calendar, User, MessageSquare, Send, Trash2 } from 'lucide-react';
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

// Sample inquiry data
const SAMPLE_INQUIRY = {
  id: 1,
  name: 'John & Jane Smith',
  type: 'couple' as const,
  email: 'john@example.com',
  phone: '0412 345 678',
  eventDate: '2025-06-15',
  venue: 'The Rocks, Sydney',
  status: 'new' as const,
  source: 'website',
  message: 'We are looking for an MC for our wedding in June 2025. Would love to discuss availability and rates.',
  created: '2025-02-25',
};

export default function InquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = params.inquiryId as string;

  const [inquiry, setInquiry] = useState(SAMPLE_INQUIRY);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEmailDraft, setShowEmailDraft] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setInquiry(prev => ({ ...prev, status: newStatus as any }));
    setIsEditingStatus(false);
    // TODO: Call API to update status
  };

  const handleSendEmail = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Call API to send email
      console.log('Sending email to', inquiry.email, emailDraft);
      setEmailDraft('');
      setShowEmailDraft(false);
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Call API to delete inquiry
      console.log('Deleting inquiry:', inquiryId);
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
            <p className="text-gray-600 mt-1">Inquiry from {new Date(inquiry.created).toLocaleDateString()}</p>
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
                <a href={`mailto:${inquiry.email}`} className="text-[#E31C5F] hover:underline">
                  {inquiry.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${inquiry.phone}`} className="text-[#E31C5F] hover:underline">
                  {inquiry.phone}
                </a>
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
                    <span className="text-gray-700">{inquiry.venue}</span>
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

          {/* Email Draft */}
          {showEmailDraft && (
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Compose Email</h2>

              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-600">
                  <p className="font-medium mb-1">To:</p>
                  <p>{inquiry.email}</p>
                </div>

                <textarea
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  placeholder="Write your email response..."
                  rows={6}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleSendEmail}
                    disabled={isSubmitting || !emailDraft.trim()}
                    className="flex-1 bg-[#E31C5F] text-white font-semibold py-2.5 rounded-xl hover:bg-[#C4184F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Email
                  </button>
                  <button
                    onClick={() => {
                      setShowEmailDraft(false);
                      setEmailDraft('');
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
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

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Quick Actions</h3>

            <div className="space-y-2">
              <button
                onClick={() => setShowEmailDraft(!showEmailDraft)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#E31C5F] text-white font-medium hover:bg-[#C4184F] transition-colors text-sm"
              >
                {showEmailDraft ? 'Hide Email' : 'Send Email'}
              </button>
              <a
                href={`mailto:${inquiry.email}`}
                className="w-full block px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm text-center"
              >
                Email Client
              </a>
              <a
                href={`tel:${inquiry.phone}`}
                className="w-full block px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm text-center"
              >
                Call Client
              </a>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Details</h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Type</p>
                <p className="font-medium text-gray-900 capitalize">{inquiry.type}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Source</p>
                <p className="font-medium text-gray-900 capitalize">{inquiry.source}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Received</p>
                <p className="font-medium text-gray-900">{new Date(inquiry.created).toLocaleDateString()}</p>
              </div>
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
