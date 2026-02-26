"use client";

import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Clock,
  ExternalLink,
} from "lucide-react";

interface Inquiry {
  id: string;
  couple_name: string;
  couple_email: string;
  couple_phone: string | null;
  wedding_date: string | null;
  venue: string | null;
  message: string | null;
  created_at: string;
  mc_profiles?: {
    name: string;
    slug: string;
  };
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const { data } = await supabaseAdmin
          .from("contact_inquiries")
          .select("*, mc_profiles(name, slug)")
          .order("created_at", { ascending: false });

        setInquiries(data || []);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInquiries();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-white rounded-2xl border border-gray-200"></div>
            ))}
          </div>
          <div className="h-64 bg-white rounded-2xl border border-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">Inquiries</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          {inquiries.length} {inquiries.length === 1 ? "inquiry" : "inquiries"} from couples
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Inquiries List */}
        <div className="lg:col-span-2 space-y-3">
          {inquiries.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-base font-medium text-gray-900">No inquiries yet</p>
              <p className="mt-1.5 text-sm text-gray-500">Inquiries from couples will appear here</p>
            </div>
          ) : (
            inquiries.map((inquiry) => (
              <button
                key={inquiry.id}
                onClick={() => setSelectedInquiry(inquiry)}
                className={`w-full text-left rounded-2xl bg-white p-5 border transition-all duration-200 ${
                  selectedInquiry?.id === inquiry.id
                    ? "border-[#E31C5F] shadow-[0_4px_16px_rgba(227,28,95,0.1)] ring-1 ring-[#E31C5F]/20"
                    : "border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(227,28,95,0.06)]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#E31C5F]">
                        {inquiry.couple_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{inquiry.couple_name}</p>
                      <p className="text-xs text-gray-500 truncate">{inquiry.couple_email}</p>
                      {inquiry.mc_profiles && (
                        <p className="text-xs text-[#E31C5F] mt-0.5 font-medium">
                          → {inquiry.mc_profiles.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
                    <Clock className="h-3 w-3" />
                    {new Date(inquiry.created_at).toLocaleDateString("en-AU", { month: "short", day: "numeric" })}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Inquiry Details Panel */}
        <div className="lg:col-span-1">
          {selectedInquiry ? (
            <div className="sticky top-24 rounded-2xl bg-white p-6 border border-gray-200 shadow-[0_4px_24px_rgba(227,28,95,0.06)]">
              <h3 className="text-base font-bold text-gray-900 font-display mb-5">
                Inquiry Details
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Name</p>
                    <p className="mt-0.5 text-sm font-medium text-gray-900">{selectedInquiry.couple_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</p>
                    <a
                      href={`mailto:${selectedInquiry.couple_email}`}
                      className="mt-0.5 text-sm font-medium text-[#E31C5F] hover:underline"
                    >
                      {selectedInquiry.couple_email}
                    </a>
                  </div>
                </div>

                {selectedInquiry.couple_phone && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</p>
                      <a href={`tel:${selectedInquiry.couple_phone}`} className="mt-0.5 text-sm font-medium text-[#E31C5F] hover:underline">
                        {selectedInquiry.couple_phone}
                      </a>
                    </div>
                  </div>
                )}

                {selectedInquiry.wedding_date && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Wedding Date</p>
                      <p className="mt-0.5 text-sm font-medium text-gray-900">
                        {new Date(selectedInquiry.wedding_date).toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                )}

                {selectedInquiry.venue && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Venue</p>
                      <p className="mt-0.5 text-sm font-medium text-gray-900">{selectedInquiry.venue}</p>
                    </div>
                  </div>
                )}

                {selectedInquiry.mc_profiles && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                      <ExternalLink className="h-4 w-4 text-[#E31C5F]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">MC Interest</p>
                      <a
                        href={`/mc/${selectedInquiry.mc_profiles.slug}`}
                        target="_blank"
                        className="mt-0.5 text-sm font-medium text-[#E31C5F] hover:underline"
                      >
                        {selectedInquiry.mc_profiles.name}
                      </a>
                    </div>
                  </div>
                )}

                {selectedInquiry.message && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Message</p>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4">
                      {selectedInquiry.message}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Received</p>
                  <p className="mt-0.5 text-sm text-gray-700">
                    {new Date(selectedInquiry.created_at).toLocaleString("en-AU")}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="sticky top-24 rounded-2xl bg-white p-8 border border-gray-200 text-center">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">
                Select an inquiry to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
