import { useState } from "react";
import { CalendarCheck, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logoAsset from "@/assets/villa-paola-logo-menu.png.asset.json";

const Navbar = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("nav.reviews"), href: "/#recensioni" },
    { label: t("nav.villa"), href: "/#villa" },
    { label: t("nav.services"), href: "/#servizi" },
    { label: t("nav.gallery"), href: "/#galleria" },
    { label: t("nav.location"), href: "/#posizione" },
    { label: t("nav.contact"), href: "/#contatti" },
  ];

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

            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-foreground transition-colors duration-300 hover:opacity-70"
                >
                  {link.label}
                </a>
              ))}
              <LanguageSwitcher />
              <a
                href="/#disponibilita"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-cta hover:shadow-elevated transition-all duration-200 active:scale-95"
              >
                <CalendarCheck className="w-4 h-4" strokeWidth={1.5} />
                {t("nav.checkAvailability")}
              </a>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-foreground"
                aria-label={t("nav.menu")}
              >
                {mobileOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
              </button>
            </div>
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
              <div className="pt-2">
                <LanguageSwitcher />
              </div>
              <a
                href="/#disponibilita"
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground text-base font-medium shadow-cta"
              >
                <CalendarCheck className="w-5 h-5" strokeWidth={1.5} />
                {t("nav.checkAvailability")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
