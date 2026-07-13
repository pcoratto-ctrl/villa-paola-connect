import { useState, useEffect } from "react";
import { CalendarCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const MobileCta = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = [
      document.getElementById("disponibilita"),
      document.querySelector("footer"),
    ].filter(Boolean) as Element[];
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some((e) => e.isIntersecting);
        setHidden(anyVisible);
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.05 }
    );
    targets.forEach((tg) => io.observe(tg));
    return () => io.disconnect();
  }, []);

  const show = visible && !hidden;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/92 backdrop-blur-xl border-t border-border px-3 pt-3 safe-bottom"
        >
          <a
            href="#disponibilita"
            className="w-full inline-flex items-center justify-center gap-2 px-6 min-h-[52px] py-3.5 rounded-full bg-primary text-primary-foreground text-base font-medium shadow-cta active:scale-95 transition-transform"
          >
            <CalendarCheck className="w-5 h-5" strokeWidth={1.5} />
            {t("mobileCta.label")}
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileCta;
