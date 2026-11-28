import { measurementAllowed, enquiryMeasurementProperties } from "../lib/enquiryConsent";
import type { PublicLocale, PublicVillaPageContent } from "../lib/publicVillaContent";
import { publicVillaContent, AIRPORT_URL, DIRECTIONS_URL } from "../lib/publicVillaContent";
import { englishVillaTopics, englishTopicImages, type EnglishVillaTopic } from "../lib/englishVillaTopics";
import gardenPathAsset from "../assets/villa-garden-path-sea.webp.asset.json";
import novemberGardenAsset from "../assets/villa-paola-november-observed.webp.asset.json";
import EnglishHeroBookingLink from "./EnglishHeroBookingLink";
import seafrontVerandaAsset from "../assets/villa-paola-seafront-veranda.webp.asset.json";
import GettingHere from "./GettingHere";
import { gettingHereContent } from "../lib/gettingHereContent";

export function PublicLanguageLinks({ locale }: { locale?: PublicLocale }) {
  return <nav aria-label="Language / Lingua" className="flex flex-wrap items-center gap-5 text-sm">
    {Object.entries(publicVillaContent).map(([lang, content]) => <a key={lang} href={content.path} hrefLang={lang} lang={lang} aria-current={lang === locale ? "page" : undefined} className="underline underline-offset-4 hover:text-accent">{content.language}</a>)}
  </nav>;
}

export default function PublicVillaArticle({ locale, topic }: { locale: PublicLocale; topic?: EnglishVillaTopic }) {
  const c: PublicVillaPageContent = topic ? englishVillaTopics[topic] : publicVillaContent[locale];
  const images = topic ? englishTopicImages[topic] : undefined;
  return <>
    <header className="villa-section py-5 border-b border-border bg-background">
      <div className="villa-container flex flex-wrap items-center justify-between gap-4">
        <a href="/" className="font-display text-2xl text-primary">Villa Paola Caposuvero</a>
        <PublicLanguageLinks locale={locale} />
      </div>
    </header>
    <main>
      {topic === "seasons" ? <section className="bg-background text-foreground">
        <figure className="m-0">
          <div className="relative">
          <img src={novemberGardenAsset.url} alt="Villa Paola's seafront garden and sea, with a dated weather overlay showing 19 November 2026 and 24°C" width={1448} height={1086} fetchPriority="high" className="block w-full h-auto aspect-[1448/1086] object-contain" />
          {locale === "en" && <EnglishHeroBookingLink />}
          </div>
          <figcaption className="villa-container mt-3 text-sm leading-relaxed text-muted-foreground">Villa Paola’s seafront garden on 19 November 2026 · 24°C</figcaption>
        </figure>
        <div className="villa-section pt-10 pb-4 md:pt-14 md:pb-6">
          <div className="villa-container">
            <p className="uppercase text-sm mb-4 text-muted-foreground">{c.eyebrow}</p>
            <h1 className="font-display text-4xl md:text-6xl max-w-3xl leading-tight mb-6 text-primary">{c.h1}</h1>
            <p className="max-w-2xl text-lg leading-relaxed mb-8">{c.intro}</p>
            <a href="#disponibilita" onClick={async () => { if (await measurementAllowed()) window.__lovableEvents?.track?.("project.availability_cta_clicked", enquiryMeasurementProperties(locale)); }} className="inline-flex items-center justify-center rounded-villa px-6 py-4 min-h-[52px] bg-primary text-primary-foreground font-semibold">{c.cta}</a>
          </div>
        </div>
      </section> : <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <img src={"/images/villa-paola-restyle/" + (images?.hero ?? "hero-giardino-mare-desktop.webp")} alt={c.imageAlt} width={2560} height={1920} fetchPriority="high" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent" />
        <div className={`relative villa-section pt-36 md:pt-52 ${locale === "en" ? "pb-36 md:pb-40" : "pb-14 md:pb-20"}`}>
          <div className="villa-container">
            <p className="uppercase text-sm mb-4">{c.eyebrow}</p>
            <h1 className="font-display text-4xl md:text-6xl max-w-3xl leading-tight mb-6">{c.h1}</h1>
            <p className="max-w-2xl text-lg leading-relaxed mb-8">{c.intro}</p>
            <a href="#disponibilita" onClick={async () => { if (await measurementAllowed()) window.__lovableEvents?.track?.("project.availability_cta_clicked", enquiryMeasurementProperties(locale)); }} className="inline-flex items-center justify-center rounded-villa px-6 py-4 min-h-[52px] bg-primary-foreground text-primary font-semibold">{c.cta}</a>
          </div>
        </div>
        {locale === "en" && <EnglishHeroBookingLink />}
      </section>}
      <div className="villa-section py-14 md:py-20">
        <div className="villa-container max-w-4xl">
          {c.sections.map((section, index) => <section key={section.title} className="mb-12 md:mb-16">
            {index === 0 && locale === "en" && !topic && <figure className="m-0 mb-8">
              <img src={seafrontVerandaAsset.url} alt="A table set for a meal on Villa Paola's covered seafront veranda, overlooking the blue sea" width={1077} height={1077} loading="eager" className="block w-full h-auto rounded-villa" />
            </figure>}
            <h2 className="font-display text-3xl md:text-4xl mb-5 text-primary">{index === 3 ? gettingHereContent[locale].title : section.title}</h2>
            <p className="text-lg leading-relaxed text-foreground">{index === 3 ? c.arrival.text : section.text}</p>
            {index === 0 && !(locale === "en" && !topic) && (topic === "beach" ? <figure className="mt-8 mx-auto w-full max-w-md">
              <img src={gardenPathAsset.url} alt="A paved path through Villa Paola's garden, with the sea alongside on the right" width={1152} height={2048} loading="lazy" className="block w-full h-auto rounded-villa" />
            </figure> : <img src={"/images/villa-paola-restyle/" + (images?.detail ?? "gallery-pergolato-teli-vista-mare.webp")} alt={images?.alt ?? (locale === "en" ? "Covered veranda at Villa Paola with a sea view" : "Veranda coperta di Villa Paola con vista sul mare")} width={1600} height={1200} loading="lazy" className="mt-8 w-full aspect-[4/3] md:aspect-[16/9] object-cover rounded-villa" />)}
            {locale === "en" && index === 0 && !topic && <p className="mt-5 text-muted-foreground leading-relaxed">For the route, steps and mobility considerations, <a className="underline underline-offset-4 text-primary" href={englishVillaTopics.beach.path}>see the garden-to-beach access details</a>.</p>}
            {locale === "en" && index === 2 && !topic && <p className="mt-5 text-muted-foreground leading-relaxed">Explore <a className="underline underline-offset-4 text-primary" href={englishVillaTopics.seasons.path}>May and October holiday ideas</a> before choosing your dates.</p>}
            {index === 3 && <div className="mt-5">
              <GettingHere locale={locale} heading={false} />
              <p className="text-muted-foreground leading-relaxed mb-5">{c.arrival.flights}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-3"><a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-primary">{c.arrival.directions}</a><a href={AIRPORT_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 text-primary">{c.arrival.airport}</a></div>
            </div>}
          </section>)}
          {c.faqs && c.faqs.length > 0 && <section aria-labelledby="villa-faq-heading" className="mb-12 md:mb-16 border-t border-border pt-10">
            <h2 id="villa-faq-heading" className="font-display text-3xl md:text-4xl mb-8 text-primary">{c.faqTitle ?? "Frequently asked questions"}</h2>
            <dl className="space-y-6">
              {c.faqs.map(item => <div key={item.question} className="border-b border-border/70 pb-6 last:border-b-0 last:pb-0">
                <dt className="font-medium text-lg text-foreground mb-2">{item.question}</dt>
                <dd className="text-muted-foreground leading-relaxed m-0">{item.answer}</dd>
              </div>)}
            </dl>
          </section>}
          <a href="#disponibilita" onClick={async () => { if (await measurementAllowed()) window.__lovableEvents?.track?.("project.availability_cta_clicked", enquiryMeasurementProperties(locale)); }} className="inline-flex rounded-villa bg-primary text-primary-foreground px-6 py-4 font-semibold">{c.cta}</a>
          {locale === "en" && <nav aria-label="Explore your stay" className="mt-12 border-t border-border pt-8 space-y-4">
            {topic && <p>Considering a whole private villa rental in Calabria? For the rooms, garden and veranda, <a className="underline underline-offset-4 text-primary" href={publicVillaContent.en.path}>explore the beachfront villa</a>.</p>}
            {topic !== "beach" && <p>Planning days by the shore? <a className="underline underline-offset-4 text-primary" href={englishVillaTopics.beach.path}>Read about direct beach access</a>.</p>}
            {topic !== "seasons" && <p>Travelling outside high summer? <a className="underline underline-offset-4 text-primary" href={englishVillaTopics.seasons.path}>Plan a spring or autumn stay</a>.</p>}
          </nav>}
        </div>
      </div>
    </main>
  </>;
}