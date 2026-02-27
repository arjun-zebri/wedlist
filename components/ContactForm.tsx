"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactSchema = z.object({
  couple_name: z.string().min(2, "Name must be at least 2 characters"),
  couple_email: z.string().email("Invalid email address"),
  couple_phone: z.string().optional(),
  wedding_date: z.string().optional(),
  venue: z.string().optional(),
  message: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  mcId?: string;
  mcName?: string;
}

export default function ContactForm({ mcId, mcName }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          mc_id: mcId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      setSubmitStatus("success");
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">
        {mcName ? `Message ${mcName}` : "Send Inquiry"}
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Fill out the form below and they&apos;ll get back to you shortly.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="couple_name"
            className="block text-sm font-medium text-gray-700"
          >
            Your Name *
          </label>
          <input
            type="text"
            id="couple_name"
            {...register("couple_name")}
            className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="Jane Smith"
          />
          {errors.couple_name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.couple_name.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="couple_email"
            className="block text-sm font-medium text-gray-700"
          >
            Email *
          </label>
          <input
            type="email"
            id="couple_email"
            {...register("couple_email")}
            className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="jane@example.com"
          />
          {errors.couple_email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.couple_email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="couple_phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="tel"
            id="couple_phone"
            {...register("couple_phone")}
            className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="0412 345 678"
          />
        </div>

        <div>
          <label
            htmlFor="wedding_date"
            className="block text-sm font-medium text-gray-700"
          >
            Wedding Date
          </label>
          <input
            type="date"
            id="wedding_date"
            {...register("wedding_date")}
            className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="venue"
            className="block text-sm font-medium text-gray-700"
          >
            Venue
          </label>
          <input
            type="text"
            id="venue"
            {...register("venue")}
            className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="The Grand Ballroom"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            {...register("message")}
            className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm placeholder-gray-400 shadow-sm transition-colors focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="Tell them about your vision for the reception..."
          />
        </div>

        {submitStatus === "success" && (
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm font-medium text-green-900">
              ✓ Message sent! They&apos;ll be in touch soon.
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">
              Something went wrong. Please try again or contact them directly.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-[#E31C5F] px-4 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:bg-[#C4184F] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#E31C5F] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
