import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AreaGuideArticle from "@/components/AreaGuideArticle";
import DisponibilitaSection from "@/components/DisponibilitaSection";
import { areaGuideAlternates, areaGuideContent, areaGuideStructuredData } from "@/lib/areaGuideContent";
import { SITE_ORIGIN, type PublicLocale } from "@/lib/publicVillaContent";

export default function AreaGuide({ locale }: { locale: PublicLocale }) {
  const { i18n } = useTranslation();
  const c = areaGuideContent[locale];
  useEffect(() => {
    if (i18n.language !== locale) void i18n.changeLanguage(locale);
  }, [i18n, locale]);

  const canonical = SITE_ORIGIN + c.path;
  return (
    <>
      <Helmet>
        <html lang={locale} />
        <title>{c.title}</title>
        <meta name="description" content={c.description} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={canonical} />
        {areaGuideAlternates.map(a => (
          <link key={a.lang} rel="alternate" hrefLang={a.lang} href={a.href} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={areaGuideAlternates[0].href} />
        <meta property="og:title" content={c.title} />
        <meta property="og:description" content={c.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={c.title} />
        <meta name="twitter:description" content={c.description} />
        <script type="application/ld+json">{JSON.stringify(areaGuideStructuredData(locale))}</script>
      </Helmet>
      <AreaGuideArticle locale={locale} />
      <DisponibilitaSection />
      <footer className="villa-section py-8 border-t border-border">
        <div className="villa-container flex flex-wrap gap-6 text-sm">
          <a href={c.homeHref}>{c.homeLabel}</a>
          <a href={`/privacy-policy${locale === "it" ? "" : "?lang=en"}`}>{c.privacy}</a>
          <a href={`/cookie-policy${locale === "it" ? "" : "?lang=en"}`}>{c.cookies}</a>
          <a href={`/termini-condizioni${locale === "it" ? "" : "?lang=en"}`}>{c.terms}</a>
          <span>CIN IT079060C299OUQTIW · CIR 079060-AAT-00018</span>
        </div>
      </footer>
    </>
  );
}