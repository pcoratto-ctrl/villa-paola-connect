import { motion } from "framer-motion";
import { CalendarCheck, ChevronDown } from "lucide-react";
import heroDesktop from "@/assets/villa/hero-terrazza-desktop.webp.asset.json";
import heroMobile from "@/assets/villa/hero-terrazza-mobile.webp.asset.json";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-0"
      >
        <picture>
          <source media="(max-width: 767px)" srcSet={heroMobile.url} />
          <img
            src={heroDesktop.url}
            alt="Terrazza vista mare a Villa Paola Caposuvero, Gizzeria — Calabria"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 58%" }}
            fetchPriority="high"
          />
        </picture>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,20,25,0.58), rgba(10,20,25,0.22), rgba(10,20,25,0.10))",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/40" />
      </motion.div>

      <div className="relative h-full min-h-[85vh] md:min-h-[90vh] flex flex-col justify-end villa-section pb-16 md:pb-24">
        <div className="villa-container w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-2xl"
          >
            <p className="text-primary-foreground/85 text-sm md:text-base font-medium tracking-widest uppercase mb-4">
              Villa Paola Caposuvero · Gizzeria · Calabria
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-[1.05] mb-6">
              Il mare davanti a te.
              <br />
              <span className="italic">Senza nulla da attraversare.</span>
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Una villa fronte mare dove svegliarsi con la luce del Mediterraneo,
              vivere la terrazza in piena privacy e ritrovare il tempo lento della vacanza.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#disponibilita"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-primary text-primary-foreground text-base font-medium shadow-cta hover:shadow-elevated transition-all duration-200 active:scale-95"
              >
                <CalendarCheck className="w-5 h-5" strokeWidth={1.5} />
                Verifica la disponibilità
              </a>
              <a
                href="#villa"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary-foreground/15 backdrop-blur-md text-primary-foreground text-base font-medium border border-primary-foreground/25 hover:bg-primary-foreground/25 transition-all duration-200"
              >
                Guarda la villa
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
            <ChevronDown className="w-6 h-6 text-primary-foreground/60" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          section picture img { object-position: center 55% !important; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
