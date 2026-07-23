"use client";

// URL configurabile per la beta (form esterno, Slack, Typeform, ecc.). Se
// NEXT_PUBLIC_FEEDBACK_URL non è impostata, ripiega su un mailto semplice:
// nessun indirizzo destinatario è pre-impostato (non ne esiste uno noto in
// questo momento), l'oggetto e il corpo sono già compilati.
const FEEDBACK_URL = process.env.NEXT_PUBLIC_FEEDBACK_URL;
const MAILTO_FALLBACK =
  "mailto:?subject=" +
  encodeURIComponent("Feedback Klaro (beta privata)") +
  "&body=" +
  encodeURIComponent("Ciao,\n\necco il mio feedback su Klaro:\n\n");

export default function FeedbackButton() {
  const href = FEEDBACK_URL && FEEDBACK_URL.trim() ? FEEDBACK_URL : MAILTO_FALLBACK;
  return (
    <a
      href={href}
      target={FEEDBACK_URL ? "_blank" : undefined}
      rel={FEEDBACK_URL ? "noopener noreferrer" : undefined}
      className="rounded-lg px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
    >
      Invia feedback
    </a>
  );
}
