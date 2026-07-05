import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CalendarCheck, MessageCircle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileCta from "@/components/MobileCta";
import PerchéSection from "@/components/PerchéSection";
import PosizioneSection from "@/components/PosizioneSection";
import RecensioniHighlight from "@/components/RecensioniHighlight";
import FaqSection from "@/components/FaqSection";
import DisponibilitaSection from "@/components/DisponibilitaSection";
import heroAsset from "@/assets/villa/hero-desktop.webp.asset.json";

const WHATSAPP_URL =
  "https://wa.me/393355384250?text=" +
  encodeURIComponent(
    "Buongiorno, vorrei verificare la disponibilità di Villa Paola Caposuvero per queste date:"
  );

export interface SeoLandingPageProps {
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  intro: string;
  body: string[];
  faqs?: { q: string; a: string }[];
}

const SeoLandingPage = ({ slug, title, description, h1, eyebrow, intro, body, faqs }: SeoLandingPageProps) => {
  const canonical = `https://villapaolacaposuvero.it/${slug}`;
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
      </Helmet>

      <Navbar />
      <main>
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img src={heroAsset.url} alt="Villa Paola Caposuvero, Gizzeria" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background" />
          </div>
          <div className="villa-section">
            <div className="villa-container max-w-4xl">
              <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-6">
                <ArrowLeft className="w-4 h-4" /> Torna alla home
              </Link>
              <p className="text-primary-foreground/85 text-sm font-medium tracking-widest uppercase mb-4">
                {eyebrow}
              </p>
              <h1 className="font-display text-4xl md:text-6xl text-primary-foreground leading-tight mb-6">
                {h1}
              </h1>
              <p className="text-primary-foreground/90 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
                {intro}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#disponibilita"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground text-base font-medium shadow-cta hover:shadow-elevated transition-all"
                >
                  <CalendarCheck className="w-5 h-5" strokeWidth={1.5} />
                  Verifica la disponibilità
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary-foreground/15 backdrop-blur-md text-primary-foreground text-base font-medium border border-primary-foreground/25"
                >
                  <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                  Scrivici su WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="villa-section py-20 md:py-24">
          <div className="villa-container max-w-3xl space-y-6">
            {body.map((p, i) => (
              <p key={i} className="text-foreground text-lg leading-relaxed">
                {p}
              </p>
            ))}
            <p className="text-muted-foreground pt-4">
              Vuoi vedere la villa nel dettaglio?{" "}
              <Link to="/" className="text-primary font-medium hover:underline">
                Torna alla home di Villa Paola Caposuvero
              </Link>
              .
            </p>
          </div>
        </section>

        <PerchéSection />
        <PosizioneSection />
        <RecensioniHighlight />
        <DisponibilitaSection />
        <FaqSection faqs={faqs} />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
};

export default SeoLandingPage;
