import { motion } from "framer-motion";
import { Bed, Bath, Maximize, Users, Waves, Eye, PawPrint, Plane } from "lucide-react";
import { useTranslation } from "react-i18next";
import terrazzaImg from "@/assets/villa/terrazza-pranzo.webp.asset.json";
import giardinoImg from "@/assets/villa/casa-mare-giardino.webp.asset.json";

const VillaSection = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: Maximize, value: "120 m²", label: t("villa.stats.surface") },
    { icon: Bed, value: "3", label: t("villa.stats.bedrooms") },
    { icon: Bath, value: "2", label: t("villa.stats.bathrooms") },
    { icon: Users, value: "6+", label: t("villa.stats.guests") },
  ];

  const features = [
    { icon: Waves, text: t("villa.features.beachAccess") },
    { icon: Eye, text: t("villa.features.seaView") },
    { icon: Users, text: t("villa.features.families") },
    { icon: Plane, text: t("villa.features.airport") },
    { icon: PawPrint, text: t("villa.features.pets") },
  ];

  return (
    <section id="villa" className="villa-section py-24 md:py-32">
      <div className="villa-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-3xl mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">{t("villa.eyebrow")}</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
            {t("villa.titleStart")}{" "}
            <span className="italic text-primary">{t("villa.titleEmph")}</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("villa.body")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="p-6 md:p-8 rounded-villa bg-card shadow-soft border border-border">
              <stat.icon className="w-6 h-6 text-primary mb-4" strokeWidth={1.5} />
              <p className="font-display text-3xl md:text-4xl text-foreground mb-1">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-16"
        >
          {features.map((f) => (
            <li key={f.text} className="flex items-center gap-3 p-4 rounded-xl bg-villa-warm-white border border-border">
              <f.icon className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.5} />
              <span className="text-foreground text-sm font-medium">{f.text}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="p-3 bg-card rounded-villa shadow-soft border border-border">
            <div className="rounded-[calc(1.5rem-12px)] overflow-hidden">
              <img
                src={giardinoImg.url}
                alt={t("villa.imageAltGarden")}
                className="w-full h-[300px] md:h-[400px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="p-3 bg-card rounded-villa shadow-soft border border-border">
            <div className="rounded-[calc(1.5rem-12px)] overflow-hidden">
              <img
                src={terrazzaImg.url}
                alt={t("villa.imageAltTerrace")}
                className="w-full h-[300px] md:h-[400px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VillaSection;
