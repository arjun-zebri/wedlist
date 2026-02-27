'use client';

import { Mail, Phone, Calendar, User } from 'lucide-react';
import { useState } from 'react';

const INQUIRY_TYPES = {
  couple: 'Couple',
  vendor: 'Vendor',
};

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
const INQUIRIES = [
  {
    id: 1,
    name: 'John & Jane Smith',
    type: 'couple' as const,
    email: 'john@example.com',
    phone: '0412 345 678',
    eventDate: '2025-06-15',
    venue: 'The Rocks, Sydney',
    status: 'new' as const,
    message: 'We are looking for an MC for our wedding in June 2025. Would love to discuss availability and rates.',
    created: '2025-02-25',
  },
  {
    id: 2,
    name: 'Sarah Photography Studio',
    type: 'vendor' as const,
    email: 'info@sarahphoto.com',
    phone: '0412 345 679',
    vendorType: 'photographer',
    status: 'contacted' as const,
    message: 'Interested in partnering with WedList for photographer referrals.',
    created: '2025-02-20',
  },
  {
    id: 3,
    name: 'Michael & Rachel Lee',
    type: 'couple' as const,
    email: 'michael@example.com',
    phone: '0412 345 680',
    eventDate: '2025-05-10',
    venue: 'Taronga Park, Sydney',
    status: 'qualified' as const,
    message: 'Looking for an experienced MC for our intimate wedding ceremony.',
    created: '2025-02-18',
  },
];

export default function InquiriesPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredInquiries = INQUIRIES.filter((inquiry) => {
    if (selectedStatus && inquiry.status !== selectedStatus) return false;
    if (selectedType && inquiry.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Inquiries</h1>
        <p className="text-gray-600">Manage inquiries from couples and vendors</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
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
            Couples
          </button>
          <button
            onClick={() => setSelectedType('vendor')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedType === 'vendor' ? 'bg-[#E31C5F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vendors
          </button>
        </div>

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

      {/* Inquiries List */}
      <div className="space-y-3">
        {filteredInquiries.map((inquiry) => (
          <button
            key={inquiry.id}
            className="w-full rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(227,28,95,0.08)] hover:shadow-[0_6px_16px_rgba(227,28,95,0.15)] hover:-translate-y-0.5 transition-all text-left group border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              {/* Left side */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#E31C5F]">{inquiry.name}</h3>
                  <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[inquiry.status]}`}>
                    {INQUIRY_STATUSES[inquiry.status]}
                  </div>
                </div>

                <div className="space-y-1 text-sm mb-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${inquiry.email}`} className="hover:text-[#E31C5F]">
                      {inquiry.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a href={`tel:${inquiry.phone}`} className="hover:text-[#E31C5F]">
                      {inquiry.phone}
                    </a>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{inquiry.message}</p>

                {/* Event Details (Couple) or Vendor Type (Vendor) */}
                {inquiry.type === 'couple' && (
                  <div className="flex gap-4 mt-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(inquiry.eventDate).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {inquiry.venue}
                    </div>
                  </div>
                )}

                {inquiry.type === 'vendor' && 'vendorType' in inquiry && (
                  <div className="text-xs text-gray-500 mt-2">
                    <span className="inline-block bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                      {inquiry.vendorType}
                    </span>
                  </div>
                )}
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
                <span>{new Date(inquiry.created).toLocaleDateString()}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredInquiries.length === 0 && (
        <div className="rounded-2xl bg-white p-12 text-center shadow-[0_2px_8px_rgba(227,28,95,0.08)]">
          <p className="text-gray-500">No inquiries match your filters</p>
        </div>
      )}
    </div>
  );
}
