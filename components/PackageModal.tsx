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
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-4 right-4 z-10 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 pt-0">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">
            All Packages
          </h2>

          <div className="space-y-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-lg border-2 p-6 ${
                  pkg.popular ? "border-gray-900 bg-gray-50" : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {pkg.popular && (
                      <span className="mb-2 inline-block rounded bg-gray-900 px-2 py-0.5 text-xs font-medium text-white">
                        Popular
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-gray-900">
                      {pkg.name}
                    </h3>
                    {pkg.ideal_for && (
                      <p className="mt-1 text-sm text-gray-600">
                        {pkg.ideal_for}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(pkg.price)}
                    </div>
                    {pkg.duration && (
                      <p className="mt-1 text-sm text-gray-600">
                        {pkg.duration}
                      </p>
                    )}
                  </div>
                </div>

                {pkg.inclusions && pkg.inclusions.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {pkg.inclusions.map((inclusion, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-gray-700"
                      >
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-900" />
                        <span>{inclusion}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
