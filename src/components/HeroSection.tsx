import { motion } from "framer-motion";
import { CalendarCheck, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroDesktop from "@/assets/villa/hero-terrazza-desktop.webp.asset.json";
import heroMobile from "@/assets/villa/hero-terrazza-mobile.webp.asset.json";

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-[100dvh] md:min-h-[90vh] overflow-hidden">
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
            alt={t("hero.imageAlt")}
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 58%" }}
            fetchPriority="high"
          />
        </picture>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,20,25,0.35) 0%, rgba(10,20,25,0.15) 35%, rgba(10,20,25,0.55) 100%)",
          }}
        />
      </motion.div>

      <div className="relative min-h-[100dvh] md:min-h-[90vh] flex flex-col justify-end villa-section pt-24 pb-16 md:pb-24">
        <div className="villa-container w-full">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-2xl"
          >
            <p className="text-primary-foreground/85 text-xs sm:text-sm md:text-base font-medium tracking-[0.15em] sm:tracking-widest uppercase mb-3 sm:mb-4">
              {t("hero.eyebrow")}
            </p>
            <h1 className="font-display text-[2rem] leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-5 sm:mb-6">
              {t("hero.titleLine1")}
              <br />
              <span className="italic">{t("hero.titleLine2")}</span>
            </h1>
            <p className="text-primary-foreground/90 text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-xl">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#disponibilita"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-4 min-h-[52px] rounded-full bg-primary text-primary-foreground text-base font-medium shadow-cta hover:shadow-elevated transition-all duration-200 active:scale-95"
              >
                <CalendarCheck className="w-5 h-5" strokeWidth={1.5} />
                {t("hero.ctaPrimary")}
              </a>
              <a
                href="#villa"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 min-h-[52px] rounded-full bg-primary-foreground/15 backdrop-blur-md text-primary-foreground text-base font-medium border border-primary-foreground/25 hover:bg-primary-foreground/25 transition-all duration-200"
              >
                {t("hero.ctaSecondary")}
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="hidden sm:block absolute bottom-6 left-1/2 -translate-x-1/2"
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
