import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export interface FaqItem { q: string; a: string }

interface Props {
  faqs?: FaqItem[];
  includeSchema?: boolean;
}

const FaqSection = ({ faqs, includeSchema = true }: Props) => {
  const { t } = useTranslation();
  const items = (faqs ?? (t("faq.items", { returnObjects: true }) as FaqItem[]));

  return (
    <section id="faq" className="villa-section py-24 md:py-32">
      {includeSchema && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: items.map((f) => ({
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
            {t("faq.eyebrow")}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground">
            {t("faq.titleStart")} <span className="italic">{t("faq.titleEmph")}</span>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="w-full">
          {items.map((f, i) => (
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
