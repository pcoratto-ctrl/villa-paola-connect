import type { PublicLocale } from "../lib/publicVillaContent";
import { publicVillaContent, AIRPORT_URL, DIRECTIONS_URL } from "../lib/publicVillaContent";
import { englishVillaTopics, englishTopicImages, type EnglishVillaTopic } from "../lib/englishVillaTopics";
import gardenPathAsset from "../assets/villa-garden-path-sea.webp.asset.json";

export function PublicLanguageLinks({ locale }: { locale?: PublicLocale }) {
  return <nav aria-label="Language / Lingua" className="flex flex-wrap items-center gap-5 text-sm">
    {Object.entries(publicVillaContent).map(([lang, content]) => <a key={lang} href={content.path} hrefLang={lang} lang={lang} aria-current={lang === locale ? "page" : undefined} className="underline underline-offset-4 hover:text-accent">{content.language}</a>)}
  </nav>;
}

export default function PublicVillaArticle({ locale, topic }: { locale: PublicLocale; topic?: EnglishVillaTopic }) {
  const c = topic ? englishVillaTopics[topic] : publicVillaContent[locale];
  const images = topic ? englishTopicImages[topic] : undefined;
  return <>
    <header className="villa-section py-5 border-b border-border bg-background">
      <div className="villa-container flex flex-wrap items-center justify-between gap-4">
        <a href="/" className="font-display text-2xl text-primary">Villa Paola Caposuvero</a>
        <PublicLanguageLinks locale={locale} />
      </div>
    </header>
    <main>
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <img src={"/images/villa-paola-restyle/" + (images?.hero ?? "hero-giardino-mare-desktop.webp")} alt={c.imageAlt} width={2560} height={1920} fetchPriority="high" className="absolute inset-0 w-full h-full object-cover" />
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
          {c.sections.map((section, index) => <section id={index === 3 ? "getting-here" : undefined} key={section.title} className="mb-12 md:mb-16">
            <h2 className="font-display text-3xl md:text-4xl mb-5 text-primary">{index === 3 ? c.arrival.title : section.title}</h2>
            <p className="text-lg leading-relaxed text-foreground">{index === 3 ? c.arrival.text : section.text}</p>
            {index === 0 && (topic === "beach" ? <figure className="mt-8 mx-auto w-full max-w-md">
              <img src={gardenPathAsset.url} alt="A paved path through Villa Paola's garden, with the sea alongside on the right" width={1152} height={2048} loading="lazy" className="block w-full h-auto rounded-villa" />
            </figure> : <img src={"/images/villa-paola-restyle/" + (images?.detail ?? "gallery-pergolato-teli-vista-mare.webp")} alt={images?.alt ?? (locale === "en" ? "Covered veranda at Villa Paola with a sea view" : "Veranda coperta di Villa Paola con vista sul mare")} width={1600} height={1200} loading="lazy" className="mt-8 w-full aspect-[4/3] md:aspect-[16/9] object-cover rounded-villa" />)}
            {index === 3 && <div className="mt-5">
              <p className="text-muted-foreground leading-relaxed mb-5">{c.arrival.flights}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-3"><a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-primary">{c.arrival.directions}</a><a href={AIRPORT_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-primary">{c.arrival.airport}</a></div>
            </div>}
          </section>)}
          <a href="#disponibilita" className="inline-flex rounded-villa bg-primary text-primary-foreground px-6 py-4 font-semibold">{c.cta}</a>
          {locale === "en" && <nav aria-label="Explore your stay" className="mt-12 border-t border-border pt-8 space-y-4">
            {topic && <p>For the rooms, garden and whole-villa overview, <a className="underline underline-offset-4 text-primary" href={publicVillaContent.en.path}>explore the beachfront villa</a>.</p>}
            {topic !== "beach" && <p>Planning days by the shore? <a className="underline underline-offset-4 text-primary" href={englishVillaTopics.beach.path}>Read about direct beach access</a>.</p>}
            {topic !== "seasons" && <p>Travelling outside high summer? <a className="underline underline-offset-4 text-primary" href={englishVillaTopics.seasons.path}>Plan a spring or autumn stay</a>.</p>}
          </nav>}
        </div>
      </div>
    </main>
  </>;
}