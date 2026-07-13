import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RecensioniHighlight from "@/components/RecensioniHighlight";
import VillaSection from "@/components/VillaSection";
import PerchéSection from "@/components/PerchéSection";
import ServiziSection from "@/components/ServiziSection";
import GalleriaSection from "@/components/GalleriaSection";
import PosizioneSection from "@/components/PosizioneSection";
import DisponibilitaSection from "@/components/DisponibilitaSection";
import FaqSection from "@/components/FaqSection";
import ContattiSection from "@/components/ContattiSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import MobileCta from "@/components/MobileCta";

const Index = () => {
  const { t, i18n } = useTranslation();
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
        <RecensioniHighlight />
        <VillaSection />
        <PerchéSection />
        <ServiziSection />
        <GalleriaSection />
        <PosizioneSection />
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
