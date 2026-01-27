"use client";

interface ContactButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function ContactButton({
  children,
  className,
}: ContactButtonProps) {
  const scrollToContact = () => {
    document
      .getElementById("contact-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button onClick={scrollToContact} className={className}>
      {children}
    </button>
  );
}
