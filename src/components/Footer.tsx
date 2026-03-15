import { Phone, MapPin, Mail } from "lucide-react";

const PHONE_NUMBER = "+393355384250";

const Footer = () => {
  return (
    <footer className="villa-section py-16 md:py-20 border-t border-border">
      <div className="villa-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl text-foreground mb-3">Villa Paola Caposuvero</p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Casa vacanze elegante con vista mare a Gizzeria, Calabria. 
              Il rifugio perfetto per la vostra vacanza al mare.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-medium text-foreground text-sm mb-4">Esplora</p>
            <nav className="flex flex-col gap-2">
              {["La Villa", "Servizi", "Galleria", "Posizione", "Contatti"].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase().replace(" ", "").replace("lavilla", "villa")}`}
                  className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <p className="font-medium text-foreground text-sm mb-4">Contatti</p>
            <div className="flex flex-col gap-3">
              <a href={`tel:${PHONE_NUMBER}`} className="flex items-center gap-3 text-muted-foreground text-sm hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                +39 335 538 4250
              </a>
              <div className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>Contrada Caposuvero<br />Gizzeria Lido, Calabria, Italia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Villa Paola Caposuvero. Tutti i diritti riservati.
          </p>
          <p className="text-muted-foreground text-xs">
            Contrada Caposuvero, Gizzeria Lido, Calabria
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
