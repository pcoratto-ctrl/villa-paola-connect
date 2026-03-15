import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TestimonialSection = () => {
  return (
    <section className="villa-section py-24 md:py-32 bg-villa-warm-white">
      <div className="villa-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-3xl mx-auto text-center">
          
          <div className="flex items-center justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) =>
            <Star key={i} className="w-5 h-5 fill-primary text-primary" strokeWidth={1.5} />
            )}
          </div>
          <blockquote className="font-display text-3xl md:text-4xl text-foreground leading-snug mb-8 italic">
            "Una villa meravigliosa, pulita, luminosa e con una vista sul mare che toglie il fiato. 
            I bambini hanno adorato la spiaggia e noi abbiamo finalmente trovato il relax che cercavamo."
          </blockquote>
          <div>
            <p className="font-medium text-foreground">
</p>
            <p className="text-muted-foreground text-sm">Agosto 2024</p>
          </div>
        </motion.div>
      </div>
    </section>);
};

export default TestimonialSection;