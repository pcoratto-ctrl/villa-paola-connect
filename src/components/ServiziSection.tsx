import { motion } from "framer-motion";
import {
  Wifi,
  Waves,
  Wind,
  Baby,
  PawPrint,
  UtensilsCrossed,
  Tv,
  WashingMachine,
  Flame,
  ShowerHead,
} from "lucide-react";

const amenities = [
  { icon: Wifi, label: "Wi-Fi gratuito", available: true },
  { icon: Waves, label: "Spiaggia privata", available: true },
  { icon: Wind, label: "Aria condizionata", available: true },
  { icon: UtensilsCrossed, label: "Cucina attrezzata", available: true },
  { icon: Baby, label: "Adatto ai bambini", available: true },
  { icon: Tv, label: "TV a schermo piatto", available: true },
  { icon: WashingMachine, label: "Lavatrice", available: true },
  { icon: Flame, label: "Barbecue", available: true },
  { icon: ShowerHead, label: "Biancheria e asciugamani", available: true },
  { icon: PawPrint, label: "Animali ammessi", available: true },
];

const ServiziSection = () => {
  return (
    <section id="servizi" className="villa-section py-24 md:py-32 bg-villa-warm-white">
      <div className="villa-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Servizi
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-6">
            Tutto ciò che serve per un <span className="italic">soggiorno perfetto</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Ogni dettaglio è pensato per il vostro comfort. Dalla cucina attrezzata alla spiaggia privata, 
            Villa Paola offre tutto il necessario per una vacanza senza pensieri.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {amenities.map((amenity) => (
            <div
              key={amenity.label}
              className={`flex flex-col items-center text-center p-6 rounded-villa bg-card shadow-soft border border-border transition-shadow duration-200 hover:shadow-card ${
                !amenity.available ? "opacity-50" : ""
              }`}
            >
              <amenity.icon
                className={`w-7 h-7 mb-4 ${
                  amenity.available ? "text-primary" : "text-muted-foreground"
                }`}
                strokeWidth={1.5}
              />
              <p className="text-sm font-medium text-foreground">{amenity.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Additional amenities list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground text-sm">
            E inoltre: frigorifero · forno · microonde · lavastoviglie · utensili da cucina · 
            zona pranzo esterna · patio · guardaroba · soggiorno
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiziSection;
