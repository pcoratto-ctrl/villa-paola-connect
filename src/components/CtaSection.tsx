import { motion } from "framer-motion";
import { CalendarCheck, MessageCircle } from "lucide-react";
import ctaImg from "@/assets/villa/cta-tramonto-finale.webp.asset.json";


const WHATSAPP_URL =
  "https://wa.me/393355384250?text=" +
  encodeURIComponent(
    "Buongiorno, vorrei verificare la disponibilità di Villa Paola Caposuvero per queste date:"
  );

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
            src={ctaImg.url}
            alt="Tramonto sul mare davanti a Villa Paola Caposuvero"
            className="w-full h-[440px] md:h-[540px] object-cover"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/40 to-foreground/10" />
          <div className="absolute inset-0 flex flex-col items-center justify-end p-8 md:p-16 text-center">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary-foreground mb-4 max-w-3xl leading-tight">
              Il mare è già lì.
              <br />
              <span className="italic">Devi solo scegliere le date.</span>
            </h2>
            <p className="text-primary-foreground/85 text-lg max-w-xl mb-8">
              Raccontaci quando vorresti partire e ti invieremo disponibilità, dettagli
              e un preventivo personalizzato per il tuo soggiorno a Villa Paola Caposuvero.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#disponibilita"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-primary text-primary-foreground text-base font-medium shadow-cta hover:shadow-elevated transition-all duration-200 active:scale-95"
              >
                <CalendarCheck className="w-5 h-5" strokeWidth={1.5} />
                Richiedi le date disponibili
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-primary-foreground/15 backdrop-blur-md text-primary-foreground text-base font-medium border border-primary-foreground/30 hover:bg-primary-foreground/25 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                Scrivici su WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
