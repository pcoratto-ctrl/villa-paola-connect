import { Bed, Bath, Maximize, Users, Waves, Eye, PawPrint, Plane } from "lucide-react";
import { useTranslation } from "react-i18next";
import Reveal from "@/components/restyle/Reveal";

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
            <h2 className="font-display font-medium text-[2.4rem] sm:text-5xl lg:text-6xl leading-[1.04] text-foreground">
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
                <p className="font-display text-4xl md:text-5xl text-foreground leading-none mb-2">{s.value}</p>
                <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase">{s.label}</p>
              </div>
            ))}
          </Reveal>
          <Reveal>
            <ul className="flex flex-wrap gap-x-8 gap-y-3 py-8">
              {features.map((f) => (
                <li key={f.text} className="flex items-center gap-2.5 text-sm text-foreground">
                  <span aria-hidden className="w-1 h-1 bg-accent rounded-full" />
                  {f.text}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      {/* Il giardino: vertical + wide, asymmetric, centered statement */}
      <div className="villa-section py-20 md:py-32">
        <div className="villa-container">
          <Reveal className="max-w-2xl mx-auto text-center mb-12 md:mb-20">
            <p className="eyebrow mb-4">{t("garden.eyebrow")}</p>
            <h3 className="font-display font-medium text-3xl md:text-5xl leading-tight mb-5">
              {t("garden.title")} <span className="italic font-normal text-primary">{t("garden.titleEmph")}</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">{t("garden.body")}</p>
          </Reveal>
          <div className="grid grid-cols-12 gap-3 md:gap-8 items-end">
            <Reveal className="col-span-5 md:col-span-4">
              <img src="/images/villa-paola-restyle/villa-vialetto-giardino.webp" alt={t("garden.pathAlt")} width={1200} height={1600} loading="lazy" decoding="async" className="w-full aspect-[3/4] object-cover rounded-villa" />
            </Reveal>
            <Reveal className="col-span-7 md:col-span-8" delay={0.08}>
              <img src="/images/villa-paola-restyle/villa-esterno-giardino.webp" alt={t("garden.houseAlt")} width={1920} height={1389} loading="lazy" decoding="async" className="w-full aspect-[1920/1389] object-cover rounded-villa" />
            </Reveal>
            <Reveal className="col-span-12 md:col-span-6 md:col-start-5 mt-3 md:mt-8" delay={0.12}>
              <img src="/images/villa-paola-restyle/giardino-mare-luce.webp" alt={t("garden.lightAlt")} width={1920} height={1440} loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover rounded-villa" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VillaSection;
