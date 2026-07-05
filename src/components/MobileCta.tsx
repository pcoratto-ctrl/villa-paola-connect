import { useState, useEffect } from "react";
import { CalendarCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/85 backdrop-blur-xl border-t border-border p-3"
        >
          <a
            href="/#disponibilita"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground text-base font-medium shadow-cta active:scale-95 transition-transform"
          >
            <CalendarCheck className="w-5 h-5" strokeWidth={1.5} />
            Verifica disponibilità
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileCta;
