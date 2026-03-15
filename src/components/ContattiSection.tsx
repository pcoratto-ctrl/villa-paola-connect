import { motion } from "framer-motion";
import { Phone, MessageCircle, Clock, MapPin, Mail } from "lucide-react";

const PHONE_NUMBER = "+393355384250";
const EMAIL = "R.falfo@agenzietripodi.com";
const WHATSAPP_URL = `https://wa.me/393355384250?text=Buongiorno%2C%20vorrei%20informazioni%20su%20Villa%20Paola%20Caposuvero`;

const ContattiSection = () => {
  return (
    <section id="contatti" className="villa-section py-24 md:py-32">
      <div className="villa-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Contatti
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Prenota la tua <span className="italic">vacanza</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Per informazioni, disponibilità e prenotazioni, contattaci direttamente. 
            Saremo felici di aiutarti a organizzare il soggiorno perfetto.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-lg mx-auto"
        >
          <div className="p-8 md:p-12 rounded-villa bg-card shadow-card border border-border text-center">
            {/* Phone */}
            <Phone className="w-10 h-10 text-primary mx-auto mb-6" strokeWidth={1.5} />
            <p className="font-display text-2xl text-foreground mb-2">Chiamaci</p>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="font-display text-3xl md:text-4xl text-primary hover:opacity-80 transition-opacity"
            >
              +39 335 538 4250
            </a>

            <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground text-sm">
              <Clock className="w-4 h-4" strokeWidth={1.5} />
              <span>Lun – Dom, 9:00 – 20:00</span>
            </div>

            <div className="my-8 h-px bg-border" />

            {/* CTAs */}
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-primary text-primary-foreground text-base font-medium shadow-cta hover:shadow-elevated transition-all duration-200 active:scale-95"
              >
                <Phone className="w-5 h-5" strokeWidth={1.5} />
                Prenota ora
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-accent text-accent-foreground text-base font-medium hover:opacity-90 transition-all duration-200 active:scale-95"
              >
                <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                Scrivici su WhatsApp
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border border-border text-foreground text-base font-medium hover:bg-muted transition-all duration-200 active:scale-95"
              >
                <Mail className="w-5 h-5" strokeWidth={1.5} />
                Scrivici una email
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4" strokeWidth={1.5} />
              <span>Contrada Caposuvero, Gizzeria Lido, Calabria</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContattiSection;
