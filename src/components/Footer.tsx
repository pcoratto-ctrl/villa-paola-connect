import { Phone, MapPin, Mail, MessageCircle, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import logoAsset from "@/assets/villa-paola-logo.jpg.asset.json";

const EMAIL = "R.falvo@agenzietripodi.com";
const PHONE_NUMBER = "+393355384250";
const WHATSAPP_URL = "https://wa.me/393355384250";
const FACEBOOK_URL = "https://www.facebook.com/share/1GR9Wac3ns/";

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
    <footer className="villa-section py-16 md:py-20 border-t border-border bg-background">
      <div className="villa-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-1">
            <img
              src={logoAsset.url}
              alt="Villa Paola Caposuvero logo"
              className="h-14 w-auto object-contain mb-4"
            />
            <p className="font-display text-lg text-foreground mb-2">Villa Paola Caposuvero</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Villa sul mare con accesso diretto alla spiaggia a Gizzeria, Calabria.
            </p>
          </div>

          <div>
            <p className="font-medium text-foreground text-sm mb-4">Esplora</p>
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
                <a key={i.h} href={i.h} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  {i.l}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-medium text-foreground text-sm mb-4">Approfondisci</p>
            <nav className="flex flex-col gap-2">
              {seoLinks.map((s) => (
                <Link key={s.to} to={s.to} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  {s.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-medium text-foreground text-sm mb-4">Contatti</p>
            <div className="flex flex-col gap-3">
              <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-3 text-muted-foreground text-sm hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                +39 335 538 4250
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground text-sm hover:text-foreground transition-colors">
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                Scrivici su WhatsApp
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-muted-foreground text-sm hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                Contattaci via email
              </a>
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground text-sm hover:text-foreground transition-colors">
                <Facebook className="w-4 h-4" strokeWidth={1.5} />
                Recensioni su Facebook
              </a>
              <div className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>SS18, Contrada Caposuvero 31<br />Gizzeria Lido, Calabria, Italia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Villa Paola Caposuvero. Tutti i diritti riservati.
          </p>
          <p className="text-muted-foreground text-xs">
            SS18, Contrada Caposuvero 31, Gizzeria Lido, Calabria
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
