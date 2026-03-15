import { motion } from "framer-motion";
import { MapPin, Plane, UtensilsCrossed, Waves, Navigation } from "lucide-react";

const nearbyPlaces = [
  { icon: Waves, label: "Spiaggia", distance: "A pochi passi" },
  { icon: Plane, label: "Aeroporto di Lamezia Terme", distance: "~15 minuti" },
  { icon: UtensilsCrossed, label: "Lido Mediterraneo", distance: "Nelle vicinanze" },
  { icon: Navigation, label: "Centro di Gizzeria", distance: "Breve distanza" },
];

const PosizioneSection = () => {
  return (
    <section id="posizione" className="villa-section py-24 md:py-32 bg-villa-warm-white">
      <div className="villa-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-2xl mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Posizione
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Nel cuore della <span className="italic">costa calabrese</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Villa Paola Caposuvero si trova a Gizzeria Lido, nella splendida Contrada Caposuvero, 
            in una posizione privilegiata tra il mare cristallino della Calabria e l'entroterra verde. 
            L'aeroporto internazionale di Lamezia Terme è raggiungibile in soli 15 minuti.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="p-3 bg-card rounded-villa shadow-soft border border-border"
          >
            <div className="rounded-[calc(1.5rem-12px)] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67890!2d16.2!3d38.98!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDU4JzQ4LjAiTiAxNsKwMTInMDAuMCJF!5e0!3m2!1sit!2sit!4v1600000000000!5m2!1sit!2sit"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Posizione Villa Paola Caposuvero"
                className="w-full h-[350px] md:h-[450px]"
              />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Address Card */}
            <div className="p-6 md:p-8 rounded-villa bg-card shadow-soft border border-border">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" strokeWidth={1.5} />
                <div>
                  <p className="font-medium text-foreground mb-1">Indirizzo</p>
                  <p className="text-muted-foreground">
                    Contrada Caposuvero<br />
                    Gizzeria Lido, Calabria, Italia
                  </p>
                </div>
              </div>
            </div>

            {/* Nearby Places */}
            <div className="p-6 md:p-8 rounded-villa bg-card shadow-soft border border-border">
              <h3 className="font-display text-2xl text-foreground mb-6">Nei dintorni</h3>
              <div className="flex flex-col gap-5">
                {nearbyPlaces.map((place) => (
                  <div key={place.label} className="flex items-center gap-4">
                    <place.icon className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.5} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{place.label}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{place.distance}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Tip */}
            <div className="p-6 md:p-8 rounded-villa bg-villa-sea-light border border-primary/10">
              <p className="text-sm font-medium text-primary mb-2">Consiglio locale</p>
              <p className="text-foreground text-sm leading-relaxed">
                Per una cena memorabile, vi consigliamo il <strong>Lido Mediterraneo</strong>, 
                a breve distanza dalla villa. Pesce freschissimo e tramonti indimenticabili.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PosizioneSection;
