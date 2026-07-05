import { motion } from "framer-motion";
import { Star, Facebook } from "lucide-react";
import { useApprovedReviews } from "@/hooks/useReviews";

const FACEBOOK_URL = "https://www.facebook.com/share/1GR9Wac3ns/";

const featured = [
  {
    quote: "È stata la vacanza più bella da tanto tempo.",
    name: "Solveig",
    origin: "Germania",
  },
  {
    quote: "La villa ha superato ogni aspettativa.",
    name: "Matteo",
    origin: "Torino",
  },
];

const Stars = ({ n = 5 }: { n?: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: n }).map((_, i) => (
      <Star key={i} className="w-5 h-5 fill-primary text-primary" strokeWidth={1.5} />
    ))}
  </div>
);

const RecensioniHighlight = () => {
  const { data: reviews } = useApprovedReviews();

  return (
    <section id="recensioni-hero" className="villa-section py-20 md:py-28 bg-villa-warm-white">
      <div className="villa-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Recensioni degli ospiti
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight">
            Chi è stato qui racconta meglio di noi{" "}
            <span className="italic">cosa rende speciale Villa Paola.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {featured.map((r, i) => (
            <motion.blockquote
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="p-8 md:p-10 rounded-villa bg-card shadow-card border border-border"
            >
              <Stars />
              <p className="mt-6 font-display text-2xl md:text-3xl text-foreground leading-snug italic">
                “{r.quote}”
              </p>
              <footer className="mt-6 pt-6 border-t border-border">
                <p className="font-medium text-foreground">{r.name}</p>
                <p className="text-muted-foreground text-sm">{r.origin}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        {reviews && reviews.length > 0 && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="p-5 rounded-villa bg-card/80 border border-border">
                <Stars n={r.rating} />
                <p className="mt-3 text-foreground text-sm italic line-clamp-4">“{r.comment}”</p>
                <p className="mt-3 text-muted-foreground text-xs">
                  {r.guest_name} · {r.stay_date || new Date(r.created_at).toLocaleDateString("it-IT", { month: "long", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            <Facebook className="w-4 h-4" strokeWidth={1.5} />
            Guarda le recensioni complete su Facebook
          </a>
          <a
            href="#recensioni"
            className="text-primary text-sm font-medium hover:underline"
          >
            Leggi tutte le recensioni sul sito →
          </a>
        </div>
      </div>
    </section>
  );
};

export default RecensioniHighlight;
