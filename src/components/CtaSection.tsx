import { motion } from "framer-motion";
import { Phone } from "lucide-react";

const PHONE_NUMBER = "+393331234567";

const CtaSection = () => {
  return (
    <section className="villa-section py-24 md:py-32">
      <div className="villa-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="relative rounded-villa overflow-hidden"
        >
          <img
            src="/images/villa-16.jpg"
            alt="Vista mare dalla terrazza di Villa Paola"
            className="w-full h-[400px] md:h-[500px] object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end p-8 md:p-16 text-center">
            <h2 className="font-display text-4xl md:text-5xl text-primary-foreground mb-4">
              La vostra vacanza <span className="italic">inizia qui</span>
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-lg mb-8">
              Chiamate oggi per prenotare il vostro soggiorno a Villa Paola Caposuvero.
            </p>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="inline-flex items-center gap-2.5 px-10 py-5 rounded-full bg-primary text-primary-foreground text-lg font-medium shadow-cta hover:shadow-elevated transition-all duration-200 active:scale-95"
            >
              <Phone className="w-5 h-5" strokeWidth={1.5} />
              Prenota ora
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
