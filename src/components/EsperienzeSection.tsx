import { useTranslation } from "react-i18next";
import Reveal from "@/components/restyle/Reveal";

const B = "/images/villa-paola-restyle";

const EsperienzeSection = () => {
  const { t } = useTranslation();
  return (
    <section id="esperienze" className="py-24 md:py-36">
      <div className="villa-section">
        <Reveal className="villa-container max-w-3xl text-center mx-auto mb-14 md:mb-20">
          <p className="eyebrow mb-5">{t("exp.eyebrow")}</p>
          <h2 className="font-display font-medium text-[2.4rem] sm:text-5xl lg:text-6xl leading-[1.04] mb-6">
            {t("exp.title")} <span className="italic font-normal text-primary">{t("exp.titleEmph")}</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{t("exp.body")}</p>
        </Reveal>
      </div>

      {/* Wide lunch photo, near full-bleed */}
      <Reveal className="md:px-8 lg:px-16">
        <img src={`${B}/terrazza-pranzo-vista-mare.webp`} alt={t("exp.lunchAlt")} width={2200} height={1238} loading="lazy" decoding="async" className="w-full aspect-[16/10] md:aspect-[2200/1000] object-cover md:rounded-villa" />
      </Reveal>

      {/* Asymmetric trio */}
      <div className="villa-section mt-6 md:mt-10">
        <div className="villa-container grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-8 items-start">
          <Reveal className="col-span-2 md:col-span-6">
            <img src={`${B}/terrazza-divano-fronte-mare.webp`} alt={t("exp.sofaAlt")} width={1920} height={1440} loading="lazy" decoding="async" className="w-full aspect-[4/3] object-cover rounded-villa" />
          </Reveal>
          <Reveal className="md:col-span-3 md:mt-24" delay={0.08}>
            <figure>
              <img src={`${B}/colazione-terrazza.webp`} alt={t("exp.breakfastAlt")} width={1124} height={1463} loading="lazy" decoding="async" className="w-full aspect-[3/4] object-cover rounded-villa" />
              <figcaption className="mt-3 font-display italic text-lg text-muted-foreground">{t("exp.capMorning")}</figcaption>
            </figure>
          </Reveal>
          <Reveal className="md:col-span-3 md:mt-48" delay={0.16}>
            <figure>
              <img src={`${B}/aperitivo-giardino-mare.webp`} alt={t("exp.aperitifAlt")} width={1152} height={1152} loading="lazy" decoding="async" className="w-full aspect-square object-cover rounded-villa" />
              <figcaption className="mt-3 font-display italic text-lg text-muted-foreground">{t("exp.capEvening")}</figcaption>
            </figure>
          </Reveal>
        </div>
        <Reveal className="villa-container">
          <p className="text-sm text-muted-foreground mt-8 md:mt-4 max-w-md">{t("exp.note")}</p>
        </Reveal>
      </div>
    </section>
  );
};
export default EsperienzeSection;
