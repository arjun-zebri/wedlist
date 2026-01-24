"use client";

import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";

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
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Inquiries</h1>
        <p className="mt-2 text-sm text-gray-600">
          View all wedding MC inquiries from couples
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Inquiries List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                <p className="text-sm text-gray-500">No inquiries yet</p>
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  onClick={() => setSelectedInquiry(inquiry)}
                  className={`cursor-pointer rounded-lg border bg-white p-4 transition-shadow hover:shadow-md ${
                    selectedInquiry?.id === inquiry.id
                      ? "border-gray-900 ring-2 ring-gray-900"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {inquiry.couple_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {inquiry.couple_email}
                      </p>
                      {inquiry.mc_profiles && (
                        <p className="mt-1 text-sm text-gray-500">
                          Interested in: {inquiry.mc_profiles.name}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(inquiry.created_at).toLocaleDateString("en-AU")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Inquiry Details */}
        <div className="lg:col-span-1">
          {selectedInquiry ? (
            <div className="sticky top-8 rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Inquiry Details
              </h3>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedInquiry.couple_name}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    <a
                      href={`mailto:${selectedInquiry.couple_email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedInquiry.couple_email}
                    </a>
                  </p>
                </div>

                {selectedInquiry.couple_phone && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Phone
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      <a
                        href={`tel:${selectedInquiry.couple_phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedInquiry.couple_phone}
                      </a>
                    </p>
                  </div>
                )}

                {selectedInquiry.wedding_date && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Wedding Date
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(
                        selectedInquiry.wedding_date
                      ).toLocaleDateString("en-AU", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {selectedInquiry.venue && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Venue
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedInquiry.venue}
                    </p>
                  </div>
                )}

                {selectedInquiry.mc_profiles && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      MC Interest
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      <a
                        href={`/mc/${selectedInquiry.mc_profiles.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedInquiry.mc_profiles.name}
                      </a>
                    </p>
                  </div>
                )}

                {selectedInquiry.message && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Message
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedInquiry.message}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Received
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedInquiry.created_at).toLocaleString(
                      "en-AU"
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
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
