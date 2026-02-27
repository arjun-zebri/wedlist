"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  FileText,
  LogOut,
  Menu,
  X,
  Lock,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/super-admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/super-admin/crm", label: "MC CRM", icon: BarChart3 },
  { href: "/super-admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/super-admin/blog", label: "Blog", icon: FileText },
];

interface Props {
  children?: React.ReactNode;
  showLogin?: boolean;
}

export default function SuperAdminLayoutClient({
  children,
  showLogin = false,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Redirect to super admin dashboard after login
        router.push("/super-admin");
        router.refresh();
      }
    } catch (err) {
      setError("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (showLogin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-white to-rose-50/30 px-4">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#E31C5F]/10 to-pink-200/8 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-100/8 to-blue-100/4 rounded-full filter blur-3xl opacity-30"></div>

        <div className="relative w-full max-w-md">
          <div className="rounded-2xl bg-white p-8 sm:p-10 shadow-[0_8px_32px_rgba(227,28,95,0.08)] border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 mb-4">
                <Lock className="w-6 h-6 text-[#E31C5F]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                WedList Super Admin
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Sign in with your Supabase account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full flex items-center justify-center gap-2 rounded-xl bg-[#E31C5F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#C4184F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E31C5F] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign in <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-rose-50/20">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-[1px_0_8px_rgba(0,0,0,0.03)] flex-shrink-0">
        <div className="flex items-center h-16 px-6 border-b border-gray-100">
          <Link href="/super-admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E31C5F] flex items-center justify-center">
              <span className="text-sm font-bold text-white">W</span>
            </div>
            <span className="text-lg font-bold text-gray-900">WedList</span>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <item.icon className="h-[18px] w-[18px] text-gray-400" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 w-full lg:pl-64 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-40 flex items-center h-16 px-4 border-b border-gray-100 bg-white/95 backdrop-blur-md lg:hidden flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2 ml-3">
            <div className="w-7 h-7 rounded-lg bg-[#E31C5F] flex items-center justify-center">
              <span className="text-xs font-bold text-white">W</span>
            </div>
            <span className="font-bold text-gray-900">Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 pb-8 sm:pb-12 lg:pb-16">{children}</main>
      </div>
    </div>
  );
}
