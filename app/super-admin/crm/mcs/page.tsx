'use client';

import Link from 'next/link';
import { Mail, Phone, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

const PIPELINE_STAGES = [
  'prospect',
  'trial',
  'listed',
  'active',
  'churned',
];

const STAGE_LABELS = {
  prospect: 'Prospect',
  trial: 'Trial',
  listed: 'Listed',
  active: 'Active',
  churned: 'Churned',
};

const STAGE_COLORS = {
  prospect: 'bg-gray-50',
  trial: 'bg-blue-50',
  listed: 'bg-amber-50',
  active: 'bg-green-50',
  churned: 'bg-red-50',
};

const STAGE_BADGE_COLORS = {
  prospect: 'bg-gray-100 text-gray-700',
  trial: 'bg-blue-100 text-blue-700',
  listed: 'bg-amber-100 text-amber-700',
  active: 'bg-green-100 text-green-700',
  churned: 'bg-red-100 text-red-700',
};

// Sample MC data
const MC_DATA = {
  prospect: [
    { id: 1, name: 'Emma Williams', email: 'emma@example.com', phone: '0412 345 678', mRR: null, status: 'free' },
    { id: 2, name: 'David Lee', email: 'david@example.com', phone: '0412 345 679', mRR: null, status: 'free' },
  ],
  trial: [
    { id: 3, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '0412 345 680', mRR: null, status: 'trial' },
  ],
  listed: [
    { id: 4, name: 'Marcus Chen', email: 'marcus@example.com', phone: '0412 345 681', mRR: 0, status: 'free' },
    { id: 5, name: 'Lisa Anderson', email: 'lisa@example.com', phone: '0412 345 682', mRR: 0, status: 'free' },
  ],
  active: [
    { id: 6, name: 'James Brown', email: 'james@example.com', phone: '0412 345 683', mRR: 150, status: 'paid' },
    { id: 7, name: 'Victoria Smith', email: 'victoria@example.com', phone: '0412 345 684', mRR: 200, status: 'paid' },
    { id: 8, name: 'Robert Taylor', email: 'robert@example.com', phone: '0412 345 685', mRR: 100, status: 'paid' },
  ],
  churned: [
    { id: 9, name: 'Michael Davis', email: 'michael@example.com', phone: '0412 345 686', mRR: 0, status: 'expired' },
  ],
};

interface MC {
  id: number;
  name: string;
  email: string;
  phone: string;
  mRR: number | null;
  status: string;
}

function MCCard({ mc, stage }: { mc: MC; stage: string }) {
  return (
    <Link href={`/super-admin/crm/mcs/${mc.id}`}>
      <div className="rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(227,28,95,0.08)] hover:shadow-[0_6px_16px_rgba(227,28,95,0.15)] hover:-translate-y-1 transition-all group cursor-pointer border border-gray-100">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate group-hover:text-[#E31C5F]">{mc.name}</p>
            <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${STAGE_BADGE_COLORS[stage as keyof typeof STAGE_BADGE_COLORS]}`}>
              {mc.status}
            </div>
          </div>
          <button className="p-1 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm mb-3">
          <div className="flex items-center gap-2 text-gray-600 truncate">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <a href={`mailto:${mc.email}`} className="truncate hover:text-[#E31C5F]">
              {mc.email}
            </a>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <a href={`tel:${mc.phone}`} className="hover:text-[#E31C5F]">
              {mc.phone}
            </a>
          </div>
        </div>

        {/* Footer */}
        {mc.mRR !== null && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Monthly Revenue</p>
            <p className="text-lg font-bold text-green-600">${mc.mRR}/mo</p>
          </div>
        )}
      </div>
    </Link>
  );
}

function KanbanColumn({ stage }: { stage: string }) {
  const mcs = MC_DATA[stage as keyof typeof MC_DATA] || [];

  return (
    <div className="flex flex-col gap-4">
      {/* Column Header */}
      <div className="sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 uppercase text-xs tracking-wide">
            {STAGE_LABELS[stage as keyof typeof STAGE_LABELS]}
          </h3>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {mcs.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      {mcs.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-sm text-gray-500">No MCs in this stage</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mcs.map((mc) => (
            <MCCard key={mc.id} mc={mc} stage={stage} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MCPipeline() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MC Pipeline</h1>
          <p className="text-gray-600">Manage your MC business development pipeline</p>
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')}
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {viewMode === 'kanban' ? 'List View' : 'Kanban View'}
        </button>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(5, minmax(340px, 1fr))' }}>
            {PIPELINE_STAGES.map((stage) => (
              <KanbanColumn key={stage} stage={stage} />
            ))}
          </div>
        </div>
      )}

      {/* List View Placeholder */}
      {viewMode === 'list' && (
        <div className="rounded-2xl bg-white p-8 shadow-[0_2px_8px_rgba(227,28,95,0.08)]">
          <p className="text-gray-500 text-center">List view coming soon</p>
        </div>
      )}
    </div>
  );
}
