import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RecensioniHighlight from "@/components/RecensioniHighlight";
import VillaSection from "@/components/VillaSection";
import MareSection from "@/components/MareSection";
import EsperienzeSection from "@/components/EsperienzeSection";
import CalabriaSection from "@/components/CalabriaSection";
import AmbientiSection from "@/components/AmbientiSection";
import ServiziSection from "@/components/ServiziSection";
import GalleriaSection from "@/components/GalleriaSection";
import PosizioneSection from "@/components/PosizioneSection";
import ExploreAreaSection from "@/components/ExploreAreaSection";
import DisponibilitaSection from "@/components/DisponibilitaSection";
import FaqSection from "@/components/FaqSection";
import ContattiSection from "@/components/ContattiSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import MobileCta from "@/components/MobileCta";

const Index = () => {
  const { t, i18n } = useTranslation();
  const { search } = useLocation();
  const routeLang = new URLSearchParams(search).get("lang") === "en" ? "en" : "it";
  useEffect(() => { if (i18n.language !== routeLang) void i18n.changeLanguage(routeLang); }, [i18n, routeLang]);
  return (
    <>
      <Helmet>
        <html lang={i18n.language} />
        <title>{t("index.title")}</title>
        <meta name="description" content={t("index.description")} />
        <link rel="canonical" href="https://villapaolacaposuvero.it/" />
        <meta property="og:url" content="https://villapaolacaposuvero.it/" />
        <meta property="og:title" content={t("index.title")} />
        <meta property="og:description" content={t("index.description")} />
      </Helmet>
      <Navbar />
      <main>
        <HeroSection />
        <VillaSection />
        <MareSection />
        <EsperienzeSection />
        <AmbientiSection />
        <ServiziSection />
        <GalleriaSection />
        <CalabriaSection />
        <PosizioneSection />
        <ExploreAreaSection />
        <RecensioniHighlight />
        <DisponibilitaSection />
        <FaqSection />
        <ContattiSection />
        <CtaSection />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
};

export default Index;
