"use client";

import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Users,
  Search,
  AlertCircle,
  CheckCircle2,
  Plus,
  Sparkles,
  Clock,
  Heart,
  Building2,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const INQUIRY_STATUSES = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  lost: "Lost",
  closed: "Closed",
} as const;

const STATUS_COLORS = {
  new: "bg-gray-100 text-gray-700",
  contacted: "bg-blue-100 text-blue-700",
  qualified: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
  closed: "bg-gray-200 text-gray-700",
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
  type: "couple";
  eventDate: string;
  venue: string;
  guestCount: number;
  category: string;
  qualificationNotes: string;
  vendorsMatched: number[];
}

interface VendorInquiry extends BaseInquiry {
  type: "vendor";
  vendorType: string;
  onboardingNotes: string;
}

type Inquiry = CoupleInquiry | VendorInquiry;

const INQUIRIES: Inquiry[] = [
  {
    id: 1,
    name: "John & Jane Smith",
    type: "couple",
    email: "john@example.com",
    phone: "0412 345 678",
    eventDate: "2025-06-15",
    venue: "The Rocks, Sydney",
    guestCount: 150,
    status: "new",
    source: "website",
    message:
      "We are looking for an MC for our wedding in June 2025. Professional with great testimonials.",
    created: "2025-02-25",
    category: "MC",
    qualificationNotes: "",
    vendorsMatched: [],
  },
  {
    id: 2,
    name: "Sarah Photography Studio",
    type: "vendor",
    email: "info@sarahphoto.com",
    phone: "0412 345 679",
    vendorType: "photographer",
    status: "contacted",
    source: "referral",
    message:
      "Interested in partnering with WedList for photographer referrals. 15+ years experience.",
    created: "2025-02-20",
    onboardingNotes: "Pending portfolio review",
  },
  {
    id: 3,
    name: "Michael & Rachel Lee",
    type: "couple",
    email: "michael@example.com",
    phone: "0412 345 680",
    eventDate: "2025-05-10",
    venue: "Taronga Park, Sydney",
    guestCount: 80,
    status: "qualified",
    source: "google",
    message:
      "Looking for an experienced MC for our intimate wedding ceremony. Budget: $1000-1500.",
    created: "2025-02-18",
    category: "MC",
    qualificationNotes: "High quality lead, ready to send to top-rated MCs",
    vendorsMatched: [6],
  },
];

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return `${Math.floor(diff / 30)}mo ago`;
}

export default function InquiriesPage() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInquiries = INQUIRIES.filter((inquiry) => {
    if (selectedStatus && inquiry.status !== selectedStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        inquiry.name.toLowerCase().includes(query) ||
        inquiry.email.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Stats
  const totalInquiries = INQUIRIES.length;
  const coupleLeads = INQUIRIES.filter((i) => i.type === "couple").length;
  const vendorApps = INQUIRIES.filter((i) => i.type === "vendor").length;
  const newLeads = INQUIRIES.filter((i) => i.status === "new").length;

  // Separate couple inquiries (need qualification) from vendor registrations
  const coupleInquiries = filteredInquiries.filter(
    (i) => i.type === "couple"
  ) as CoupleInquiry[];
  const vendorInquiries = filteredInquiries.filter(
    (i) => i.type === "vendor"
  ) as VendorInquiry[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-4xl font-bold font-display text-gray-900 tracking-tight">Inquiries</h1>
            {newLeads > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E31C5F]/10 text-[#E31C5F] ring-1 ring-[#E31C5F]/20">
                <Sparkles className="w-3 h-3" />
                {newLeads} new
              </span>
            )}
          </div>
          <p className="text-gray-600">
            Manage couple leads and vendor applications
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E31C5F] text-white rounded-xl font-semibold hover:bg-[#C4184F] transition-colors duration-200 shadow-[0_2px_8px_rgba(227,28,95,0.25)]">
          <Plus className="w-4 h-4" />
          Add Inquiry
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(227,28,95,0.08)] border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-4 h-4 text-gray-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
              Total Inquiries
            </p>
          </div>
          <p className="text-lg font-bold text-gray-900 flex-shrink-0">
            {totalInquiries}
          </p>
        </div>

        <div className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(227,28,95,0.08)] border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-[#E31C5F]" />
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
              Couple Leads
            </p>
          </div>
          <p className="text-lg font-bold text-gray-900 flex-shrink-0">
            {coupleLeads}
          </p>
        </div>

        <div className="rounded-lg bg-white p-3 shadow-[0_1px_2px_rgba(227,28,95,0.08)] border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
              Vendor Apps
            </p>
          </div>
          <p className="text-lg font-bold text-gray-900 flex-shrink-0">
            {vendorApps}
          </p>
        </div>
      </div>

      {/* Toolbar: Search + Status Filters */}
      <div className="flex flex-col gap-3">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm transition-colors duration-200 hover:shadow-[0_2px_12px_rgba(227,28,95,0.1)] focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            onClick={() => setSelectedStatus(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedStatus === null
                ? "bg-[#E31C5F] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {Object.entries(INQUIRY_STATUSES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedStatus(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedStatus === key
                  ? "bg-[#E31C5F] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
          {selectedStatus && (
            <button
              onClick={() => setSelectedStatus(null)}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium ml-auto"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Couple Inquiries Section */}
        {
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Heart className="w-5 h-5 text-[#E31C5F] fill-[#E31C5F]" />
              <h2 className="font-semibold font-display text-gray-900 text-lg">
                Couple Leads
              </h2>
              {coupleInquiries.filter(
                (i) => i.status === "new" || i.status === "contacted"
              ).length > 0 && (
                <span className="text-xs text-gray-500 ml-auto">
                  {
                    coupleInquiries.filter(
                      (i) => i.status === "new" || i.status === "contacted"
                    ).length
                  }{" "}
                  awaiting
                </span>
              )}
            </div>

            {coupleInquiries.length > 0 ? (
              <div className="space-y-2">
                {coupleInquiries.map((inquiry) => (
                  <Link
                    key={inquiry.id}
                    href={`/super-admin/inquiries/couple/${inquiry.id}`}
                    className="group block rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100 hover:shadow-[0_4px_12px_rgba(227,28,95,0.15)] hover:-translate-y-0.5 transition-[transform,box-shadow] duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Name and Status Row */}
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-base group-hover:text-[#E31C5F] transition-colors">
                            {inquiry.name}
                          </h3>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_COLORS[inquiry.status]
                            }`}
                          >
                            {INQUIRY_STATUSES[inquiry.status]}
                          </span>
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {inquiry.category}
                          </span>
                        </div>

                        {/* Event Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600">
                              {new Date(inquiry.eventDate).toLocaleDateString(
                                "en-AU",
                                { month: "short", day: "numeric" }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600 truncate">
                              {inquiry.venue}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600">
                              {inquiry.guestCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600">
                              {timeAgo(inquiry.created)}
                            </span>
                          </div>
                        </div>

                        {/* Message Preview */}
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {inquiry.message}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-8 text-center shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
                <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No couple leads</p>
              </div>
            )}
          </div>
        }

        {/* Vendor Inquiries Section */}
        {
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Building2 className="w-5 h-5 text-green-600" />
              <h2 className="font-semibold font-display text-gray-900 text-lg">
                Vendor Applications
              </h2>
              <span className="text-xs text-gray-500 ml-auto">
                {vendorInquiries.length} total
              </span>
            </div>

            {vendorInquiries.length > 0 ? (
              <div className="space-y-2">
                {vendorInquiries.map((inquiry) => (
                  <Link
                    key={inquiry.id}
                    href={`/super-admin/inquiries/vendor/${inquiry.id}`}
                    className="group block rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100 hover:shadow-[0_4px_12px_rgba(227,28,95,0.15)] hover:-translate-y-0.5 transition-[transform,box-shadow] duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Name and Status Row */}
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <h3 className="font-semibold text-gray-900 text-base group-hover:text-[#E31C5F] transition-colors">
                            {inquiry.name}
                          </h3>
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_COLORS[inquiry.status]
                            }`}
                          >
                            {INQUIRY_STATUSES[inquiry.status]}
                          </span>
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 capitalize">
                            {inquiry.vendorType}
                          </span>
                        </div>

                        {/* Contact Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600 truncate">
                              {inquiry.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600">
                              {inquiry.phone}
                            </span>
                          </div>
                          <div className="col-span-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-600">
                              {timeAgo(inquiry.created)}
                            </span>
                          </div>
                        </div>

                        {/* Message Preview */}
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {inquiry.message}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-8 text-center shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
                <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No vendor applications</p>
              </div>
            )}
          </div>
        }
      </div>

      {/* Empty State - Show only when filtering produces no results */}
      {filteredInquiries.length === 0 && (
        <div className="rounded-2xl bg-white p-12 text-center shadow-[0_2px_8px_rgba(227,28,95,0.08)] border border-gray-100">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-gray-600 font-medium mb-2">No inquiries found</p>
          <p className="text-gray-500 text-sm">
            Try adjusting your filters or search criteria
          </p>
        </div>
      )}
    </div>
  );
}
