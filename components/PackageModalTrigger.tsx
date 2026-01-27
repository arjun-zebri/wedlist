"use client";

import { useState } from "react";
import PackageModal from "./PackageModal";

interface Package {
  id: string;
  name: string;
  price: number;
  duration: string | null;
  ideal_for: string | null;
  inclusions: string[] | null;
  popular: boolean;
}

interface PackageModalTriggerProps {
  packages: Package[];
}

export default function PackageModalTrigger({
  packages,
}: PackageModalTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 text-sm font-semibold text-gray-900 underline hover:text-gray-700"
      >
        Show all {packages.length} packages
      </button>

      <PackageModal
        packages={packages}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
