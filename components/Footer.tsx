import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              WedList
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Find the perfect wedding MC in Sydney. Professional masters of
              ceremony for your special day.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Services</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/wedding-mc-sydney"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Wedding MCs Sydney
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} WedList. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
