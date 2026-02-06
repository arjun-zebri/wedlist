"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

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
      // Delete related records first (cascading delete should handle this if set up in DB, but doing it manually to be safe)
      await supabase.from("mc_photos").delete().eq("mc_id", id);
      await supabase.from("mc_videos").delete().eq("mc_id", id);
      await supabase.from("mc_packages").delete().eq("mc_id", id);
      await supabase.from("mc_additional_info").delete().eq("mc_id", id);
      await supabase.from("google_reviews").delete().eq("mc_id", id);
      await supabase.from("contact_inquiries").delete().eq("mc_id", id);

      // Delete the MC profile
      const { error } = await supabase
        .from("mc_profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Refresh the list
      setMcs(mcs.filter((mc) => mc.id !== id));
    } catch (error: any) {
      console.error("Error deleting MC:", error);
      alert("Failed to delete MC: " + error.message);
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wedding MCs</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage all wedding MC profiles
          </p>
        </div>
        <Link
          href="/admin/mcs/new"
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add New MC
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Featured
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {mcs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-gray-500"
                >
                  No MCs found. Add your first MC to get started.
                </td>
              </tr>
            ) : (
              mcs.map((mc) => (
                <tr key={mc.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {mc.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {mc.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {mc.slug}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                    {mc.featured ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Featured
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                        Not Featured
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <Link
                      href={`/mc/${mc.slug}`}
                      className="text-blue-600 hover:text-blue-900"
                      target="_blank"
                    >
                      View
                    </Link>
                    <span className="mx-2 text-gray-300">|</span>
                    <Link
                      href={`/admin/mcs/${mc.slug}/edit`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Edit
                    </Link>
                    <span className="mx-2 text-gray-300">|</span>
                    <button
                      onClick={() => deleteMC(mc.id, mc.name)}
                      disabled={deleting === mc.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      {deleting === mc.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
