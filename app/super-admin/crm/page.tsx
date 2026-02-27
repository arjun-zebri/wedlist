'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Users, TrendingUp, AlertCircle } from 'lucide-react';

export default function CRMDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">MC CRM</h1>
        <p className="text-gray-600">Manage your MC pipeline and track business development.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Total MCs</p>
          <p className="text-3xl font-bold text-gray-900">24</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Active Listings</p>
          <p className="text-3xl font-bold text-gray-900">18</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Monthly Revenue</p>
          <p className="text-3xl font-bold text-gray-900">$4,500</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)]">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Churned This Month</p>
          <p className="text-3xl font-bold text-gray-900">2</p>
        </div>
      </div>

      {/* Actions & Links */}
      <div className="rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(227,28,95,0.08)]">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Pipeline Management</h2>
        <Link
          href="/super-admin/crm/mcs"
          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-rose-50 to-transparent hover:from-rose-100 transition-colors group"
        >
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-[#E31C5F]">View MC Pipeline</p>
            <p className="text-sm text-gray-600 mt-1">Kanban view of all MC stages (Prospect → Active → Churned)</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#E31C5F] transition-colors flex-shrink-0 ml-4" />
        </Link>
      </div>
    </div>
  );
}
