'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MessageSquare, Trash2, CheckCircle2, AlertCircle, Briefcase, Calendar, Building2, Check, Link2, ChevronRight, DollarSign } from 'lucide-react';
import Link from 'next/link';
import CustomSelect from '@/components/CustomSelect';

const INQUIRY_STATUSES = {
  new: 'New Application',
  contacted: 'Contacted',
  qualified: 'Qualified',
  approved: 'Approved',
  rejected: 'Rejected',
};

const STATUS_COLORS = {
  new: 'bg-gray-100 text-gray-700',
  contacted: 'bg-blue-100 text-blue-700',
  qualified: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const VENDOR_TYPES = [
  'MC (Master of Ceremonies)',
  'Photographer',
  'Videographer',
  'DJ',
  'Florist',
  'Catering',
  'Venue',
  'Decoration',
  'Other',
];

const ONBOARDING_STEPS = [
  { key: 'new', label: 'Application', icon: AlertCircle },
  { key: 'contacted', label: 'Contacted', icon: Mail },
  { key: 'qualified', label: 'Review', icon: CheckCircle2 },
  { key: 'approved', label: 'Approved', icon: Check },
];

// Sample vendor inquiry
const SAMPLE_VENDOR_INQUIRY: {
  id: number;
  name: string;
  type: 'vendor';
  email: string;
  phone: string;
  vendorType: string;
  status: 'new' | 'contacted' | 'qualified' | 'approved' | 'rejected';
  source: string;
  message: string;
  created: string;
  onboardingNotes: string;
  portfolio: string;
  yearsExperience: number;
  serviceArea: string;
  basePrice: string;
} = {
  id: 2,
  name: 'Sarah Photography Studio',
  type: 'vendor',
  email: 'info@sarahphoto.com',
  phone: '0412 345 679',
  vendorType: 'photographer',
  status: 'contacted',
  source: 'referral',
  message: 'Interested in partnering with WedList for photographer referrals. 15+ years experience.',
  created: '2025-02-20',
  onboardingNotes: 'Pending portfolio review',
  portfolio: 'https://sarahphoto.com/portfolio',
  yearsExperience: 15,
  serviceArea: 'Sydney & surroundings',
  basePrice: '$1500-2500',
};

export default function VendorInquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = params.inquiryId as string;

  const [inquiry, setInquiry] = useState(SAMPLE_VENDOR_INQUIRY);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [onboardingNotes, setOnboardingNotes] = useState(inquiry.onboardingNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setInquiry(prev => ({ ...prev, status: newStatus as any }));
    setIsEditingStatus(false);
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      setInquiry(prev => ({
        ...prev,
        status: 'approved',
        onboardingNotes,
      }));
    } catch (error) {
      console.error('Error approving vendor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      setInquiry(prev => ({ ...prev, status: 'rejected' }));
    } catch (error) {
      console.error('Error rejecting vendor:', error);
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
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm">
        <Link href="/super-admin/inquiries" className="text-gray-500 hover:text-gray-900 transition-colors duration-200">Inquiries</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium">Vendor Application</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-4xl font-bold font-display text-gray-900 tracking-tight">Vendor Application</h1>
            <p className="text-gray-600 mt-1">Review and onboard vendor</p>
          </div>
        </div>

        <button
          onClick={() => setShowDeleteDialog(true)}
          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          title="Delete inquiry"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Vendor Header Card */}
      <div className="bg-gradient-to-br from-white via-white to-rose-50/30 rounded-2xl p-8 shadow-[0_2px_12px_rgba(227,28,95,0.12)] border border-rose-100/50">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold font-display text-gray-900">{inquiry.name}</h2>
            <p className="text-gray-600 mt-1">Vendor Application • Applied {new Date(inquiry.created).toLocaleDateString('en-AU')}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[inquiry.status as keyof typeof STATUS_COLORS]}`}>
            {INQUIRY_STATUSES[inquiry.status as keyof typeof INQUIRY_STATUSES]}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-rose-200 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-lg">
                <Briefcase className="w-4 h-4 text-[#E31C5F]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Service Type</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">{inquiry.vendorType}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-rose-200 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-lg">
                <Calendar className="w-4 h-4 text-[#E31C5F]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Experience</p>
                <p className="text-sm font-semibold text-gray-900">{inquiry.yearsExperience} years</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-rose-200 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-lg">
                <Building2 className="w-4 h-4 text-[#E31C5F]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Service Area</p>
                <p className="text-sm font-semibold text-gray-900">{inquiry.serviceArea}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-rose-200 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-lg">
                <DollarSign className="w-4 h-4 text-[#E31C5F]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Base Price</p>
                <p className="text-sm font-semibold text-gray-900">{inquiry.basePrice}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Progress */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Onboarding Workflow</h3>
        <div className="flex items-center justify-between">
          {ONBOARDING_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = ONBOARDING_STEPS.findIndex(s => s.key === inquiry.status) >= index;
            const isActive = step.key === inquiry.status;

            return (
              <div key={step.key} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#E31C5F] text-white shadow-[0_4px_12px_rgba(227,28,95,0.3)]'
                        : isCompleted
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <p className={`text-xs font-medium mt-2 ${isActive ? 'text-gray-900' : isCompleted ? 'text-green-700' : 'text-gray-500'}`}>
                    {step.label}
                  </p>
                </div>
                {index < ONBOARDING_STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 rounded-full mx-2 ${
                      isCompleted && ONBOARDING_STEPS.findIndex(s => s.key === inquiry.status) > index
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h2 className="text-lg font-semibold font-display text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#E31C5F]" />
              Contact Information
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Mail className="w-4 h-4 text-[#E31C5F]" />
                <span
                  className="text-[#E31C5F] hover:underline cursor-pointer font-medium"
                  onClick={() => window.location.href = `mailto:${inquiry.email}`}
                >
                  {inquiry.email}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <Phone className="w-4 h-4 text-[#E31C5F]" />
                <span
                  className="text-[#E31C5F] hover:underline cursor-pointer font-medium"
                  onClick={() => window.location.href = `tel:${inquiry.phone}`}
                >
                  {inquiry.phone}
                </span>
              </div>
              {inquiry.portfolio && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <Link2 className="w-4 h-4 text-[#E31C5F]" />
                  <a
                    href={inquiry.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#E31C5F] hover:underline cursor-pointer font-medium"
                  >
                    View Portfolio
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h2 className="text-lg font-semibold font-display text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Application Message
            </h2>

            <p className="text-gray-700 leading-relaxed">{inquiry.message}</p>
          </div>

          {/* Onboarding Notes */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h2 className="text-lg font-semibold font-display text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Onboarding Notes
            </h2>

            <div className="space-y-4">
              {/* Notes Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review & Notes
                </label>
                <textarea
                  value={onboardingNotes}
                  onChange={(e) => setOnboardingNotes(e.target.value)}
                  placeholder="Add notes about this vendor application... (portfolio quality, pricing, communication, etc.)"
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-colors duration-200 hover:shadow-[0_2px_12px_rgba(227,28,95,0.1)] focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
                >
                  <Check className="w-4 h-4" />
                  Approve Vendor
                </button>
                <button
                  onClick={handleReject}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Status</h3>

            {isEditingStatus ? (
              <CustomSelect
                value={inquiry.status}
                onChange={(value) => handleStatusChange(value)}
                options={Object.entries(INQUIRY_STATUSES).map(([key, label]) => ({
                  value: key,
                  label: label,
                }))}
              />
            ) : (
              <button
                onClick={() => setIsEditingStatus(true)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold text-center transition-[box-shadow] duration-200 hover:shadow-[0_2px_8px_rgba(227,28,95,0.12)] ${STATUS_COLORS[inquiry.status as keyof typeof STATUS_COLORS]}`}
              >
                {INQUIRY_STATUSES[inquiry.status as keyof typeof INQUIRY_STATUSES]}
              </button>
            )}
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Details</h3>

            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Vendor Type</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{inquiry.vendorType}</p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Source</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{inquiry.source}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Applied</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(inquiry.created).toLocaleDateString('en-AU')}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Quick Actions</h3>

            <div className="space-y-2">
              <a
                href={`mailto:${inquiry.email}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E31C5F] text-white font-semibold hover:bg-[#C4184F] transition-colors duration-200 text-sm shadow-[0_4px_12px_rgba(227,28,95,0.3)]"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
              <a
                href={`tel:${inquiry.phone}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-[1300] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h2 className="text-xl font-bold font-display text-gray-900 mb-2">Delete Application?</h2>
            <p className="text-gray-600 mb-6">
              This will permanently delete this vendor application. This action cannot be undone.
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
