import { motion } from "framer-motion";
import { Bed, Bath, Maximize, Users } from "lucide-react";

const stats = [
  { icon: Maximize, value: "120 m²", label: "Superficie" },
  { icon: Bed, value: "3", label: "Camere da letto" },
  { icon: Bath, value: "2", label: "Bagni" },
  { icon: Users, value: "6+", label: "Ospiti" },
];

const VillaSection = () => {
  return (
    <section id="villa" className="villa-section py-24 md:py-32">
      <div className="villa-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-2xl mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            La Villa
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Il vostro rifugio
            <br />
            <span className="italic text-primary">sul mare</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Villa Paola Caposuvero è un'elegante residenza di 120 m² immersa nella luce della costa calabrese, 
            a pochi passi dal mare di Gizzeria. Tre camere da letto, due bagni, una terrazza con vista mare 
            e ogni comfort pensato per famiglie e piccoli gruppi che cercano privacy, bellezza e autenticità.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-6 md:p-8 rounded-villa bg-card shadow-soft border border-border"
            >
              <stat.icon className="w-6 h-6 text-primary mb-4" strokeWidth={1.5} />
              <p className="font-display text-3xl md:text-4xl text-foreground mb-1">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Image Grid */}
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
                alt="Soggiorno luminoso della villa"
                className="w-full h-[300px] md:h-[400px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="p-3 bg-card rounded-villa shadow-soft border border-border">
            <div className="rounded-[calc(1.5rem-12px)] overflow-hidden">
              <img
                src="/images/villa-5.jpg"
                alt="Camera da letto con vista"
                className="w-full h-[300px] md:h-[400px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="mt-16 max-w-3xl"
        >
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            Gli interni, luminosi e arredati con gusto contemporaneo, includono un ampio soggiorno, 
            una cucina completamente attrezzata con forno, microonde, lavastoviglie e tutti gli utensili necessari, 
            e una zona pranzo esterna perfetta per cene sotto le stelle.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            La villa dispone inoltre di lavatrice, TV a schermo piatto, armadi spaziosi, 
            biancheria e asciugamani, barbecue e un patio privato dove godersi la brezza marina 
            in completa tranquillità.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default VillaSection;
