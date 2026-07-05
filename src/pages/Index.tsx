import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RecensioniHighlight from "@/components/RecensioniHighlight";
import VillaSection from "@/components/VillaSection";
import PerchéSection from "@/components/PerchéSection";
import ServiziSection from "@/components/ServiziSection";
import GalleriaSection from "@/components/GalleriaSection";
import RecensioniSection from "@/components/RecensioniSection";
import PosizioneSection from "@/components/PosizioneSection";
import DisponibilitaSection from "@/components/DisponibilitaSection";
import FaqSection from "@/components/FaqSection";
import ContattiSection from "@/components/ContattiSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import MobileCta from "@/components/MobileCta";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Villa Paola Caposuvero | Villa sul mare a Gizzeria, Calabria</title>
        <meta
          name="description"
          content="Villa sul mare a Gizzeria con accesso diretto alla spiaggia: 3 camere, terrazza vista mare, ideale per famiglie e piccoli gruppi. Verifica subito la disponibilità."
        />
        <link rel="canonical" href="https://villapaolacaposuvero.it/" />
        <meta property="og:url" content="https://villapaolacaposuvero.it/" />
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
        <RecensioniSection />
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
