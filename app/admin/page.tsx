"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Star,
  TrendingUp,
  Plus,
  FileText,
  ArrowRight,
  Clock,
} from "lucide-react";

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
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      try {
        const [mcsResult, inquiriesResult, reviewsResult] = await Promise.all([
          supabase
            .from("mc_profiles")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("contact_inquiries")
            .select("id", { count: "exact", head: true }),
          supabase.from("google_reviews").select("rating"),
        ]);

        const totalMCs = mcsResult.count || 0;
        const totalInquiries = inquiriesResult.count || 0;
        const reviews = reviewsResult.data || [];
        const avgRating =
          reviews.length > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            : 0;

        setStats({ totalMCs, totalInquiries, avgRating });

        const { data: inquiries } = await supabase
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
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-gray-200"></div>
          ))}
        </div>
        <div className="h-64 bg-white rounded-2xl border border-gray-200"></div>
      </div>
    );
  }

  const STAT_CARDS = [
    {
      label: "Total MCs",
      value: stats.totalMCs,
      icon: Users,
      color: "text-[#E31C5F]",
      bg: "bg-rose-50",
      trend: "Active profiles",
    },
    {
      label: "Inquiries",
      value: stats.totalInquiries,
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "All time",
    },
    {
      label: "Avg Rating",
      value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "N/A",
      icon: Star,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "Across all MCs",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">Dashboard</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Welcome back. Here&apos;s an overview of your WedList platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        {STAT_CARDS.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl bg-white p-6 border border-gray-200 shadow-[0_2px_8px_rgba(227,28,95,0.04)] hover:shadow-[0_8px_24px_rgba(227,28,95,0.08)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs text-gray-400">{stat.trend}</span>
                </div>
              </div>
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 shadow-[0_2px_8px_rgba(227,28,95,0.04)]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-50">
                <MessageSquare className="h-4 w-4 text-[#E31C5F]" />
              </div>
              <h2 className="text-base font-semibold text-gray-900">
                Recent Inquiries
              </h2>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-sm font-medium text-[#E31C5F] hover:text-[#C4184F] transition-colors flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentInquiries.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No inquiries yet</p>
              </div>
            ) : (
              recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center">
                        <span className="text-xs font-bold text-[#E31C5F]">
                          {inquiry.couple_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {inquiry.couple_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {inquiry.couple_email}
                        </p>
                        {inquiry.mc_profiles && (
                          <p className="text-xs text-[#E31C5F] mt-0.5">
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
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Quick Actions</h3>

          <Link
            href="/admin/mcs/new"
            className="group flex items-center gap-4 rounded-2xl bg-white p-5 border border-gray-200 shadow-[0_2px_8px_rgba(227,28,95,0.04)] hover:shadow-[0_8px_24px_rgba(227,28,95,0.08)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 group-hover:bg-[#E31C5F] transition-colors duration-200">
              <Plus className="h-5 w-5 text-[#E31C5F] group-hover:text-white transition-colors duration-200" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Add New MC</p>
              <p className="text-xs text-gray-500">Create a new profile</p>
            </div>
          </Link>

          <Link
            href="/admin/blog/new"
            className="group flex items-center gap-4 rounded-2xl bg-white p-5 border border-gray-200 shadow-[0_2px_8px_rgba(227,28,95,0.04)] hover:shadow-[0_8px_24px_rgba(227,28,95,0.08)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 group-hover:bg-blue-600 transition-colors duration-200">
              <FileText className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors duration-200" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Create Blog Post</p>
              <p className="text-xs text-gray-500">Write a new article</p>
            </div>
          </Link>

          <Link
            href="/admin/inquiries"
            className="group flex items-center gap-4 rounded-2xl bg-white p-5 border border-gray-200 shadow-[0_2px_8px_rgba(227,28,95,0.04)] hover:shadow-[0_8px_24px_rgba(227,28,95,0.08)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 group-hover:bg-amber-500 transition-colors duration-200">
              <MessageSquare className="h-5 w-5 text-amber-600 group-hover:text-white transition-colors duration-200" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">View Inquiries</p>
              <p className="text-xs text-gray-500">Manage couple messages</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
