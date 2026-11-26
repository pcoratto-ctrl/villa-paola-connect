import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { needsAnswer, onConsentChange, readChoice, saveChoices } from "../lib/consent";

/** One public consent panel; the form checkbox edits the same analytics purpose. */
export default function ConsentChoices() {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const privateRoute = /^\/(admin|calendario|reset-password)(\/|$)/.test(pathname);
  const gpc = typeof navigator !== "undefined" && (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
  useEffect(() => {
    let mounted = true;
    void needsAnswer(["analytics"]).then(answer => { if (mounted) setOpen(answer); });
    const unsubscribe = onConsentChange(() => {
      if (readChoice("analytics") !== null) setOpen(false);
      setAnalytics(readChoice("analytics") === "granted");
    });
    return () => { mounted = false; unsubscribe(); };
  }, []);
  useEffect(() => { if (open && !privateRoute) panel.current?.focus(); }, [open, privateRoute]);
  if (privateRoute) return null;
  function save(allow: boolean) {
    saveChoices({ analytics: allow ? "granted" : "denied" });
    setOpen(false);
    setSettings(false);
  }
  return <>
    {!open && <div className="villa-section bg-background py-3"><div className="villa-container"><Button variant="link" size="sm" className="text-muted-foreground" onClick={() => { setAnalytics(readChoice("analytics") === "granted"); setSettings(true); setOpen(true); }}>{t("consent.settings")}</Button></div></div>}
    {open && <div ref={panel} tabIndex={-1} role="region" aria-label={t("consent.title")} className="fixed bottom-0 inset-x-0 z-[70] border-t border-border bg-background text-foreground shadow-card villa-section py-5">
      <div className="villa-container max-w-4xl">
        <p className="font-medium mb-2">{t("consent.title")}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t("consent.description")} <a className="underline underline-offset-4" href={i18n.language.startsWith("en") ? "/privacy-policy?lang=en" : "/privacy-policy"}>{t("footer.privacy")}</a></p>
        {settings && <div className="mb-4 space-y-3 text-sm">
          <p>{t("consent.necessary")}</p>
          {gpc && <p>{t("consent.gpc")}</p>}
          <label className="flex items-center gap-3"><input type="checkbox" checked={!gpc && analytics} disabled={gpc} onChange={e => setAnalytics(e.target.checked)} />{t("consent.analytics")}</label>
        </div>}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="flex-1 sm:flex-none sm:w-36 min-h-[44px] rounded-villa" onClick={() => save(true)}>{t("consent.accept")}</Button>
          <Button variant="outline" className="flex-1 sm:flex-none sm:w-36 min-h-[44px] rounded-villa" onClick={() => save(false)}>{t("consent.reject")}</Button>
          {settings ? <Button variant="outline" className="min-h-[44px] rounded-villa" onClick={() => save(analytics)}>{t("consent.save")}</Button> : <Button variant="outline" className="min-h-[44px] rounded-villa" onClick={() => { setAnalytics(readChoice("analytics") === "granted"); setSettings(true); }}>{t("consent.settings")}</Button>}
        </div>
      </div>
    </div>}
  </>;
}