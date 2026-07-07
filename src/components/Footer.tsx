import { Phone, MapPin, Mail, MessageCircle, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import logoAsset from "@/assets/villa-paola-logo-footer.png.asset.json";

const EMAIL = "R.falvo@agenzietripodi.com";
const PHONE_NUMBER = "+393355384250";
const WHATSAPP_URL = "https://wa.me/393355384250";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61588044700058&sk=reviews";

const seoLinks = [
  { to: "/villa-sul-mare-calabria", label: "Villa sul mare in Calabria" },
  { to: "/villa-accesso-diretto-spiaggia-calabria", label: "Villa con accesso diretto alla spiaggia" },
  { to: "/casa-vacanze-gizzeria", label: "Casa vacanze a Gizzeria" },
  { to: "/villa-vicino-aeroporto-lamezia", label: "Villa vicino aeroporto Lamezia" },
  { to: "/villa-per-famiglie-calabria", label: "Villa per famiglie in Calabria" },
  { to: "/villa-pet-friendly-calabria", label: "Villa pet friendly in Calabria" },
  { to: "/vacanze-settembre-calabria", label: "Vacanze a settembre in Calabria" },
];

const Footer = () => {
  return (
    <footer
      className="villa-section py-16 md:py-20"
      style={{ backgroundColor: "#111820", color: "rgba(255,255,255,0.75)" }}
    >
      <div className="villa-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-1 flex flex-col items-start">
            <img
              src={logoAsset.url}
              alt="Villa Paola Caposuvero logo"
              className="w-[200px] md:w-[280px] h-auto object-contain mb-4"
            />
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              Villa sul mare con accesso diretto alla spiaggia a Gizzeria, Calabria.
            </p>
          </div>

          <div>
            <p className="font-medium text-white/90 text-sm mb-4">Esplora</p>
            <nav className="flex flex-col gap-2">
              {[
                { l: "La Villa", h: "/#villa" },
                { l: "Perché sceglierla", h: "/#perche" },
                { l: "Servizi", h: "/#servizi" },
                { l: "Galleria", h: "/#galleria" },
                { l: "Recensioni", h: "/#recensioni" },
                { l: "Disponibilità", h: "/#disponibilita" },
                { l: "FAQ", h: "/#faq" },
              ].map((i) => (
                <a key={i.h} href={i.h} className="text-white/60 text-sm hover:text-white transition-colors">
                  {i.l}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-medium text-white/90 text-sm mb-4">Approfondisci</p>
            <nav className="flex flex-col gap-2">
              {seoLinks.map((s) => (
                <Link key={s.to} to={s.to} className="text-white/60 text-sm hover:text-white transition-colors">
                  {s.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-medium text-white/90 text-sm mb-4">Contatti</p>
            <div className="flex flex-col gap-3">
              <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                +39 335 538 4250
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                Scrivici su WhatsApp
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors">
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                Contattaci via email
              </a>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 text-sm hover:text-white transition-colors">
                <Facebook className="w-4 h-4" strokeWidth={1.5} />
                Recensioni su Facebook
              </a>
              <div className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>SS18, Contrada Caposuvero 31<br />Gizzeria Lido, Calabria, Italia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col gap-4">
          <nav className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
            <Link to="/privacy-policy" className="text-white/60 text-xs hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/cookie-policy" className="text-white/60 text-xs hover:text-white transition-colors">Cookie Policy</Link>
            <Link to="/termini-condizioni" className="text-white/60 text-xs hover:text-white transition-colors">Termini e condizioni</Link>
          </nav>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-white/60 text-xs text-center md:text-left">
              © {new Date().getFullYear()} Villa Paola Caposuvero — SS18, Contrada Caposuvero 31, Gizzeria Lido, Calabria
            </p>
            <p className="text-white/60 text-xs text-center md:text-right">
              CIN: IT079060C299OUQTIW · CIR: 079060-AAT-00018
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
