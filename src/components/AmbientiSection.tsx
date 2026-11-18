import { useTranslation } from "react-i18next";
import Reveal from "@/components/restyle/Reveal";
import living from "@/assets/villa/gallery/10-soggiorno.webp.asset.json";

const B = "/images/villa-paola-restyle";
const items = [
  { key: "bedrooms", src: `${B}/interni-camera-doppia.webp` },
  { key: "living", src: living.url },
  { key: "kitchen", src: `${B}/interni-cucina-dettaglio.webp` },
  { key: "baths", src: `${B}/interni-bagno-dettaglio-ceramiche.webp` },
];

const AmbientiSection = () => {
  const { t } = useTranslation();
  return (
    <section id="ambienti" className="py-20 md:py-28 bg-secondary/30">
      <div className="villa-section">
        <div className="villa-container">
          <Reveal className="grid md:grid-cols-12 gap-6 md:gap-10 items-end mb-10 md:mb-14">
            <div className="md:col-span-6">
              <p className="eyebrow mb-4">{t("rooms.eyebrow")}</p>
              <h2 className="font-display font-medium text-3xl md:text-[2.75rem] leading-tight">
                {t("rooms.title")} <span className="italic font-normal text-primary">{t("rooms.titleEmph")}</span>
              </h2>
            </div>
            <p className="md:col-span-5 md:col-start-8 text-muted-foreground leading-relaxed">{t("rooms.body")}</p>
          </Reveal>
        </div>
      </div>
      {/* Mobile: compact horizontal scroll. Desktop: balanced 4-column grid. */}
      <div className="villa-section max-md:pr-0">
        <ul className="villa-container flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-2 pr-5 md:pr-0">
          {items.map((it, i) => (
            <li key={it.key} className="snap-start shrink-0 w-[72%] sm:w-[45%] md:w-auto">
              <Reveal delay={i * 0.05}>
                <img src={it.src} alt={t(`rooms.items.${it.key}.alt`)} loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover rounded-villa" />
                <h3 className="font-display text-xl md:text-2xl mt-4 mb-1.5">{t(`rooms.items.${it.key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`rooms.items.${it.key}.text`)}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
      <div className="villa-section">
        <div className="villa-container mt-8">
          <a href="#galleria" className="text-sm font-medium text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary">
            {t("rooms.more")}
          </a>
        </div>
      </div>
    </section>
  );
};
export default AmbientiSection;
