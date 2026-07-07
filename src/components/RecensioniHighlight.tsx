import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import t from "@/i18n/translations";

const GOOGLE_REVIEWS_URL = "GOOGLE_REVIEWS_URL";
const FACEBOOK_REVIEWS_URL = "FACEBOOK_REVIEWS_URL";
const GOOGLE_WRITE_REVIEW_URL = "GOOGLE_WRITE_REVIEW_URL";

const Stars = ({ n = 5 }: { n?: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: n }).map((_, i) => (
      <Star key={i} className="w-5 h-5 fill-primary text-primary" strokeWidth={1.5} />
    ))}
  </div>
);

const Avatar = ({ initials }: { initials: string }) => (
  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-body font-semibold text-sm tracking-wide">
    {initials}
  </div>
);

interface ReviewCardData {
  initials: string;
  name: string;
  country: { it: string; en: string };
  rating: number;
  text: { it: string; en: string };
  source: { it: string; en: string };
}

const ReviewCard = ({ review, index }: { review: ReviewCardData; index: number }) => {
  const { lang } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      className="p-8 md:p-10 rounded-villa bg-card shadow-card border border-border flex flex-col"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Avatar initials={review.initials} />
          <div>
            <p className="font-body font-semibold text-foreground text-sm">{review.name}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{review.country[lang]}</p>
          </div>
        </div>
        <Stars n={review.rating} />
      </div>
      <p className="text-foreground leading-relaxed italic text-[15px] flex-1">
        “{review.text[lang]}”
      </p>
      <p className="mt-6 text-muted-foreground text-xs">
        {review.source[lang]}
      </p>
    </motion.div>
  );
};

const RecensioniHighlight = () => {
  const { lang } = useLanguage();
  const r = t.recensioni;

  const cards: ReviewCardData[] = [r.card1, r.card2];

  return (
    <section id="recensioni" className="villa-section py-24 md:py-32 bg-villa-warm-white">
      <div className="villa-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            {r.eyebrow[lang]}
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight mb-6">
            {r.title[lang]}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {r.subtitle[lang]}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {cards.map((card, i) => (
            <ReviewCard key={card.initials} review={card} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-5xl mx-auto"
        >
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
            {r.buttons.googleReviews[lang]}
          </a>
          <a
            href={FACEBOOK_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
            {r.buttons.facebookReviews[lang]}
          </a>
          <a
            href={GOOGLE_WRITE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-cta hover:shadow-elevated transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
            {r.buttons.writeGoogle[lang]}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default RecensioniHighlight;
