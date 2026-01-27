import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              WedList
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/wedding-mc-sydney"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Find an MC
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/list-with-us"
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              List with us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Link
              href="/wedding-mc-sydney"
              className="text-sm font-medium text-gray-900"
            >
              Browse MCs
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
