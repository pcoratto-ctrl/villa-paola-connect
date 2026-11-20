import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PublicVillaArticle from "@/components/PublicVillaArticle";
import DisponibilitaSection from "@/components/DisponibilitaSection";
import { publicVillaContent, publicAlternates, SITE_ORIGIN, villaStructuredData, type PublicLocale } from "@/lib/publicVillaContent";

export default function InternationalVilla({ locale }: { locale: PublicLocale }) {
  const { i18n } = useTranslation();
  const c = publicVillaContent[locale];
  // URL, not a visitor's stored preference, owns the public language.
  useEffect(() => { if (i18n.language !== locale) void i18n.changeLanguage(locale); }, [i18n, locale]);
  return <>
    <Helmet>
      <html lang={locale} />
      <title>{c.title}</title><meta name="description" content={c.description} />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={SITE_ORIGIN + c.path} />
      {publicAlternates.map(a => <link key={a.lang} rel="alternate" hrefLang={a.lang} href={a.href} />)}
      <link rel="alternate" hrefLang="x-default" href={publicAlternates[0].href} />
      <meta property="og:title" content={c.title} /><meta property="og:description" content={c.description} /><meta property="og:url" content={SITE_ORIGIN + c.path} />
      <script type="application/ld+json">{JSON.stringify(villaStructuredData(locale))}</script>
    </Helmet>
    <PublicVillaArticle locale={locale} />
    <DisponibilitaSection />
    <footer className="villa-section py-8 border-t border-border"><div className="villa-container flex flex-wrap gap-6 text-sm">
      <a href="/">{c.home}</a><a href={`/privacy-policy${locale === "it" ? "" : "?lang=en"}`}>{c.privacy}</a><a href={`/cookie-policy${locale === "it" ? "" : "?lang=en"}`}>{c.cookies}</a><a href={`/termini-condizioni${locale === "it" ? "" : "?lang=en"}`}>{c.terms}</a>
      <span>CIN IT079060C299OUQTIW · CIR 079060-AAT-00018</span>
    </div></footer>
  </>;
}