"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Plus,
  ExternalLink,
  Pencil,
  Trash2,
  Star,
  Search,
  Users,
} from "lucide-react";

interface MC {
  id: string;
  name: string;
  slug: string;
  email: string;
  featured: boolean;
  created_at: string;
}

export default function MCsPage() {
  const [mcs, setMcs] = useState<MC[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchMCs();
  }, []);

  async function fetchMCs() {
    try {
      const { data } = await supabase
        .from("mc_profiles")
        .select("id, name, slug, email, featured, created_at")
        .order("created_at", { ascending: false });

      setMcs(data || []);
    } catch (error) {
      console.error("Error fetching MCs:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteMC(id: string, name: string) {
    if (
      !confirm(
        `Are you sure you want to delete ${name}? This will also delete all their packages, photos, videos, and reviews. This action cannot be undone.`,
      )
    ) {
      return;
    }

    setDeleting(id);
    try {
      await supabase.from("mc_photos").delete().eq("mc_id", id);
      await supabase.from("mc_videos").delete().eq("mc_id", id);
      await supabase.from("mc_packages").delete().eq("mc_id", id);
      await supabase.from("mc_additional_info").delete().eq("mc_id", id);
      await supabase.from("google_reviews").delete().eq("mc_id", id);
      await supabase.from("contact_inquiries").delete().eq("mc_id", id);

      const { error } = await supabase
        .from("mc_profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setMcs(mcs.filter((mc) => mc.id !== id));
    } catch (error: any) {
      console.error("Error deleting MC:", error);
      alert("Failed to delete MC: " + error.message);
    } finally {
      setDeleting(null);
    }
  }

  const filteredMCs = searchQuery
    ? mcs.filter(
        (mc) =>
          mc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mc.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mcs;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-40 bg-gray-200 rounded-lg"></div>
        <div className="h-12 bg-gray-200 rounded-xl"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-white rounded-xl border border-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">Wedding MCs</h1>
          <p className="mt-1 text-sm text-gray-500">
            {mcs.length} {mcs.length === 1 ? "profile" : "profiles"} total
          </p>
        </div>
        <Link
          href="/admin/mcs/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#E31C5F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#C4184F] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New MC
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20 transition-all"
        />
      </div>

      {/* MC Cards List */}
      {filteredMCs.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-base font-medium text-gray-900">
            {searchQuery ? "No MCs match your search" : "No MCs yet"}
          </p>
          <p className="mt-1.5 text-sm text-gray-500">
            {searchQuery ? "Try a different search term" : "Add your first MC to get started"}
          </p>
          {!searchQuery && (
            <Link
              href="/admin/mcs/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#E31C5F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#C4184F] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add New MC
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMCs.map((mc) => (
            <div
              key={mc.id}
              className="group flex items-center justify-between gap-4 rounded-2xl bg-white p-4 sm:p-5 border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(227,28,95,0.06)] transition-shadow duration-200"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#E31C5F]">
                    {mc.name[0]}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm truncate">{mc.name}</p>
                    {mc.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-[#E31C5F]/10 px-2 py-0.5 text-[10px] font-semibold text-[#E31C5F]">
                        <Star className="h-2.5 w-2.5 fill-[#E31C5F]" />
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{mc.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Link
                  href={`/mc/${mc.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  title="View profile"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href={`/admin/mcs/${mc.slug}/edit`}
                  className="p-2 rounded-lg text-gray-400 hover:text-[#E31C5F] hover:bg-rose-50 transition-colors"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => deleteMC(mc.id, mc.name)}
                  disabled={deleting === mc.id}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
