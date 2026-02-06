interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <div className="divide-y divide-gray-200 border-y border-gray-200">
      {items.map((item, index) => (
        <details key={index} className="group">
          <summary className="flex cursor-pointer items-center justify-between py-5 text-left text-base font-medium text-gray-900 hover:text-gray-700">
            {item.question}
            <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </summary>
          <div className="pb-5 pr-12 text-sm leading-relaxed text-gray-600">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
