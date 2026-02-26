import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQAccordion from "@/components/FAQAccordion";
import {
  ArrowRight,
  Users,
  Clock,
  TrendingUp,
  Search,
  FileText,
  Handshake,
  Send,
  CheckCircle2,
  Eye,
  BarChart3,
  Calendar,
  StickyNote,
  DollarSign,
  Activity,
  Star,
  Check,
  MessageSquare,
} from "lucide-react";

// SEO Metadata

export const metadata: Metadata = {
  title:
    "List Your Wedding MC Business | WedList — Reach 10,000+ Sydney Couples",
  description:
    "List for free and get pre-qualified leads from 10,000+ couples searching monthly. WedList qualifies every inquiry so you close more bookings with less effort.",
};

// FAQ content (MC-targeted)

const faqItems = [
  {
    question: "Is it really free to list?",
    answer:
      "Yes — your WedList profile, directory listing, photo gallery, reviews, search visibility, and couple inquiries are all completely free. No trial period, no credit card required. Our Pro plan adds CRM tools, lead pipeline management, and priority search placement for MCs who want to scale.",
  },
  {
    question: "How does WedList qualify leads?",
    answer:
      'When a couple submits an inquiry through your profile, our team reviews it within 4 hours. We confirm the wedding date, venue, budget range, and style preferences before passing it to you. You receive a detailed brief — not a vague "how much do you charge?" message.',
  },
  {
    question: "What CRM features are included in Pro?",
    answer:
      "Pro includes a full lead pipeline (new → contacted → quoted → booked), automated follow-up reminders, calendar integration, client notes, revenue tracking, and analytics on your profile views and inquiry conversion rates.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. Free listings stay free forever. If you're on Pro, you can cancel anytime from your dashboard — no lock-in contracts, no cancellation fees. Your profile reverts to the free tier and you keep all your existing data.",
  },
  {
    question: "How quickly will I start getting leads?",
    answer:
      "Most MCs receive their first inquiry within 2 weeks of listing. WedList ranks highly for Sydney wedding MC searches, so your profile gets organic traffic from day one. Pro members get priority placement which increases visibility further.",
  },
  {
    question: "Does WedList take a commission on bookings?",
    answer:
      "No. WedList never takes a cut of your bookings. You set your own prices, negotiate directly with the couple, and keep 100% of your fees. We make money from Pro subscriptions, not commissions.",
  },
];

// Page component

export default function ListWithUsPage() {
  // Schema.org structured data
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "List Your Wedding MC Business on WedList",
    description:
      "List for free and get pre-qualified leads from 10,000+ couples searching monthly.",
    url: "https://wedlist.com.au/list-with-us",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "WedList MC Listing",
    description:
      "Free listing for wedding MCs on Sydney's leading directory. Get pre-qualified leads from couples searching for their perfect MC.",
    offers: [
      {
        "@type": "Offer",
        name: "Free Listing",
        price: "0",
        priceCurrency: "AUD",
        description:
          "Profile, directory listing, gallery, reviews, search visibility, and couple inquiries.",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "25",
        priceCurrency: "AUD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          billingDuration: "P1M",
        },
        description:
          "Everything in Free plus full CRM, lead pipeline, follow-ups, calendar, analytics, and priority search.",
      },
    ],
  };

  return (
    <>
      <Header />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Background wrapper matching homepage */}
      <div
        className="relative min-h-screen bg-gradient-to-br from-white via-white to-rose-50/30"
        style={{ overflow: "clip" }}
      >
        {/* Animated background orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#E31C5F]/15 to-pink-200/10 rounded-full filter blur-3xl opacity-70 animate-drift-slow"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-100/12 to-blue-100/8 rounded-full filter blur-3xl opacity-50 animate-float animation-delay-2000"></div>
        <div
          className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-t from-rose-100/15 via-amber-100/5 to-transparent rounded-full filter blur-3xl opacity-60 animate-drift-slow"
          style={{ animationDuration: "24s" }}
        ></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-cyan-100/8 to-blue-100/5 rounded-full filter blur-3xl opacity-40"></div>

        <main>
          {/* ================================================================
              1. HERO
          ================================================================ */}
          <section className="relative bg-white/80 backdrop-blur-sm overflow-hidden px-4 py-14 sm:py-28 sm:px-6 lg:px-8">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-50 rounded-full filter blur-3xl -translate-y-1/2"></div>

            <div className="mx-auto max-w-3xl relative z-10 text-center">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E31C5F]"></div>
                <span className="text-xs font-semibold text-gray-700">
                  For Wedding MCs
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 font-display leading-tight mb-6">
                10,000 couples are searching.
                <br />
                <span className="text-[#E31C5F]">Are you listed?</span>
              </h1>

              {/* Sub */}
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                List for free. Get pre-qualified leads. Close more bookings.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:hello@wedlist.com.au?subject=Free Listing Request"
                  className="group px-8 py-3 bg-[#E31C5F] text-white rounded-lg font-medium hover:bg-[#C4184F] transition-colors"
                >
                  List for Free
                  <ArrowRight className="ml-2 inline-block h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <a
                  href="#how-it-works"
                  className="px-8 py-3 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  See how it works
                </a>
              </div>

              {/* Trust line */}
              <p className="mt-6 text-sm text-gray-500">
                Trusted by{" "}
                <span className="font-medium text-gray-700">
                  50+ Sydney MCs
                </span>{" "}
                to grow their business
              </p>
            </div>
          </section>

          {/* ================================================================
              2. THE OPPORTUNITY — 3 Stat Cards
          ================================================================ */}
          <section className="relative bg-white/80 backdrop-blur-sm px-4 py-12 sm:py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <div className="text-center mb-8 sm:mb-12">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E31C5F]"></div>
                  <span className="text-xs font-semibold text-gray-700">
                    The Opportunity
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 font-display lg:text-5xl">
                  The couples are already here
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    icon: Users,
                    stat: "10,000+",
                    label: "couples browsing monthly",
                    desc: "Sydney couples actively searching for their wedding MC on WedList every month.",
                  },
                  {
                    icon: Clock,
                    stat: "4 hours",
                    label: "average response time",
                    desc: "Every inquiry is reviewed and qualified by our team before it reaches you.",
                  },
                  {
                    icon: TrendingUp,
                    stat: "3x",
                    label: "higher close rate",
                    desc: "Pre-qualified leads convert at 3x the rate of cold inquiries from other platforms.",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="group rounded-2xl bg-white p-6 sm:p-8 border border-gray-300 shadow-[0_2px_8px_rgba(227,28,95,0.06)] hover:shadow-[0_8px_24px_rgba(227,28,95,0.12)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-4 sm:mb-5">
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#E31C5F]" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                      {item.stat}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-[#E31C5F] uppercase tracking-wide mb-2 sm:mb-3">
                      {item.label}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================================================================
              3. HOW IT WORKS — Lead Flow (5-step timeline)
          ================================================================ */}
          <section
            id="how-it-works"
            className="relative bg-white/80 backdrop-blur-sm px-4 py-12 sm:py-20 sm:px-6 lg:px-8"
          >
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-16">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E31C5F]"></div>
                  <span className="text-xs font-semibold text-gray-700">
                    How It Works
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 font-display lg:text-5xl mb-4">
                  From search to signed
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We handle the qualification. You handle the booking.
                </p>
              </div>

              {/* 5-step vertical timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#E31C5F]/30 via-[#E31C5F]/15 to-transparent hidden sm:block"></div>

                <div className="space-y-8">
                  {[
                    {
                      icon: Search,
                      step: "01",
                      title: "Couple finds your profile",
                      desc: "They discover you through WedList's SEO rankings, directory search, or filtered browsing.",
                    },
                    {
                      icon: FileText,
                      step: "02",
                      title: "They submit an inquiry",
                      desc: "Date, venue, budget, style, vibe — we collect everything you need to know upfront.",
                    },
                    {
                      icon: CheckCircle2,
                      step: "03",
                      title: "WedList qualifies the lead",
                      desc: "Our team reviews every inquiry within 4 hours. No tyre-kickers, no spam.",
                    },
                    {
                      icon: Send,
                      step: "04",
                      title: "You receive a warm lead brief",
                      desc: "A detailed brief with the couple's details, preferences, and budget — ready for you to respond.",
                    },
                    {
                      icon: Handshake,
                      step: "05",
                      title: "You close the deal",
                      desc: "Respond directly, have a consult call, and lock in the booking. 100% of the fee is yours.",
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="flex items-start gap-6 group"
                    >
                      <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-[0_2px_8px_rgba(227,28,95,0.06)] group-hover:shadow-[0_4px_12px_rgba(227,28,95,0.12)] group-hover:border-[#E31C5F]/30 flex items-center justify-center transition-all duration-300">
                        <item.icon className="w-5 h-5 text-[#E31C5F]" />
                      </div>
                      <div className="pt-1">
                        <div className="text-xs font-semibold text-[#E31C5F] uppercase tracking-wide mb-1">
                          Step {item.step}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Before/After Comparison */}
              <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Without WedList */}
                <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-5 sm:p-6">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    Without WedList
                  </div>
                  <div className="rounded-xl bg-white border border-gray-200 p-4">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500 italic">
                          &ldquo;Hi, how much do you charge?&rdquo;
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          No date. No budget. No context.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* With WedList */}
                <div className="rounded-2xl border border-[#E31C5F]/20 bg-rose-50/30 p-5 sm:p-6">
                  <div className="text-xs font-semibold text-[#E31C5F] uppercase tracking-wide mb-3">
                    With WedList
                  </div>
                  <div className="rounded-xl bg-white border border-[#E31C5F]/10 p-4 shadow-[0_2px_8px_rgba(227,28,95,0.06)]">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#E31C5F] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-900 font-medium">
                          Sarah &amp; Tom — March 15, Doltone House
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Budget: $1,500–$2,000 &bull; Fun &amp; high-energy
                        </p>
                        <p className="text-xs text-[#E31C5F] mt-2 font-medium">
                          Pre-qualified lead brief
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================
              4. FEATURES — 3 Pillar Cards
          ================================================================ */}
          <section className="relative bg-white/80 backdrop-blur-sm px-4 py-12 sm:py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <div className="text-center mb-8 sm:mb-12">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E31C5F]"></div>
                  <span className="text-xs font-semibold text-gray-700">
                    Built for MCs
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 font-display lg:text-5xl mb-4">
                  Everything you need to grow
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Audience, leads, and tools — all in one platform.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    icon: Eye,
                    title: "Massive Audience",
                    features: [
                      "10,000+ couples browsing monthly",
                      "Top Google rankings for Sydney MC searches",
                      "Targeted traffic from engaged couples",
                    ],
                  },
                  {
                    icon: CheckCircle2,
                    title: "Pre-Qualified Leads",
                    features: [
                      "Every inquiry reviewed by our team",
                      "4-hour qualification turnaround",
                      "Detailed lead briefs with date, budget & style",
                    ],
                  },
                  {
                    icon: BarChart3,
                    title: "MC-Optimized CRM",
                    features: [
                      "Lead pipeline management",
                      "Automated follow-up reminders",
                      "Calendar, analytics & revenue tracking",
                    ],
                  },
                ].map((pillar) => (
                  <div
                    key={pillar.title}
                    className="group rounded-2xl bg-white p-6 sm:p-8 border border-gray-300 shadow-[0_2px_8px_rgba(227,28,95,0.06)] hover:shadow-[0_8px_24px_rgba(227,28,95,0.12)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-5">
                      <pillar.icon className="w-6 h-6 text-[#E31C5F]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {pillar.title}
                    </h3>
                    <ul className="space-y-3">
                      {pillar.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#E31C5F] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================================================================
              5. CRM SHOWCASE — 2 Column
          ================================================================ */}
          <section className="relative bg-white/80 backdrop-blur-sm px-4 py-12 sm:py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: Features list */}
                <div>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E31C5F]"></div>
                    <span className="text-xs font-semibold text-gray-700">
                      Pro CRM
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 font-display mb-4">
                    Your bookings, organized
                  </h2>
                  <p className="text-gray-600 mb-8">
                    A CRM built specifically for wedding MCs. Track every lead
                    from first inquiry to final payment.
                  </p>

                  <div className="space-y-5">
                    {[
                      {
                        icon: Activity,
                        label: "Lead Pipeline",
                        desc: "Visual pipeline from inquiry to booked",
                      },
                      {
                        icon: Send,
                        label: "Follow-up Reminders",
                        desc: "Never let a warm lead go cold",
                      },
                      {
                        icon: Calendar,
                        label: "Calendar Integration",
                        desc: "See availability at a glance",
                      },
                      {
                        icon: StickyNote,
                        label: "Client Notes",
                        desc: "Track preferences, meetings, and details",
                      },
                      {
                        icon: DollarSign,
                        label: "Revenue Tracking",
                        desc: "Know your numbers month by month",
                      },
                      {
                        icon: BarChart3,
                        label: "Analytics",
                        desc: "Profile views, inquiry rates, and conversion",
                      },
                    ].map((feature) => (
                      <div
                        key={feature.label}
                        className="flex items-start gap-4 group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0 group-hover:bg-rose-100 transition-colors duration-200">
                          <feature.icon className="w-5 h-5 text-[#E31C5F]" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {feature.label}
                          </div>
                          <div className="text-sm text-gray-500">
                            {feature.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: CRM mockup placeholder */}
                <div className="rounded-2xl bg-gradient-to-br from-rose-50 via-white to-gray-50 border border-gray-200 p-8 aspect-[4/3] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-[0_2px_8px_rgba(227,28,95,0.1)] flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-[#E31C5F]" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      CRM Dashboard
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Coming soon — mockup preview
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. PRICING */}
          <section
            id="pricing"
            className="relative bg-white/80 backdrop-blur-sm py-12 sm:py-20"
          >
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E31C5F]"></div>
                  <span className="text-xs font-semibold text-gray-700">
                    Pricing
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 font-display lg:text-5xl mb-4">
                  Start free, grow at your pace
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  No commissions. No hidden fees. Upgrade only when you need
                  more tools.
                </p>
              </div>
            </div>

            <div
              className="overflow-x-auto pt-5 md:pt-0 md:overflow-visible"
              style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
            >
              <div className="flex gap-4 pl-4 pr-4 pb-4 sm:pl-6 sm:pr-6 md:pb-0 md:grid md:grid-cols-3 md:gap-6 md:mx-auto md:max-w-5xl md:px-8 w-max md:w-auto">
                {/* Free */}
                <div
                  className="relative w-[85vw] flex-shrink-0 sm:w-[320px] md:w-auto md:flex-shrink rounded-2xl bg-white p-6 sm:p-8 border border-gray-300 shadow-[0_2px_8px_rgba(227,28,95,0.06)] hover:shadow-[0_8px_24px_rgba(227,28,95,0.12)] hover:-translate-y-1 transition-all duration-300"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <h3 className="text-lg font-bold text-gray-900">Free Listing</h3>
                  <p className="text-sm text-gray-500 mt-1">Everything to get started</p>
                  <div className="mt-4 sm:mt-6 mb-6 sm:mb-8">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900">$0</span>
                    <span className="text-gray-500 ml-1">/mo</span>
                  </div>
                  <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                    {["Professional profile page", "Directory listing", "Photo & video gallery", "Google reviews display", "Search & filter visibility", "Couple inquiries"].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#E31C5F] mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="mailto:hello@wedlist.com.au?subject=Free Listing Request" className="block w-full text-center rounded-lg border border-gray-300 px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                    List for Free
                  </a>
                </div>

                {/* Pro — same size card, badge uses absolute + scroll container pt-5 prevents clip */}
                <div
                  className="relative w-[85vw] flex-shrink-0 sm:w-[320px] md:w-auto md:flex-shrink rounded-2xl bg-white p-6 sm:p-8 border-2 border-[#E31C5F] shadow-[0_4px_16px_rgba(227,28,95,0.12)] hover:shadow-[0_8px_24px_rgba(227,28,95,0.18)] hover:-translate-y-1 transition-all duration-300"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-block rounded-full bg-[#E31C5F] px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
                      Most Popular
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Pro</h3>
                  <p className="text-sm text-gray-500 mt-1">For MCs ready to scale</p>
                  <div className="mt-4 sm:mt-6 mb-6 sm:mb-8">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900">$25</span>
                    <span className="text-gray-500 ml-1">/mo</span>
                  </div>
                  <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                    {["Everything in Free", "Full CRM & lead pipeline", "Automated follow-up reminders", "Calendar integration", "Revenue tracking & analytics", "Priority search placement"].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#E31C5F] mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="mailto:hello@wedlist.com.au?subject=Pro Plan Inquiry" className="block w-full text-center rounded-lg bg-[#E31C5F] px-4 py-2.5 sm:py-3 text-sm font-medium text-white hover:bg-[#C4184F] transition-colors">
                    Start Pro
                  </a>
                </div>

                {/* Teams */}
                <div
                  className="relative w-[85vw] flex-shrink-0 sm:w-[320px] md:w-auto md:flex-shrink rounded-2xl bg-white p-6 sm:p-8 border border-gray-300 shadow-[0_2px_8px_rgba(227,28,95,0.06)] hover:shadow-[0_8px_24px_rgba(227,28,95,0.12)] hover:-translate-y-1 transition-all duration-300"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <h3 className="text-lg font-bold text-gray-900">Teams</h3>
                  <p className="text-sm text-gray-500 mt-1">For MC agencies &amp; duos</p>
                  <div className="mt-4 sm:mt-6 mb-6 sm:mb-8">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900">Custom</span>
                  </div>
                  <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                    {["Everything in Pro", "Multiple team seats", "Team management dashboard", "Shared lead pipeline", "Priority support", "Custom onboarding"].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#E31C5F] mt-0.5 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="mailto:hello@wedlist.com.au?subject=Teams Plan Inquiry" className="block w-full text-center rounded-lg border border-gray-300 px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                    Reach out to us
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================
              7. SOCIAL PROOF — MC Reviews
          ================================================================ */}
          <section className="relative bg-white/80 backdrop-blur-sm py-12 sm:py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E31C5F]"></div>
                  <span className="text-xs font-semibold text-gray-700">
                    From Real MCs
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 font-display lg:text-5xl mb-4">
                  Hear it from MCs like you
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Wedding professionals across Sydney are growing their business
                  with WedList.
                </p>
              </div>
            </div>

            <div
              className="overflow-x-auto md:overflow-visible"
              style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
            >
              <div className="flex gap-4 pl-4 pr-4 pb-4 sm:pl-6 sm:pr-6 md:pb-0 md:grid md:grid-cols-2 md:gap-6 md:mx-auto md:max-w-5xl md:px-8 w-max md:w-auto">
              {[
                  {
                    name: "Daniel Rizk",
                    title: "MC & Entertainer",
                    location: "Western Sydney",
                    rating: 5,
                    text: "I was skeptical about another directory, but the leads from WedList are completely different. Couples come to me already knowing my packages, my vibe, even my reviews. I booked 3 weddings in my first month — all from the free listing.",
                    highlight: "3 bookings in first month",
                  },
                  {
                    name: "Priya Sharma",
                    title: "Bilingual MC (English/Hindi)",
                    location: "Inner West",
                    rating: 5,
                    text: "The pre-qualified lead briefs are a game changer. Instead of 'how much do you charge?' I get the couple's date, venue, budget and what style they want. Saves me so much back-and-forth.",
                    highlight: "No more back-and-forth",
                  },
                  {
                    name: "James Whitfield",
                    title: "Professional Wedding MC",
                    location: "Northern Beaches",
                    rating: 5,
                    text: "Upgraded to Pro for the CRM and it's paid for itself ten times over. I can see my entire pipeline, set follow-up reminders, and track which leads convert. Before this I was using spreadsheets.",
                    highlight: "Pro CRM paid for itself 10x",
                  },
                  {
                    name: "Sofia Elias",
                    title: "MC & Event Host",
                    location: "South Sydney",
                    rating: 5,
                    text: "As a newer MC it was hard to get visibility against the big names. WedList levels the playing field — my profile ranks alongside experienced MCs. I've gone from 2 weddings a year to 2 a month.",
                    highlight: "2 weddings/year → 2/month",
                  },
                  {
                    name: "Marcus Chen",
                    title: "MC & DJ Combo",
                    location: "CBD & Eastern Suburbs",
                    rating: 5,
                    text: "The 4-hour qualification turnaround is real. I got a lead brief on Tuesday afternoon, called the couple that evening, and had the deposit by Thursday. That speed doesn't happen on other platforms.",
                    highlight: "Lead to deposit in 48 hours",
                  },
                  {
                    name: "Tina Nguyen",
                    title: "Wedding MC & Celebrant",
                    location: "Hills District",
                    rating: 5,
                    text: "I run my MC business part-time alongside my day job, so I don't have hours to spend chasing enquiries. WedList does the heavy lifting. Went from maybe 5 gigs last year to 14 already this season.",
                    highlight: "5 gigs/year → 14 this season",
                  },
                ].map((review) => (
                  <div
                    key={review.name}
                    className="w-[85vw] flex-shrink-0 sm:w-[340px] md:w-auto md:flex-shrink rounded-2xl bg-white p-5 sm:p-8 border border-gray-300 shadow-[0_2px_8px_rgba(227,28,95,0.06)] hover:shadow-[0_8px_24px_rgba(227,28,95,0.12)] transition-shadow duration-300 flex flex-col"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-3 sm:mb-4">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star
                          key={j}
                          className="w-4 h-4 fill-[#E31C5F] text-[#E31C5F]"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4 sm:mb-5 flex-1">
                      &ldquo;{review.text}&rdquo;
                    </blockquote>

                    {/* Highlight chip */}
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 mb-4 sm:mb-5 self-start">
                      <TrendingUp className="w-3 h-3 text-[#E31C5F]" />
                      <span className="text-xs font-semibold text-[#E31C5F]">
                        {review.highlight}
                      </span>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs sm:text-sm font-bold text-[#E31C5F]">
                          {review.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900">
                          {review.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {review.title} &bull; {review.location}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 w-full">
                {[
                  { value: "50+", label: "MCs listed" },
                  { value: "10,000+", label: "monthly visitors" },
                  { value: "4hr", label: "avg response time" },
                  { value: "$0", label: "commission taken" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mt-1">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================================================================
              8. FAQ
          ================================================================ */}
          <section className="bg-white/80 backdrop-blur-sm px-4 py-16 lg:py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 font-display lg:text-5xl">
                  Questions from MCs
                </h2>
                <p className="mt-6 text-lg text-gray-600">
                  Everything you need to know before listing.
                </p>
              </div>

              <div className="mt-12 max-w-3xl mx-auto">
                <FAQAccordion items={faqItems} />
              </div>
            </div>
          </section>

          {/* ================================================================
              9. FINAL CTA
          ================================================================ */}
          <section className="relative bg-white/80 backdrop-blur-sm px-4 py-12 sm:py-20 sm:px-6 lg:px-8 overflow-hidden">
            <div className="relative mx-auto max-w-3xl z-10 text-center">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 font-display mb-6">
                Your next booking is already searching
              </h2>

              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                10,000 couples browse WedList every month. Make sure they can
                find you.
              </p>

              <a
                href="mailto:hello@wedlist.com.au?subject=Free Listing Request"
                className="group inline-flex items-center px-8 py-3 bg-[#E31C5F] text-white rounded-lg font-medium hover:bg-[#C4184F] transition-colors"
              >
                List for Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <p className="mt-6 text-sm text-gray-500">
                <span className="font-medium text-gray-700">
                  No credit card required
                </span>{" "}
                &bull; Free forever &bull; Upgrade anytime
              </p>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
