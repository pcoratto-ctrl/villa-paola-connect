export type Language = "it" | "en";

const t = {
  recensioni: {
    eyebrow: {
      it: "Recensioni degli ospiti",
      en: "Guest reviews",
    },
    title: {
      it: "Chi è stato qui racconta meglio di noi cosa rende speciale Villa Paola.",
      en: "Our guests tell the story of Villa Paola better than we ever could.",
    },
    subtitle: {
      it: "Esperienze reali di ospiti che hanno vissuto la villa, il mare e l'accoglienza di Villa Paola Caposuvero.",
      en: "Real experiences from guests who enjoyed the villa, the sea and the hospitality of Villa Paola Caposuvero.",
    },
    card1: {
      initials: "SM",
      name: "Solveig Merkel",
      country: { it: "Germania", en: "Germany" },
      rating: 5,
      text: {
        it: "Villa Paola è semplicemente un posto speciale. Roberto è un padrone di casa fantastico: ci si sente accolti, tranquilli e seguiti con grande cura. Trascorrere qui le vacanze è stato un vero sogno. Un luogo che consigliamo con tutto il cuore. Torneremo volentieri.",
        en: "Villa Paola is simply a special place. Roberto is a wonderful host: you feel welcomed, relaxed and very well looked after. Spending a holiday here was truly a dream. A place we warmly recommend. We would love to come back.",
      },
      source: { it: "Recensione originale su Facebook", en: "Original review on Facebook" },
    },
    card2: {
      initials: "RF",
      name: "Renat FoxBlack",
      country: { it: "Francia", en: "France" },
      rating: 5,
      text: {
        it: "Un posto magnifico, affacciato sul mare e con tutto il comfort necessario. Una splendida cornice che torneremo sicuramente a vivere molto presto.",
        en: "A magnificent place, facing the sea and with all the comfort you need. A beautiful setting that we will certainly come back to very soon.",
      },
      source: { it: "Recensione originale su Facebook", en: "Original review on Facebook" },
    },
    buttons: {
      googleReviews: { it: "Leggi recensioni su Google", en: "Read reviews on Google" },
      facebookReviews: { it: "Leggi recensioni su Facebook", en: "Read reviews on Facebook" },
      writeGoogle: { it: "Lascia una recensione su Google", en: "Leave a Google review" },
    },
  },
} as const;

export function getText<T extends Record<Language, string>>(obj: T, lang: Language): string {
  return obj[lang];
}

export default t;
