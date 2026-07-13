import { useTranslation } from "react-i18next";

interface Props {
  className?: string;
  variant?: "default" | "onDark";
}

const LanguageSwitcher = ({ className = "", variant = "default" }: Props) => {
  const { i18n, t } = useTranslation();
  const current = i18n.language.startsWith("en") ? "en" : "it";

  const change = (lng: "it" | "en") => {
    if (lng !== current) i18n.changeLanguage(lng);
  };

  const base = variant === "onDark"
    ? "border-white/30 text-white/70 hover:text-white"
    : "border-border text-muted-foreground hover:text-foreground";
  const active = variant === "onDark"
    ? "bg-white text-foreground"
    : "bg-primary text-primary-foreground";

  const btn = "px-2.5 py-1 text-xs font-semibold tracking-wider uppercase transition-colors";

  return (
    <div
      role="group"
      aria-label={t("nav.languageLabel")}
      className={`inline-flex items-center rounded-full border overflow-hidden ${base} ${className}`}
    >
      <button
        type="button"
        aria-pressed={current === "it"}
        onClick={() => change("it")}
        className={`${btn} ${current === "it" ? active : ""}`}
      >
        IT
      </button>
      <span aria-hidden className="opacity-40">|</span>
      <button
        type="button"
        aria-pressed={current === "en"}
        onClick={() => change("en")}
        className={`${btn} ${current === "en" ? active : ""}`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
