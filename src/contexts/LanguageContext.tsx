import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Language = "it" | "en";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "it",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem("villa-language");
      if (stored === "it" || stored === "en") return stored;
    } catch {
      // ignore
    }
    return "it";
  });

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem("villa-language", next);
    } catch {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
