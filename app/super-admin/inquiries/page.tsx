'use client';

import { Mail, Phone, Calendar, User, AlertCircle, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

const INQUIRY_TYPES = {
  couple: 'Couple Inquiry',
  vendor: 'Vendor Registration',
} as const;

const INQUIRY_STATUSES = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  lost: 'Lost',
  closed: 'Closed',
} as const;

const STATUS_COLORS = {
  new: 'bg-gray-100 text-gray-700',
  contacted: 'bg-blue-100 text-blue-700',
  qualified: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
  closed: 'bg-gray-200 text-gray-700',
} as const;

type InquiryStatus = keyof typeof INQUIRY_STATUSES;

interface BaseInquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: InquiryStatus;
  source: string;
  message: string;
  created: string;
}

interface CoupleInquiry extends BaseInquiry {
  type: 'couple';
  eventDate: string;
  venue: string;
  guestCount: number;
  category: string;
  qualificationNotes: string;
  vendorsMatched: number[];
}

interface VendorInquiry extends BaseInquiry {
  type: 'vendor';
  vendorType: string;
  onboardingNotes: string;
}

type Inquiry = CoupleInquiry | VendorInquiry;

// Couple inquiries that need to be qualified and sent to vendors
// Vendor inquiries for onboarding/partnerships
const INQUIRIES: Inquiry[] = [
  {
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
  },
  {
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
  },
  {
    id: 3,
    name: 'Michael & Rachel Lee',
    type: 'couple',
    email: 'michael@example.com',
    phone: '0412 345 680',
    eventDate: '2025-05-10',
    venue: 'Taronga Park, Sydney',
    guestCount: 80,
    status: 'qualified',
    source: 'google',
    message: 'Looking for an experienced MC for our intimate wedding ceremony. Budget: $1000-1500.',
    created: '2025-02-18',
    category: 'MC',
    qualificationNotes: 'High quality lead, ready to send to top-rated MCs',
    vendorsMatched: [6],
  },
];

export default function InquiriesPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredInquiries = INQUIRIES.filter((inquiry) => {
    if (selectedStatus && inquiry.status !== selectedStatus) return false;
    if (selectedType && inquiry.type !== selectedType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        inquiry.name.toLowerCase().includes(query) ||
        inquiry.email.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Separate couple inquiries (need qualification) from vendor registrations
  const coupleInquiries = filteredInquiries.filter((i) => i.type === 'couple') as CoupleInquiry[];
  const vendorInquiries = filteredInquiries.filter((i) => i.type === 'vendor') as VendorInquiry[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Inquiries</h1>
        <p className="text-gray-600">Manage couple leads and vendor applications</p>
      </div>

      {/* Type Filters */}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase mb-3 tracking-wide">Type</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedType === null ? 'bg-[#E31C5F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setSelectedType('couple')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'couple' ? 'bg-[#E31C5F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Couple Leads
          </button>
          <button
            onClick={() => setSelectedType('vendor')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'vendor' ? 'bg-[#E31C5F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vendor Applications
          </button>
        </div>
      </div>

      {/* Status Filters */}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase mb-3 tracking-wide">Status</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedStatus(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedStatus === null ? 'bg-[#E31C5F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Statuses
          </button>
          {Object.entries(INQUIRY_STATUSES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedStatus(key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === key ? 'bg-[#E31C5F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
        />
      </div>

      {/* Couple Inquiries Section */}
      {(selectedType === null || selectedType === 'couple') && coupleInquiries.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              Couple Leads ({coupleInquiries.filter(i => i.status === 'new' || i.status === 'contacted').length} awaiting qualification)
            </h2>
          </div>

          {coupleInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="rounded-2xl bg-white shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100 overflow-hidden hover:shadow-[0_6px_16px_rgba(227,28,95,0.15)] transition-shadow"
            >
              {/* Card Header - Summary */}
              <button
                onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[inquiry.status]}`}>
                      {INQUIRY_STATUSES[inquiry.status]}
                    </span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {inquiry.category}
                    </span>
                  </div>

                  <div className="flex gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(inquiry.eventDate).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      {inquiry.venue}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {inquiry.guestCount} guests
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === inquiry.id ? 'rotate-90' : ''}`}
                />
              </button>

              {/* Expanded Details */}
              {expandedId === inquiry.id && (
                <div className="border-t border-gray-100 p-5 space-y-4 bg-gray-50/50">
                  {/* Contact Info */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Contact</p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span
                          className="text-blue-600 hover:underline cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${inquiry.email}`;
                          }}
                        >
                          {inquiry.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span
                          className="text-blue-600 hover:underline cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:${inquiry.phone}`;
                          }}
                        >
                          {inquiry.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Message</p>
                    <p className="text-sm text-gray-700">{inquiry.message}</p>
                  </div>

                  {/* Qualification Status */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Qualification Status</p>
                    <div className={`rounded-lg p-3 text-sm ${
                      inquiry.status === 'qualified'
                        ? 'bg-green-50 text-green-700'
                        : inquiry.status === 'lost'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {inquiry.status === 'new' && '🔄 Awaiting initial contact'}
                      {inquiry.status === 'contacted' && '📞 Contacted - awaiting qualification review'}
                      {inquiry.status === 'qualified' && `✓ Qualified - sent to ${inquiry.vendorsMatched?.length || 0} vendor(s)`}
                      {inquiry.status === 'lost' && '❌ Not qualified'}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/super-admin/inquiries/couple/${inquiry.id}`}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-[#E31C5F] text-white text-sm font-medium hover:bg-[#C4184F] transition-colors text-center"
                    >
                      View & Qualify
                    </Link>
                    {inquiry.status === 'qualified' && (
                      <button className="flex-1 px-4 py-2.5 rounded-lg border border-green-200 text-green-700 text-sm font-medium hover:bg-green-50 transition-colors">
                        Send to Vendor
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Vendor Inquiries Section */}
      {(selectedType === null || selectedType === 'vendor') && vendorInquiries.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              Vendor Applications ({vendorInquiries.length})
            </h2>
          </div>

          {vendorInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(227,28,95,0.08)] hover:shadow-[0_6px_16px_rgba(227,28,95,0.15)] hover:-translate-y-0.5 transition-all border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[inquiry.status]}`}>
                      {INQUIRY_STATUSES[inquiry.status]}
                    </span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                      {inquiry.vendorType}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm mb-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={(e) => {
                          window.location.href = `mailto:${inquiry.email}`;
                        }}
                      >
                        {inquiry.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={(e) => {
                          window.location.href = `tel:${inquiry.phone}`;
                        }}
                      >
                        {inquiry.phone}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600">{inquiry.message}</p>
                </div>

                <Link
                  href={`/super-admin/inquiries/vendor/${inquiry.id}`}
                  className="ml-4 p-2.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredInquiries.length === 0 && (
        <div className="rounded-2xl bg-white p-12 text-center shadow-[0_2px_8px_rgba(227,28,95,0.08)]">
          <p className="text-gray-500">No inquiries match your filters</p>
        </div>
      )}
    </div>
  );
}
