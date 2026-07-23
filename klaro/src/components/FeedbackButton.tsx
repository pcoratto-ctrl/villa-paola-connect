"use client";

import { FEEDBACK_URL, mailtoFounder } from "@/lib/founderConfig";

export default function FeedbackButton({
  label = "Raccontami com'è andata",
}: {
  label?: string;
}) {
  const href = FEEDBACK_URL ?? mailtoFounder("Feedback Klaro (beta privata)", "Ciao,\n\necco il mio feedback su Klaro:\n\n");
  return (
    <a
      href={href}
      target={FEEDBACK_URL ? "_blank" : undefined}
      rel={FEEDBACK_URL ? "noopener noreferrer" : undefined}
      className="rounded-lg px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
    >
      {label}
    </a>
  );
}
