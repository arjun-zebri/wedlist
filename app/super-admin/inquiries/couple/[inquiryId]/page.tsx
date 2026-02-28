'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Mail, Phone, Calendar, Users, MessageSquare, Send, Trash2, CheckCircle2, AlertCircle, Flag, MapPin, DollarSign, TrendingUp, Check, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import CustomSelect from '@/components/CustomSelect';

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

const WORKFLOW_STEPS = [
  { key: 'new', label: 'New', icon: AlertCircle },
  { key: 'contacted', label: 'Contacted', icon: Mail },
  { key: 'qualified', label: 'Qualified', icon: CheckCircle2 },
  { key: 'closed', label: 'Closed', icon: Check },
];

// Sample couple inquiry for qualification workflow
const SAMPLE_INQUIRY: {
  id: number;
  name: string;
  type: 'couple';
  email: string;
  phone: string;
  eventDate: string;
  venue: string;
  guestCount: number;
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'closed';
  source: string;
  message: string;
  created: string;
  category: string;
  qualificationNotes: string;
  vendorsMatched: number[];
  budget: string;
} = {
  id: 1,
  name: 'John & Jane Smith',
  type: 'couple',
  email: 'john@example.com',
  phone: '0412 345 678',
  eventDate: '2025-06-15',
  venue: 'The Rocks, Sydney',
  guestCount: 150,
  status: 'new',
  source: 'website',
  message: 'We are looking for an MC for our wedding in June 2025. Professional with great testimonials.',
  created: '2025-02-25',
  category: 'MC',
  qualificationNotes: '',
  vendorsMatched: [],
  budget: '$1000-1500',
};

// Available MCs in the system
const AVAILABLE_VENDORS = [
  { id: 6, name: 'James Brown', category: 'MC', rating: 4.9, reviews: 24, status: 'paid' },
  { id: 7, name: 'Victoria Smith', category: 'MC', rating: 5.0, reviews: 18, status: 'paid' },
  { id: 8, name: 'Robert Taylor', category: 'MC', rating: 4.8, reviews: 15, status: 'paid' },
];

export default function CoupleInquiryDetailPage() {
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

  const currentStepIndex = WORKFLOW_STEPS.findIndex(step => step.key === inquiry.status);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm">
        <Link href="/super-admin/inquiries" className="text-gray-500 hover:text-gray-900 transition-colors duration-200">Inquiries</Link>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium">Couple Inquiry</span>
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
            <h1 className="text-4xl font-bold font-display text-gray-900 tracking-tight">Couple Inquiry</h1>
            <p className="text-gray-600 mt-1">Qualify and match to vendors</p>
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

      {/* Event Details Hero Card */}
      <div className="bg-gradient-to-br from-white via-white to-rose-50/30 rounded-2xl p-8 shadow-[0_2px_12px_rgba(227,28,95,0.12)] border border-rose-100/50">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold font-display text-gray-900">{inquiry.name}</h2>
            <p className="text-gray-600 mt-1">Wedding Inquiry • Added {new Date(inquiry.created).toLocaleDateString('en-AU')}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[inquiry.status as keyof typeof STATUS_COLORS]}`}>
            {INQUIRY_STATUSES[inquiry.status as keyof typeof INQUIRY_STATUSES]}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-rose-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-lg">
                <Calendar className="w-4 h-4 text-[#E31C5F]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Event Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(inquiry.eventDate).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-rose-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-lg">
                <MapPin className="w-4 h-4 text-[#E31C5F]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Venue</p>
                <p className="text-sm font-semibold text-gray-900">{inquiry.venue}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-rose-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-lg">
                <Users className="w-4 h-4 text-[#E31C5F]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Guests</p>
                <p className="text-sm font-semibold text-gray-900">{inquiry.guestCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100 hover:border-rose-200 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-lg">
                <DollarSign className="w-4 h-4 text-[#E31C5F]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Budget</p>
                <p className="text-sm font-semibold text-gray-900">{inquiry.budget}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Qualification Workflow</h3>
        <div className="flex items-center justify-between">
          {WORKFLOW_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = WORKFLOW_STEPS.findIndex(s => s.key === inquiry.status) >= index;
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
                {index < WORKFLOW_STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 rounded-full mx-2 ${
                      isCompleted && WORKFLOW_STEPS.findIndex(s => s.key === inquiry.status) > index
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
            </div>
          </div>

          {/* Message */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h2 className="text-lg font-semibold font-display text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Message
            </h2>

            <p className="text-gray-700 leading-relaxed">{inquiry.message}</p>
          </div>

          {/* Qualification Section */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h2 className="text-lg font-semibold font-display text-gray-900 mb-4 flex items-center gap-2">
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm transition-colors duration-200 hover:shadow-[0_2px_12px_rgba(227,28,95,0.1)] focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
                />
              </div>

              {/* Vendor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Match to Vendors ({selectedVendors.length} selected)
                </label>
                <div className="space-y-3">
                  {AVAILABLE_VENDORS.map((vendor) => {
                    const isSelected = selectedVendors.includes(vendor.id);
                    return (
                      <div
                        key={vendor.id}
                        onClick={() => handleToggleVendor(vendor.id)}
                        className={`relative p-4 rounded-xl cursor-pointer transition-[border-color,box-shadow,background-color] duration-200 border-2 ${
                          isSelected
                            ? 'bg-rose-50 border-[#E31C5F] shadow-[0_4px_12px_rgba(227,28,95,0.15)]'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                            isSelected
                              ? 'bg-[#E31C5F] border-[#E31C5F]'
                              : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold text-sm transition-colors ${isSelected ? 'text-[#E31C5F]' : 'text-gray-900'}`}>
                              {vendor.name}
                            </p>
                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-semibold text-amber-600">★ {vendor.rating}</span>
                                <span className="text-xs text-gray-500">({vendor.reviews})</span>
                              </div>
                              <div className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                                vendor.status === 'paid'
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {vendor.status === 'paid' ? '✓ Active' : 'Pending'}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="text-[#E31C5F] flex-shrink-0">
                              <Check className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleQualify}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#E31C5F] text-white font-semibold py-3 rounded-xl hover:bg-[#C4184F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(227,28,95,0.3)] hover:shadow-[0_6px_16px_rgba(227,28,95,0.4)]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Qualify Lead
                </button>
                <button
                  onClick={handleRejectLead}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>

          {/* Send to Vendors (After Qualified) */}
          {inquiry.status === 'qualified' && selectedVendors.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-[0_4px_12px_rgba(34,197,94,0.15)]">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2.5 bg-green-100 rounded-lg">
                  <Send className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold font-display text-green-900">Ready to Send</h2>
                  <p className="text-sm text-green-700 mt-1">
                    This lead is qualified and ready to be sent to <strong>{selectedVendors.length}</strong> vendor{selectedVendors.length !== 1 ? 's' : ''}.
                  </p>
                </div>
              </div>
              <button
                onClick={handleSendToVendors}
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
              >
                {isSubmitting ? 'Sending...' : 'Send to Vendors'}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Current Status</h3>

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

          {/* Quick Details */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Details</h3>

            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Category</p>
                <p className="text-sm font-medium text-gray-900">{inquiry.category}</p>
              </div>
              <div className="border-b border-gray-100 pb-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Source</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{inquiry.source}</p>
              </div>
              {inquiry.status === 'qualified' && inquiry.vendorsMatched && inquiry.vendorsMatched.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Matched Vendors</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-[#E31C5F] text-white text-xs font-bold rounded-full">
                      {inquiry.vendorsMatched.length}
                    </span>
                    <p className="text-sm font-medium text-gray-600">
                      {inquiry.vendorsMatched.length} vendor{inquiry.vendorsMatched.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Quick Actions</h3>

            <div className="space-y-2">
              <a
                href={`mailto:${inquiry.email}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E31C5F] text-white font-semibold hover:bg-[#C4184F] transition-colors text-sm shadow-[0_4px_12px_rgba(227,28,95,0.3)]"
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
            <h2 className="text-xl font-bold font-display text-gray-900 mb-2">Delete Inquiry?</h2>
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
