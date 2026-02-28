'use client';

import Link from 'next/link';
import {
  BarChart3,
  Users,
  TrendingUp,
  AlertCircle,
  Calendar,
  ArrowRight,
} from 'lucide-react';

const SAMPLE_KPI_DATA = {
  totalMCs: 24,
  activeListing: 18,
  monthlyRevenue: 4500,
  churnedThisMonth: 2,
  upcomingRenewals: 5,
};

const SAMPLE_ACTIVITIES = [
  {
    id: 1,
    type: 'mc_added',
    message: 'New MC "Sarah Johnson" added to CRM',
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    type: 'stage_moved',
    message: '"Marcus Chen" moved to Active stage',
    timestamp: '5 hours ago',
  },
  {
    id: 3,
    type: 'inquiry',
    message: 'New inquiry from "John & Jane Smith"',
    timestamp: '1 day ago',
  },
  {
    id: 4,
    type: 'blog_published',
    message: '"5 Tips for Wedding Planning" published',
    timestamp: '2 days ago',
  },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold font-display text-gray-900 tracking-tight mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back. Here&apos;s what&apos;s happening with your business.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total MCs */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] hover:shadow-[0_8px_20px_rgba(227,28,95,0.15)] transition-shadow duration-200 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Total MCs</p>
          <p className="text-3xl font-bold text-gray-900">{SAMPLE_KPI_DATA.totalMCs}</p>
          <p className="text-xs text-gray-500 mt-3">Across all stages</p>
        </div>

        {/* Active Listings */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] hover:shadow-[0_8px_20px_rgba(227,28,95,0.15)] transition-shadow duration-200 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Active Listings</p>
          <p className="text-3xl font-bold text-gray-900">{SAMPLE_KPI_DATA.activeListing}</p>
          <p className="text-xs text-gray-500 mt-3">Listed + Paid</p>
        </div>

        {/* Monthly Revenue */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] hover:shadow-[0_8px_20px_rgba(227,28,95,0.15)] transition-shadow duration-200 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Monthly Revenue</p>
          <p className="text-3xl font-bold text-gray-900">${SAMPLE_KPI_DATA.monthlyRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-3">Current MRR</p>
        </div>

        {/* Churned This Month */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] hover:shadow-[0_8px_20px_rgba(227,28,95,0.15)] transition-shadow duration-200 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Churned This Month</p>
          <p className="text-3xl font-bold text-gray-900">{SAMPLE_KPI_DATA.churnedThisMonth}</p>
          <p className="text-xs text-gray-500 mt-3">Inactive or cancelled</p>
        </div>

        {/* Upcoming Renewals */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] hover:shadow-[0_8px_20px_rgba(227,28,95,0.15)] transition-shadow duration-200 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Upcoming Renewals</p>
          <p className="text-3xl font-bold text-gray-900">{SAMPLE_KPI_DATA.upcomingRenewals}</p>
          <p className="text-xs text-gray-500 mt-3">Next 7 days</p>
        </div>
      </div>

      {/* Quick Actions & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] lg:col-span-1">
          <h2 className="text-lg font-bold font-display text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/super-admin/crm/mcs"
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-rose-50 transition-colors group"
            >
              <span className="text-sm font-medium text-gray-900 group-hover:text-[#E31C5F]">Browse MC Pipeline</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#E31C5F] transition-colors" />
            </Link>
            <Link
              href="/super-admin/inquiries"
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-rose-50 transition-colors group"
            >
              <span className="text-sm font-medium text-gray-900 group-hover:text-[#E31C5F]">View Inquiries</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#E31C5F] transition-colors" />
            </Link>
            <Link
              href="/super-admin/blog"
              className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-rose-50 transition-colors group"
            >
              <span className="text-sm font-medium text-gray-900 group-hover:text-[#E31C5F]">Manage Blog</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#E31C5F] transition-colors" />
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)] lg:col-span-2">
          <h2 className="text-lg font-bold font-display text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {SAMPLE_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-[#E31C5F] mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
