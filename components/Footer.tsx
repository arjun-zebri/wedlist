import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const socialLinks = [
    {
      name: "Instagram",
      icon: InstagramIcon,
      url: "https://instagram.com/wedlist",
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      url: "https://facebook.com/wedlist",
    },
    {
      name: "LinkedIn",
      icon: LinkedinIcon,
      url: "https://linkedin.com/company/wedlist",
    },
    { name: "X", icon: XIcon, url: "https://x.com/wedlist" },
  ];

  return (
    <footer className="bg-gray-200 text-gray-300">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-block text-2xl font-bold tracking-tight text-black hover:text-gray-800 transition-colors"
            >
              WedList
            </Link>
            <p className="mt-4 max-w-md text-sm text-gray-600">
              Find the perfect wedding MC in Sydney. Professional masters of
              ceremony for your special day.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Browse */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-black">
              Browse
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/wedding-mc-sydney"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Wedding MCs Sydney
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Blog & Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-500 transition-colors hover:text-black"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-black">
              Company
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-500 transition-colors hover:text-black"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-500 transition-colors hover:text-black"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-black">
              Legal
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-gray-500 transition-colors hover:text-black"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-sm text-gray-500 transition-colors hover:text-black"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-black">
              Contact
            </h3>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                <a
                  href="mailto:hello@wedlist.com.au"
                  className="text-sm text-gray-500 transition-colors hover:text-black break-all"
                >
                  hello@wedlist.com.au
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Sydney, NSW Australia
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-center text-sm text-gray-600 md:text-left">
              © {new Date().getFullYear()} WedList. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* SEO Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "WedList",
            url: "https://wedlist.com.au",
            logo: "https://wedlist.com.au/logo.png",
            description:
              "Find the perfect wedding MC in Sydney. Professional masters of ceremony for your special day.",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Sydney",
              addressRegion: "NSW",
              addressCountry: "AU",
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "",
              contactType: "Customer Service",
              email: "hello@wedlist.com.au",
            },
            sameAs: [
              "https://facebook.com/wedlist",
              "https://instagram.com/wedlist",
              "https://linkedin.com/company/wedlist",
            ],
          }),
        }}
      />
    </footer>
  );
}
