import type { PublicLocale } from "../lib/publicVillaContent";
import { publicVillaContent } from "../lib/publicVillaContent";

export function PublicLanguageLinks({ locale }: { locale?: PublicLocale }) {
  return <nav aria-label="Language / Sprache / Lingua" className="flex flex-wrap items-center gap-5 text-sm">
    {Object.entries(publicVillaContent).map(([lang, content]) => <a key={lang} href={content.path} hrefLang={lang} lang={lang} aria-current={lang === locale ? "page" : undefined} className="underline underline-offset-4 hover:text-accent">{content.language}</a>)}
  </nav>;
}

export default function PublicVillaArticle({ locale }: { locale: PublicLocale }) {
  const c = publicVillaContent[locale];
  return <>
    <header className="villa-section py-5 border-b border-border bg-background">
      <div className="villa-container flex flex-wrap items-center justify-between gap-4">
        <a href="/" className="font-display text-2xl text-primary">Villa Paola Caposuvero</a>
        <PublicLanguageLinks locale={locale} />
      </div>
    </header>
    <main>
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <img src="/images/villa-paola-restyle/hero-giardino-mare-desktop.webp" alt={c.imageAlt} width={2560} height={1920} fetchPriority="high" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent" />
        <div className="relative villa-section pt-36 pb-14 md:pt-52 md:pb-20">
          <div className="villa-container">
            <p className="uppercase text-sm mb-4">{c.eyebrow}</p>
            <h1 className="font-display text-4xl md:text-6xl max-w-3xl leading-tight mb-6">{c.h1}</h1>
            <p className="max-w-2xl text-lg leading-relaxed mb-8">{c.intro}</p>
            <a href="#disponibilita" className="inline-flex items-center justify-center rounded-villa px-6 py-4 min-h-[52px] bg-primary-foreground text-primary font-semibold">{c.cta}</a>
          </div>
        </div>
      </section>
      <div className="villa-section py-14 md:py-20">
        <div className="villa-container max-w-4xl">
          {c.sections.map((section, index) => <section key={section.title} className="mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl mb-5 text-primary">{section.title}</h2>
            <p className="text-lg leading-relaxed text-foreground">{section.text}</p>
            {index === 0 && <img src="/images/villa-paola-restyle/gallery-pergolato-teli-vista-mare.webp" alt={locale === "de" ? "Überdachte Veranda der Villa Paola mit Meerblick" : locale === "en" ? "Covered veranda at Villa Paola with a sea view" : "Veranda coperta di Villa Paola con vista sul mare"} width={1600} height={1200} loading="lazy" className="mt-8 w-full aspect-[4/3] md:aspect-[16/9] object-cover rounded-villa" />}
          </section>)}
          <a href="#disponibilita" className="inline-flex rounded-villa bg-primary text-primary-foreground px-6 py-4 font-semibold">{c.cta}</a>
        </div>
      </div>
    </main>
  </>;
}