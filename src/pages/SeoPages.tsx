import { useTranslation } from "react-i18next";
import SeoLandingPage from "@/components/SeoLandingPage";

type Key = "seaVilla" | "beach" | "gizzeria" | "airport" | "family" | "pet" | "september";

function usePageContent(key: Key) {
  const { t } = useTranslation();
  return {
    title: t(`seoPages.${key}.title`),
    description: t(`seoPages.${key}.description`),
    eyebrow: t(`seoPages.${key}.eyebrow`),
    h1: t(`seoPages.${key}.h1`),
    intro: t(`seoPages.${key}.intro`),
    body: t(`seoPages.${key}.body`, { returnObjects: true }) as string[],
    faqs: t("faq.items", { returnObjects: true }) as { q: string; a: string }[],
  };
}

export const VillaSulMareCalabria = () => {
  const c = usePageContent("seaVilla");
  return <SeoLandingPage slug="villa-sul-mare-calabria" {...c} />;
};

export const VillaAccessoDirettoSpiaggia = () => {
  const c = usePageContent("beach");
  return <SeoLandingPage slug="villa-accesso-diretto-spiaggia-calabria" {...c} />;
};

export const CasaVacanzeGizzeria = () => {
  const c = usePageContent("gizzeria");
  return <SeoLandingPage slug="casa-vacanze-gizzeria" {...c} />;
};

export const VillaVicinoAeroportoLamezia = () => {
  const c = usePageContent("airport");
  return <SeoLandingPage slug="villa-vicino-aeroporto-lamezia" {...c} />;
};

export const VillaPerFamiglie = () => {
  const c = usePageContent("family");
  return <SeoLandingPage slug="villa-per-famiglie-calabria" {...c} />;
};

export const VillaPetFriendly = () => {
  const c = usePageContent("pet");
  return <SeoLandingPage slug="villa-pet-friendly-calabria" {...c} />;
};

export const VacanzeSettembre = () => {
  const c = usePageContent("september");
  return <SeoLandingPage slug="vacanze-settembre-calabria" {...c} />;
};
