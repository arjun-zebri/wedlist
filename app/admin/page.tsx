"use client";

import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface DashboardStats {
  totalMCs: number;
  totalInquiries: number;
  avgRating: number;
}

interface Inquiry {
  id: string;
  couple_name: string;
  couple_email: string;
  created_at: string;
  mc_profiles?: {
    name: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMCs: 0,
    totalInquiries: 0,
    avgRating: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch stats
        const [mcsResult, inquiriesResult, reviewsResult] = await Promise.all([
          supabaseAdmin
            .from("mc_profiles")
            .select("id", { count: "exact", head: true }),
          supabaseAdmin
            .from("contact_inquiries")
            .select("id", { count: "exact", head: true }),
          supabaseAdmin.from("google_reviews").select("rating"),
        ]);

        const totalMCs = mcsResult.count || 0;
        const totalInquiries = inquiriesResult.count || 0;
        const reviews = reviewsResult.data || [];
        const avgRating =
          reviews.length > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            : 0;

        setStats({ totalMCs, totalInquiries, avgRating });

        // Fetch recent inquiries
        const { data: inquiries } = await supabaseAdmin
          .from("contact_inquiries")
          .select("*, mc_profiles(name)")
          .order("created_at", { ascending: false })
          .limit(5);

        setRecentInquiries(inquiries || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Overview of your WedList platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Total MCs</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats.totalMCs}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats.totalInquiries}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Average Rating</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "N/A"}
          </p>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Inquiries
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentInquiries.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-500">
              No inquiries yet
            </div>
          ) : (
            recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {inquiry.couple_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {inquiry.couple_email}
                    </p>
                    {inquiry.mc_profiles && (
                      <p className="text-sm text-gray-500">
                        Interested in: {inquiry.mc_profiles.name}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(inquiry.created_at).toLocaleDateString("en-AU")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <a
          href="/admin/mcs/new"
          className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-12 text-center hover:border-gray-400"
        >
          <div>
            <p className="text-lg font-medium text-gray-900">Add New MC</p>
            <p className="mt-1 text-sm text-gray-600">
              Create a new MC profile
            </p>
          </div>
        </a>
        <a
          href="/admin/blog/new"
          className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white px-6 py-12 text-center hover:border-gray-400"
        >
          <div>
            <p className="text-lg font-medium text-gray-900">
              Create Blog Post
            </p>
            <p className="mt-1 text-sm text-gray-600">Write a new article</p>
          </div>
        </a>
      </div>
    </div>
  );
}
