import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
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
                  className="text-sm text-gray-500 transition-colors hover:text-black"
                >
                  Wedding MCs Sydney
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-gray-500 transition-colors hover:text-black"
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
                  className="text-sm text-gray-500 transition-colors hover:text-black"
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
                  className="text-sm text-gray-500 transition-colors hover:text-black"
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
                  Sydney, NSW
                  <br />
                  Australia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-400 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-sm text-gray-500 sm:text-left">
              © {currentYear} WedList. All rights reserved.
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
