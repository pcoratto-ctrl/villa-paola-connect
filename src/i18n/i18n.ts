import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import it from "@/locales/it.json";
import en from "@/locales/en.json";
import de from "@/locales/de.json";
import fr from "@/locales/fr.json";

const STORAGE_KEY = "villa-language";

function getInitialLang(): "it" | "en" | "de" | "fr" {
  if (typeof window !== "undefined") {
    if (window.location.pathname.startsWith("/fr/")) return "fr";
    if (window.location.pathname.startsWith("/de/")) return "de";
    if (window.location.pathname.startsWith("/en/")) return "en";
    if (window.location.pathname === "/" || window.location.pathname === "/villa-sul-mare-calabria") return "it";
    if (new URLSearchParams(window.location.search).get("lang") === "en") return "en";
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "it" || stored === "en") return stored;
    } catch {
      // ignore
    }
  }
  return "it";
}

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        it: { translation: it },
        en: { translation: en },
        de: { translation: de },
        fr: { translation: fr },
      },
      lng: getInitialLang(),
      fallbackLng: "it",
      supportedLngs: ["it", "en", "de", "fr"],
      interpolation: { escapeValue: false },
      returnObjects: true,
    });
}

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language;
  i18n.on("languageChanged", (lng) => {
    document.documentElement.lang = lng;
    try {
      window.localStorage.setItem(STORAGE_KEY, lng);
    } catch {
      // ignore
    }
  });
}

export default i18n;
