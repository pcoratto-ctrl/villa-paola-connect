import { motion } from "framer-motion";
import { Phone, ChevronDown } from "lucide-react";

const PHONE_NUMBER = "+393355384250";

const HeroSection = () => {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-0"
      >
        <img
          src="/images/villa-1.jpg"
          alt="Villa Paola Caposuvero - Vista panoramica"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/10 to-foreground/50" />
      </motion.div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end villa-section pb-16 md:pb-24">
        <div className="villa-container w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <p className="text-primary-foreground/80 text-sm md:text-base font-medium tracking-widest uppercase mb-4">
              Gizzeria · Calabria · Italia
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-primary-foreground leading-[0.95] mb-6">
              Villa Paola
              <br />
              <span className="italic">Caposuvero</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-lg leading-relaxed mb-10">
              L'eleganza del mare, il calore di casa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-primary text-primary-foreground text-base font-medium shadow-cta hover:shadow-elevated transition-all duration-200 active:scale-95"
              >
                <Phone className="w-5 h-5" strokeWidth={1.5} />
                Prenota ora
              </a>
              <a
                href="#galleria"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary-foreground/15 backdrop-blur-md text-primary-foreground text-base font-medium border border-primary-foreground/20 hover:bg-primary-foreground/25 transition-all duration-200"
              >
                Guarda le foto
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-primary-foreground/60" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
