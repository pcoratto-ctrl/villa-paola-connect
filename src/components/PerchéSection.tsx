import { motion } from "framer-motion";
import { Waves, ShieldCheck, Users, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

const PerchéSection = () => {
  const { t } = useTranslation();
  const cards = [
    { icon: Waves, title: t("why.cards.sea.title"), text: t("why.cards.sea.text") },
    { icon: ShieldCheck, title: t("why.cards.privacy.title"), text: t("why.cards.privacy.text") },
    { icon: Users, title: t("why.cards.family.title"), text: t("why.cards.family.text") },
    { icon: MapPin, title: t("why.cards.location.title"), text: t("why.cards.location.text") },
  ];

  return (
    <section id="perche" className="villa-section py-24 md:py-32">
      <div className="villa-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-2xl mb-14"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            {t("why.eyebrow")}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground">
            {t("why.titleStart")} <span className="italic">{t("why.titleEmph")}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
              className="p-6 md:p-8 rounded-villa bg-card shadow-soft border border-border h-full"
            >
              <c.icon className="w-8 h-8 text-primary mb-5" strokeWidth={1.5} />
              <h3 className="font-display text-xl text-foreground mb-3">{c.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerchéSection;
