import { useTranslation } from "react-i18next";
import { CalendarCheck } from "lucide-react";
import Reveal from "@/components/restyle/Reveal";
import VideoOnDemand from "@/components/restyle/VideoOnDemand";

const B = "/images/villa-paola-restyle";

const MareSection = () => {
  const { t } = useTranslation();
  return (
    <section id="mare" className="bg-primary text-primary-foreground py-20 md:pt-32 md:pb-44 villa-section overflow-hidden">
      <div className="villa-container grid md:grid-cols-12 gap-10 md:gap-14 items-center">
        <Reveal className="md:col-span-7 relative">
          <img
            src={`${B}/mare-muretto-bianco.webp`}
            alt={t("sea.imgAlt")}
            width={1920}
            height={1440}
            loading="lazy"
            decoding="async"
            className="w-full aspect-[4/3] object-cover rounded-villa"
          />
          <div className="hidden md:block absolute -bottom-16 -right-10 w-[38%]">
            <VideoOnDemand src={`${B}/video-accesso-mare.mp4`} poster={`${B}/video-accesso-mare-poster.webp`} label={t("sea.videoLabel")} alt={t("sea.videoAlt")} width={540} height={960} />
          </div>
        </Reveal>
        <Reveal className="md:col-span-5 md:pl-10" delay={0.1}>
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-primary-foreground/70 mb-5">{t("sea.eyebrow")}</p>
          <h2 className="font-display font-medium text-[2.4rem] sm:text-5xl lg:text-6xl leading-[1.04] mb-6">
            {t("sea.title")} <span className="italic font-normal">{t("sea.titleEmph")}</span>
          </h2>
          <p className="text-primary-foreground/85 text-lg leading-relaxed mb-4">{t("sea.body")}</p>
          <p className="text-primary-foreground/65 text-sm leading-relaxed mb-8">{t("sea.note")}</p>
          <div className="md:hidden max-w-[300px] mx-auto mb-8">
            <VideoOnDemand src={`${B}/video-accesso-mare.mp4`} poster={`${B}/video-accesso-mare-poster.webp`} label={t("sea.videoLabel")} alt={t("sea.videoAlt")} width={540} height={960} />
          </div>
          <a href="#disponibilita" className="inline-flex items-center gap-2.5 px-6 py-3.5 min-h-[50px] rounded-villa bg-primary-foreground text-primary font-semibold hover:bg-secondary transition-colors">
            <CalendarCheck className="w-5 h-5" strokeWidth={1.5} />
            {t("hero.ctaPrimary")}
          </a>
        </Reveal>
      </div>
    </section>
  );
};
export default MareSection;
