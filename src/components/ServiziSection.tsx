import { motion } from "framer-motion";
import {
  Wifi, Waves, Wind, Baby, PawPrint, UtensilsCrossed, Tv, WashingMachine, Flame, ShowerHead,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const ServiziSection = () => {
  const { t } = useTranslation();
  const amenities = [
    { icon: Wifi, label: t("services.amenities.wifi") },
    { icon: Waves, label: t("services.amenities.beach") },
    { icon: Wind, label: t("services.amenities.ac") },
    { icon: UtensilsCrossed, label: t("services.amenities.kitchen") },
    { icon: Baby, label: t("services.amenities.kids") },
    { icon: Tv, label: t("services.amenities.tv") },
    { icon: WashingMachine, label: t("services.amenities.washer") },
    { icon: Flame, label: t("services.amenities.bbq") },
    { icon: ShowerHead, label: t("services.amenities.linen") },
    { icon: PawPrint, label: t("services.amenities.pets") },
  ];

  return (
    <section id="servizi" className="villa-section py-24 md:py-32 bg-villa-warm-white">
      <div className="villa-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            {t("services.eyebrow")}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-6">
            {t("services.titleStart")} <span className="italic">{t("services.titleEmph")}</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("services.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {amenities.map((amenity) => (
            <div
              key={amenity.label}
              className="flex flex-col items-center text-center p-6 rounded-villa bg-card shadow-soft border border-border transition-shadow duration-200 hover:shadow-card"
            >
              <amenity.icon className="w-7 h-7 mb-4 text-primary" strokeWidth={1.5} />
              <p className="text-sm font-medium text-foreground">{amenity.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground text-sm">
            {t("services.extra")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiziSection;
