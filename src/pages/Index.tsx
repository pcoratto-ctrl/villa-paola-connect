import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VillaSection from "@/components/VillaSection";
import ServiziSection from "@/components/ServiziSection";
import GalleriaSection from "@/components/GalleriaSection";
import RecensioniSection from "@/components/RecensioniSection";
import PosizioneSection from "@/components/PosizioneSection";
import ContattiSection from "@/components/ContattiSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import MobileCta from "@/components/MobileCta";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <VillaSection />
        <ServiziSection />
        <GalleriaSection />
        <RecensioniSection />
        <PosizioneSection />
        <ContattiSection />
        <CtaSection />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
};

export default Index;
