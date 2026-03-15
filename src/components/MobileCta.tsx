import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PHONE_NUMBER = "+393355384250";

const MobileCta = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/80 backdrop-blur-xl border-t border-border p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg text-foreground">Villa Paola</p>
              <p className="text-muted-foreground text-xs">Gizzeria, Calabria</p>
            </div>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-cta active:scale-95 transition-transform"
            >
              <Phone className="w-4 h-4" strokeWidth={1.5} />
              Chiama ora
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileCta;
