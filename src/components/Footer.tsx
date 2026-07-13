import { Phone, MapPin, Mail, MessageCircle, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logoAsset from "@/assets/villa-paola-logo-footer.png.asset.json";

const EMAIL = "R.falvo@agenzietripodi.com";
const PHONE_NUMBER = "+393355384250";
const WHATSAPP_URL = "https://wa.me/393355384250";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61588044700058&sk=reviews";

const Footer = () => {
  const { t } = useTranslation();

  const seoLinks = [
    { to: "/villa-sul-mare-calabria", label: t("footer.seo.seaVilla") },
    { to: "/villa-accesso-diretto-spiaggia-calabria", label: t("footer.seo.beach") },
    { to: "/casa-vacanze-gizzeria", label: t("footer.seo.gizzeria") },
    { to: "/villa-vicino-aeroporto-lamezia", label: t("footer.seo.airport") },
    { to: "/villa-per-famiglie-calabria", label: t("footer.seo.family") },
    { to: "/villa-pet-friendly-calabria", label: t("footer.seo.pet") },
    { to: "/vacanze-settembre-calabria", label: t("footer.seo.september") },
  ];

  const exploreLinks = [
    { l: t("footer.links.villa"), h: "/#villa" },
    { l: t("footer.links.why"), h: "/#perche" },
    { l: t("footer.links.services"), h: "/#servizi" },
    { l: t("footer.links.gallery"), h: "/#galleria" },
    { l: t("footer.links.reviews"), h: "/#recensioni" },
    { l: t("footer.links.availability"), h: "/#disponibilita" },
    { l: t("footer.links.faq"), h: "/#faq" },
  ];

  return (
    <footer className="villa-section py-16 md:py-20" style={{ backgroundColor: "#111820", color: "rgba(255,255,255,0.75)" }}>
      <div className="villa-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-1 flex flex-col items-start">
            <img src={logoAsset.url} alt="Villa Paola Caposuvero logo" className="w-[200px] md:w-[280px] h-auto object-contain mb-4" />
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <p className="font-medium text-white/90 text-sm mb-4">{t("footer.explore")}</p>
            <nav className="flex flex-col gap-2">
              {exploreLinks.map((i) => (
                <a key={i.h} href={i.h} className="text-white/60 text-sm hover:text-white transition-colors">{i.l}</a>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-medium text-white/90 text-sm mb-4">{t("footer.learnMore")}</p>
            <nav className="flex flex-col gap-2">
              {seoLinks.map((s) => (
                <Link key={s.to} to={s.to} className="text-white/60 text-sm hover:text-white transition-colors">{s.label}</Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-medium text-white/90 text-sm mb-4">{t("footer.contactsTitle")}</p>
            <div className="flex flex-col gap-3">
              <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                {t("footer.phone")}
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                {t("footer.whatsapp")}
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors">
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                {t("footer.email")}
              </a>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors">
                <Facebook className="w-4 h-4" strokeWidth={1.5} />
                {t("footer.facebook")}
              </a>
              <div className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="whitespace-pre-line">{t("footer.address")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col gap-4">
          <nav className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
            <Link to="/privacy-policy" className="text-white/60 text-xs hover:text-white transition-colors">{t("footer.privacy")}</Link>
            <Link to="/cookie-policy" className="text-white/60 text-xs hover:text-white transition-colors">{t("footer.cookies")}</Link>
            <Link to="/termini-condizioni" className="text-white/60 text-xs hover:text-white transition-colors">{t("footer.terms")}</Link>
          </nav>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-white/60 text-xs text-center md:text-left">
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </p>
            <p className="text-white/60 text-xs text-center md:text-right">
              {t("footer.cin")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
