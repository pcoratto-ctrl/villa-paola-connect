import { useState, useEffect } from "react";
import { Phone, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PHONE_NUMBER = "+393355384250";

const navLinks = [
  { label: "La Villa", href: "#villa" },
  { label: "Servizi", href: "#servizi" },
  { label: "Galleria", href: "#galleria" },
  { label: "Posizione", href: "#posizione" },
  { label: "Contatti", href: "#contatti" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl shadow-soft"
            : "bg-transparent"
        }`}
      >
        <div className="villa-section">
          <div className="villa-container flex items-center justify-between h-16 md:h-20">
            <a
              href="#"
              className={`font-display text-xl md:text-2xl tracking-tight transition-colors duration-300 ${
                scrolled ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              Villa Paola
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-300 hover:opacity-70 ${
                    scrolled
                      ? "text-foreground"
                      : "text-primary-foreground/90"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-cta hover:shadow-elevated transition-all duration-200 active:scale-95"
              >
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                Prenota ora
              </a>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 transition-colors ${
                scrolled ? "text-foreground" : "text-primary-foreground"
              }`}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" strokeWidth={1.5} />
              ) : (
                <Menu className="w-6 h-6" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
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
                href={`tel:${PHONE_NUMBER}`}
                className="mt-4 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground text-base font-medium shadow-cta"
              >
                <Phone className="w-5 h-5" strokeWidth={1.5} />
                Prenota ora
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
