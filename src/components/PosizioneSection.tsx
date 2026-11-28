import { motion } from "framer-motion";
import { MapPin, Plane, UtensilsCrossed, Waves, Navigation } from "lucide-react";
import { useTranslation } from "react-i18next";
import GettingHere from "./GettingHere";

const PosizioneSection = () => {
  const { t, i18n } = useTranslation();
  const nearbyPlaces = [
    { icon: Waves, label: t("position.nearby.beach"), distance: t("position.nearby.beachDist") },
    { icon: Plane, label: t("position.nearby.airport"), distance: t("position.nearby.airportDist") },
    { icon: UtensilsCrossed, label: t("position.nearby.lido"), distance: t("position.nearby.lidoDist") },
    { icon: Navigation, label: t("position.nearby.center"), distance: t("position.nearby.centerDist") },
  ];

  return (
    <section id="posizione" className="villa-section py-24 md:py-32 bg-villa-warm-white">
      <div className="villa-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-2xl mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            {t("position.eyebrow")}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-6">
            {t("position.titleStart")} <span className="italic">{t("position.titleEmph")}</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("position.body")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="min-w-0"
          >
            <GettingHere locale={i18n.resolvedLanguage?.startsWith("en") ? "en" : "it"} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col gap-6"
          >
            <div className="p-6 md:p-8 rounded-villa bg-card shadow-soft border border-border">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <p className="font-medium text-foreground mb-1">{t("position.addressTitle")}</p>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {t("position.addressLine")}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 rounded-villa bg-card shadow-soft border border-border">
              <h3 className="font-display text-2xl text-foreground mb-6">{t("position.nearbyTitle")}</h3>
              <div className="flex flex-col gap-5">
                {nearbyPlaces.map((place) => (
                  <div key={place.label} className="flex items-center gap-4">
                    <place.icon className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.5} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{place.label}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{place.distance}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PosizioneSection;
