'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  LogOut,
  Menu,
  X,
  Lock,
  ArrowRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/mcs', label: 'MCs', icon: Users },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        localStorage.setItem('admin_auth', 'true');
        setIsAuthenticated(true);
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Authentication failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-white to-rose-50/30 px-4">
        {/* Background orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#E31C5F]/10 to-pink-200/8 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-100/8 to-blue-100/4 rounded-full filter blur-3xl opacity-30"></div>

        <div className="relative w-full max-w-md">
          <div className="rounded-2xl bg-white p-8 sm:p-10 shadow-[0_8px_32px_rgba(227,28,95,0.08)] border border-gray-200">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 mb-4">
                <Lock className="w-6 h-6 text-[#E31C5F]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 font-display">WedList Admin</h1>
              <p className="mt-2 text-sm text-gray-500">Enter your password to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm shadow-sm transition-colors focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <button
                type="submit"
                className="group w-full flex items-center justify-center gap-2 rounded-xl bg-[#E31C5F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#C4184F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E31C5F] focus:ring-offset-2"
              >
                Sign in
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50/20">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 shadow-[1px_0_8px_rgba(0,0,0,0.03)]">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E31C5F] flex items-center justify-center">
              <span className="text-sm font-bold text-white">W</span>
            </div>
            <span className="text-lg font-bold text-gray-900">WedList</span>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-rose-50 text-[#E31C5F]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`h-[18px] w-[18px] ${isActive ? 'text-[#E31C5F]' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="border-t border-gray-100 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
              <Link href="/admin" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
                <div className="w-8 h-8 rounded-lg bg-[#E31C5F] flex items-center justify-center">
                  <span className="text-sm font-bold text-white">W</span>
                </div>
                <span className="text-lg font-bold text-gray-900">WedList</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <nav className="px-3 py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-rose-50 text-[#E31C5F]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`h-[18px] w-[18px] ${isActive ? 'text-[#E31C5F]' : 'text-gray-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-[18px] w-[18px]" />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:pl-64">
        {/* Top Bar - Mobile */}
        <header className="sticky top-0 z-40 flex items-center h-16 px-4 border-b border-gray-100 bg-white/95 backdrop-blur-md lg:hidden">
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

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}
