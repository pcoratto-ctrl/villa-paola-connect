import { Bed, Bath, Maximize, Users, Waves, Eye, PawPrint, Plane } from "lucide-react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/restyle/Reveal";
const living = { url: "/images/villa-paola-restyle/interni-cucina-dettaglio.webp" };
const bedroom = { url: "/images/villa-paola-restyle/interni-camera-doppia.webp" };

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
    <section id="villa" className="pt-24 md:pt-36">
      {/* Intro: asymmetric title + text */}
      <div className="villa-section">
        <div className="villa-container grid md:grid-cols-12 gap-8 md:gap-12 items-end">
          <Reveal className="md:col-span-7">
            <p className="eyebrow mb-5">{t("villa.eyebrow")}</p>
            <h2 className="font-display font-medium text-[2.4rem] sm:text-5xl lg:text-7xl leading-[1.02] text-foreground">
              {t("villa.titleStart")} <span className="italic font-normal text-primary">{t("villa.titleEmph")}</span>
            </h2>
          </Reveal>
          <Reveal className="md:col-span-5" delay={0.1}>
            <p className="text-muted-foreground text-lg leading-relaxed">{t("villa.body")}</p>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed panorama */}
      <Reveal className="mt-14 md:mt-20">
        <figure>
          <img
            src="/images/villa-paola-restyle/villa-esterno-panoramica.webp"
            alt={t("villaPano.alt")}
            width={2400}
            height={1260}
            loading="lazy"
            decoding="async"
            className="w-full h-[62vw] max-h-[78vh] min-h-[280px] object-cover"
          />
          <figcaption className="villa-section">
            <div className="villa-container pt-4 text-sm text-muted-foreground italic font-display text-lg">{t("villaPano.caption")}</div>
          </figcaption>
        </figure>
      </Reveal>

      {/* Stats as an editorial strip, no cards */}
      <div className="villa-section">
        <div className="villa-container">
          <Reveal className="grid grid-cols-2 md:grid-cols-4 border-y border-border mt-14 md:mt-20">
            {stats.map((s, i) => (
              <div key={s.label} className={`py-8 md:py-10 px-2 md:px-6 ${i % 2 ? "border-l" : ""} ${i > 0 ? "md:border-l" : ""} ${i > 1 ? "border-t md:border-t-0" : ""} border-border`}>
                <s.icon className="w-5 h-5 text-primary/70 mb-4" strokeWidth={1.4} />
                <p className="font-display text-4xl md:text-5xl text-foreground leading-none mb-2">{s.value}</p>
                <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase">{s.label}</p>
              </div>
            ))}
          </Reveal>
          <Reveal>
            <ul className="flex flex-wrap gap-x-8 gap-y-3 py-8">
              {features.map((f) => (
                <li key={f.text} className="flex items-center gap-2.5 text-sm text-foreground">
                  <f.icon className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
                  {f.text}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      {/* Gli ambienti: asymmetric interiors */}
      <div className="villa-section py-16 md:py-28">
        <div className="villa-container grid md:grid-cols-12 gap-6 md:gap-10 items-start">
          <Reveal className="md:col-span-4 md:sticky md:top-28">
            <p className="eyebrow mb-4">{t("rooms.eyebrow")}</p>
            <h3 className="font-display font-medium text-3xl md:text-5xl leading-tight mb-5">
              {t("rooms.title")} <span className="italic font-normal text-primary">{t("rooms.titleEmph")}</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">{t("rooms.body")}</p>
          </Reveal>
          <Reveal className="md:col-span-5" delay={0.05}>
            <figure>
              <img src={living.url} alt={t("rooms.livingAlt")} loading="lazy" decoding="async" className="w-full aspect-[4/5] object-cover rounded-villa" />
              <figcaption className="mt-3 text-xs tracking-[0.15em] uppercase text-muted-foreground">{t("rooms.livingCap")}</figcaption>
            </figure>
          </Reveal>
          <Reveal className="md:col-span-3 md:mt-40" delay={0.15}>
            <figure>
              <img src={bedroom.url} alt={t("rooms.bedAlt")} loading="lazy" decoding="async" className="w-full aspect-[3/4] object-cover rounded-villa" />
              <figcaption className="mt-3 text-xs tracking-[0.15em] uppercase text-muted-foreground">{t("rooms.bedCap")}</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default VillaSection;
