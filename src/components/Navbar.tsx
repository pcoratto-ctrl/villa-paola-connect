import { useState } from "react";
import { CalendarCheck, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoAsset from "@/assets/villa-paola-logo-menu.png.asset.json";

const navLinks = [
  { label: "La Villa", href: "/#villa" },
  { label: "Servizi", href: "/#servizi" },
  { label: "Galleria", href: "/#galleria" },
  { label: "Recensioni", href: "/#recensioni" },
  { label: "Posizione", href: "/#posizione" },
  { label: "Contatti", href: "/#contatti" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div className="villa-section">
          <div className="villa-container flex items-center justify-between h-16 md:h-20">
            <a href="/" aria-label="Villa Paola Caposuvero — home" className="flex items-center">
              <img
                src={logoAsset.url}
                alt="Villa Paola Caposuvero logo"
                className="h-[42px] md:h-[58px] w-auto object-contain"
              />
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground transition-colors duration-300 hover:opacity-70"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/#disponibilita"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-cta hover:shadow-elevated transition-all duration-200 active:scale-95"
              >
                <CalendarCheck className="w-4 h-4" strokeWidth={1.5} />
                Verifica disponibilità
              </a>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl pt-20"
          >
            <div className="villa-section flex flex-col gap-6 pt-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-3xl text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/#disponibilita"
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground text-base font-medium shadow-cta"
              >
                <CalendarCheck className="w-5 h-5" strokeWidth={1.5} />
                Verifica disponibilità
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
