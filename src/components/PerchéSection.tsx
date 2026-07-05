import { motion } from "framer-motion";
import { Waves, ShieldCheck, Users, MapPin } from "lucide-react";

const cards = [
  {
    icon: Waves,
    title: "Mare senza pensieri",
    text: "Esci di casa e sei già vicino al mare, senza stress e senza lunghi spostamenti.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy e tranquillità",
    text: "Una villa pensata per chi vuole staccare davvero, lontano dal rumore e dalla confusione.",
  },
  {
    icon: Users,
    title: "Perfetta per famiglie e gruppi",
    text: "Spazi comodi, camere indipendenti e ambienti pensati per condividere la vacanza senza rinunciare alla privacy.",
  },
  {
    icon: MapPin,
    title: "Posizione strategica",
    text: "A Gizzeria, vicino a Lamezia Terme, alla costa tirrenica calabrese e ai principali punti di interesse della zona.",
  },
];

const PerchéSection = () => {
  return (
    <section id="perche" className="villa-section py-24 md:py-32">
      <div className="villa-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-2xl mb-14"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Perché scegliere Villa Paola
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            Perché qui la vacanza <span className="italic">è più semplice.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
              className="p-6 md:p-8 rounded-villa bg-card shadow-soft border border-border h-full"
            >
              <c.icon className="w-8 h-8 text-primary mb-5" strokeWidth={1.5} />
              <h3 className="font-display text-xl text-foreground mb-3">{c.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerchéSection;
