import { useTranslation } from "react-i18next";
import Reveal from "@/components/restyle/Reveal";
import VideoOnDemand from "@/components/restyle/VideoOnDemand";

const B = "/images/villa-paola-restyle";

const CalabriaSection = () => {
  const { t } = useTranslation();
  return (
    <section className="relative py-20 md:py-32 villa-section bg-secondary/40">
      <div className="villa-container grid md:grid-cols-12 gap-10 md:gap-12 items-center">
        <Reveal className="md:col-span-5 order-2 md:order-1">
          <VideoOnDemand src={`${B}/video-authentic-calabria.mp4`} poster={`${B}/video-authentic-calabria-poster.webp`} label={t("calabria.videoLabel")} alt={t("calabria.videoAlt")} width={960} height={960} />
        </Reveal>
        <Reveal className="md:col-span-7 order-1 md:order-2 md:pl-8" delay={0.1}>
          <p className="eyebrow mb-5">{t("calabria.eyebrow")}</p>
          <h2 className="font-display font-medium text-[2.4rem] sm:text-5xl lg:text-6xl leading-[1.04] mb-6">
            {t("calabria.title")} <span className="italic font-normal text-primary">{t("calabria.titleEmph")}</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">{t("calabria.body")}</p>
          <img src={`${B}/spiaggia-sole-sul-mare.webp`} alt={t("calabria.beachAlt")} width={1920} height={969} loading="lazy" decoding="async" className="hidden md:block w-full aspect-[1920/969] object-cover rounded-villa" />
        </Reveal>
      </div>
    </section>
  );
};
export default CalabriaSection;
