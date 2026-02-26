"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-200 border-y border-gray-200">
      {items.map((item, index) => (
        <div key={index} className="group">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex cursor-pointer items-center justify-between py-5 text-left text-base font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200"
          >
            {item.question}
            <span className={`ml-4 flex-shrink-0 text-gray-400 transition-transform duration-400 ease-out ${openIndex === index ? 'rotate-180' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          <div
            className="overflow-hidden transition-[max-height,opacity]"
            style={{
              maxHeight: openIndex === index ? '500px' : '0px',
              opacity: openIndex === index ? 1 : 0,
              transitionDuration: openIndex === index ? '600ms' : '300ms',
              transitionTimingFunction: openIndex === index ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="pb-5 pr-12 text-sm leading-relaxed text-gray-600">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
