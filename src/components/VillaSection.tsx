import { motion } from "framer-motion";
import { Bed, Bath, Maximize, Users, Waves, Eye, PawPrint, Plane } from "lucide-react";

const stats = [
  { icon: Maximize, value: "120 m²", label: "Superficie" },
  { icon: Bed, value: "3", label: "Camere da letto" },
  { icon: Bath, value: "2", label: "Bagni" },
  { icon: Users, value: "6+", label: "Ospiti" },
];

const features = [
  { icon: Waves, text: "Accesso diretto alla spiaggia" },
  { icon: Eye, text: "Vista mare" },
  { icon: Users, text: "Ideale per famiglie" },
  { icon: Plane, text: "Vicino all'aeroporto di Lamezia Terme" },
  { icon: PawPrint, text: "Animali ammessi" },
];

const VillaSection = () => {
  return (
    <section id="villa" className="villa-section py-24 md:py-32">
      <div className="villa-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-3xl mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">La Villa</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
            Una villa sul mare pensata per vivere{" "}
            <span className="italic text-primary">la Calabria senza filtri.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Villa Paola Caposuvero è una residenza luminosa e accogliente a pochi passi
            dal mare di Gizzeria. Gli spazi ampi, la terrazza, le camere confortevoli e
            la posizione riservata la rendono ideale per famiglie e piccoli gruppi che
            cercano una vacanza semplice, autentica e rilassante.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="p-6 md:p-8 rounded-villa bg-card shadow-soft border border-border">
              <stat.icon className="w-6 h-6 text-primary mb-4" strokeWidth={1.5} />
              <p className="font-display text-3xl md:text-4xl text-foreground mb-1">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-16"
        >
          {features.map((f) => (
            <li key={f.text} className="flex items-center gap-3 p-4 rounded-xl bg-villa-warm-white border border-border">
              <f.icon className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.5} />
              <span className="text-foreground text-sm font-medium">{f.text}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="p-3 bg-card rounded-villa shadow-soft border border-border">
            <div className="rounded-[calc(1.5rem-12px)] overflow-hidden">
              <img
                src="/images/villa-3.jpg"
                alt="Soggiorno luminoso di Villa Paola Caposuvero a Gizzeria"
                className="w-full h-[300px] md:h-[400px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="p-3 bg-card rounded-villa shadow-soft border border-border">
            <div className="rounded-[calc(1.5rem-12px)] overflow-hidden">
              <img
                src="/images/villa-16.jpg"
                alt="Terrazza vista mare di Villa Paola Caposuvero"
                className="w-full h-[300px] md:h-[400px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VillaSection;
