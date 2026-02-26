"use client";

import { X, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Package {
  id: string;
  name: string;
  price: number;
  duration: string | null;
  ideal_for: string | null;
  inclusions: string[] | null;
  popular: boolean;
}

interface PackageModalProps {
  packages: Package[];
  isOpen: boolean;
  onClose: () => void;
}

export default function PackageModal({
  packages,
  isOpen,
  onClose,
}: PackageModalProps) {
  if (!isOpen || packages.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-6 right-6 z-10 ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 sm:p-10 pt-0 space-y-10">
          {packages.map((pkg) => (
            <div key={pkg.id}>
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900">{pkg.name}</h2>
                  {pkg.popular && (
                    <span className="rounded-full bg-rose-50 border border-[#E31C5F]/10 px-2.5 py-0.5 text-xs font-semibold text-[#E31C5F]">
                      Popular
                    </span>
                  )}
                </div>
                {pkg.ideal_for && (
                  <p className="mt-2 text-gray-600">{pkg.ideal_for}</p>
                )}
              </div>

              <div className="mb-6 flex items-baseline gap-3">
                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(pkg.price)}
                </div>
                {pkg.duration && (
                  <div className="text-gray-600">{pkg.duration}</div>
                )}
              </div>

              {pkg.inclusions && pkg.inclusions.length > 0 && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    What&apos;s Included
                  </h3>
                  <ul className="space-y-3">
                    {pkg.inclusions.map((inclusion, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-gray-700"
                      >
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-900 font-bold" />
                        <span>{inclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg !== packages[packages.length - 1] && (
                <div className="mt-8 border-t border-gray-100" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
