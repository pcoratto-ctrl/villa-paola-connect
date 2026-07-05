import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";

export const villaFaqs = [
  {
    q: "Quanto dista Villa Paola Caposuvero dal mare?",
    a: "La villa si trova a pochi passi dal mare, con accesso diretto alla spiaggia: non devi attraversare strade trafficate per raggiungere la costa.",
  },
  {
    q: "Quante persone può ospitare la villa?",
    a: "Villa Paola Caposuvero dispone di 3 camere da letto, 2 bagni e può ospitare comodamente famiglie e piccoli gruppi fino a 6+ persone.",
  },
  {
    q: "È adatta alle famiglie?",
    a: "Sì. Gli spazi ampi, la posizione riservata e l'accesso diretto al mare rendono la villa perfetta per famiglie che cercano tranquillità, mare e privacy.",
  },
  {
    q: "Quanto dista dall'aeroporto di Lamezia Terme?",
    a: "La villa è in una posizione molto comoda per chi arriva dall'aeroporto internazionale di Lamezia Terme, a breve distanza in auto.",
  },
  {
    q: "Come posso verificare la disponibilità?",
    a: "Puoi compilare il modulo 'Richiedi disponibilità' su questo sito, scriverci su WhatsApp o chiamarci direttamente. Ti risponderemo con disponibilità e un preventivo personalizzato.",
  },
  {
    q: "Gli animali sono ammessi?",
    a: "Sì, gli animali domestici sono benvenuti a Villa Paola Caposuvero. Segnalaci la presenza del tuo animale al momento della richiesta.",
  },
];

interface Props {
  faqs?: { q: string; a: string }[];
  includeSchema?: boolean;
}

const FaqSection = ({ faqs = villaFaqs, includeSchema = true }: Props) => {
  return (
    <section id="faq" className="villa-section py-24 md:py-32">
      {includeSchema && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            })}
          </script>
        </Helmet>
      )}

      <div className="villa-container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-12 text-center"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Domande frequenti
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            Le risposte prima <span className="italic">di partire.</span>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left font-medium text-foreground text-base md:text-lg hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
