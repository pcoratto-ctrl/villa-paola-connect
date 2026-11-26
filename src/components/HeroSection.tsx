import { measurementAllowed, enquiryMeasurementProperties } from "@/lib/enquiryConsent";
import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const BASE = "/images/villa-paola-restyle";

const HeroSection = () => {
  const { t, i18n } = useTranslation();
  return (
    <section className="relative min-h-[100svh] md:min-h-[92vh] overflow-hidden bg-primary">
      <picture>
        <source media="(max-width: 767px)" srcSet={`${BASE}/hero-terrazza-mare-mobile.webp`} width={1116} height={1600} />
        <source
          media="(min-width: 768px)"
          srcSet={`${BASE}/hero-giardino-mare-1280.webp 1280w, ${BASE}/hero-giardino-mare-desktop.webp 2560w`}
          sizes="100vw"
          width={2560}
          height={1920}
        />
        <img
          src={`${BASE}/hero-giardino-mare-1280.webp`}
          alt={t("hero.imageAlt")}
          className="hero-img absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      {/* gradient only where the text sits (bottom-left) */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/15 to-transparent md:bg-gradient-to-r md:from-foreground/65 md:via-foreground/25 md:to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-foreground/30 to-transparent" />

      <div className="relative min-h-[100svh] md:min-h-[92vh] flex flex-col justify-end villa-section pt-28 pb-24 md:pb-20">
        <div className="villa-container w-full">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-xl"
          >
            <p className="text-primary-foreground/85 text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase mb-4">
              {t("hero.eyebrow")}
            </p>
            <h1 className="font-display font-medium text-[2.6rem] leading-[1.02] sm:text-5xl md:text-6xl lg:text-7xl text-primary-foreground mb-5">
              {t("hero.titleLine1")}
              <br />
              <span className="italic font-normal">{t("hero.titleLine2")}</span>
            </h1>
            <p className="text-primary-foreground/90 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#disponibilita" onClick={async () => { if (await measurementAllowed()) window.__lovableEvents?.track?.("project.availability_cta_clicked", enquiryMeasurementProperties(i18n.language)); }}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 min-h-[52px] rounded-villa bg-primary-foreground text-primary text-base font-semibold shadow-cta hover:bg-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
              >
                <CalendarCheck className="w-5 h-5" strokeWidth={1.5} />
                {t("hero.ctaPrimary")}
              </a>
              <a
                href="#villa"
                className="inline-flex items-center justify-center px-7 py-4 min-h-[52px] rounded-villa text-primary-foreground text-base font-medium border border-primary-foreground/50 hover:bg-primary-foreground/10 transition-colors"
              >
                {t("hero.ctaSecondary")}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        .hero-img { object-position: 50% 55%; }
        @media (max-width: 767px) { .hero-img { object-position: 50% 50%; } }
      `}</style>
    </section>
  );
};

export default HeroSection;
