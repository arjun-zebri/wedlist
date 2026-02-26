"use client";

import { DollarSign } from "lucide-react";
import PackageModal from "./PackageModal";
import { useState } from "react";

interface Package {
  id: string;
  name: string;
  price: number;
  duration: string | null;
  ideal_for: string | null;
  inclusions: string[] | null;
  popular: boolean;
}

interface PackagesSectionProps {
  packages: Package[];
}

export default function PackagesSection({ packages }: PackagesSectionProps) {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  return (
    <>
      <div className="border-b border-gray-200 py-12">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
            <DollarSign className="h-4 w-4 text-gray-900" />
          </div>
          Packages
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className="text-left rounded-lg border border-gray-200 p-5 transition-all duration-200 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              <h3 className="text-base font-semibold text-gray-900">
                {pkg.name}
              </h3>
            </button>
          ))}
        </div>
      </div>

      <PackageModal
        packages={selectedPackage ? [selectedPackage] : []}
        isOpen={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
      />
    </>
  );
}
