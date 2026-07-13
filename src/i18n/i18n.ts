import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import it from "@/locales/it.json";
import en from "@/locales/en.json";

const STORAGE_KEY = "villa-language";

function getInitialLang(): "it" | "en" {
  if (typeof window !== "undefined") {
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
      },
      lng: getInitialLang(),
      fallbackLng: "it",
      supportedLngs: ["it", "en"],
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
