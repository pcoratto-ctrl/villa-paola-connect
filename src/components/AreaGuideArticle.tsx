import { Droplets, ExternalLink, Landmark, MapPin, Wind, Wine } from "lucide-react";
import { areaGuideContent, type AreaPlaceId } from "../lib/areaGuideContent";
import { measurementAllowed, enquiryMeasurementProperties } from "../lib/enquiryConsent";
import type { PublicLocale } from "../lib/publicVillaContent";
import AreaGuideMap from "./AreaGuideMap";

const placeIcons: Record<AreaPlaceId, typeof Droplets> = {
  "terme-caronte": Droplets,
  "fiumefreddo-bruzio": Landmark,
  "cantine-benvenuto": Wine,
  "kitesurf-gizzeria": Wind,
};

export default function AreaGuideArticle({ locale }: { locale: PublicLocale }) {
  const c = areaGuideContent[locale];
  return (
    <>
      <header className="villa-section py-5 border-b border-border bg-background">
        <div className="villa-container flex flex-wrap items-center justify-between gap-4">
          <a href={c.homeHref} className="font-display text-2xl text-primary">Villa Paola Caposuvero</a>
          <nav aria-label="Language / Lingua" className="flex flex-wrap items-center gap-5 text-sm">
            {(["it", "en"] as const).map(lang => (
              <a
                key={lang}
                href={areaGuideContent[lang].path}
                hrefLang={lang}
                lang={lang}
                aria-current={lang === locale ? "page" : undefined}
                className="underline underline-offset-4 hover:text-accent"
              >
                {areaGuideContent[lang].language}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="bg-background text-foreground">
        <section className="villa-section pt-12 pb-10 md:pt-16 md:pb-12 border-b border-border/70 bg-villa-warm-white">
          <div className="villa-container max-w-4xl">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-2">
                <li><a href={c.homeHref} className="hover:text-primary underline-offset-4 hover:underline">{c.breadcrumbHome}</a></li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-foreground">{c.breadcrumbCurrent}</li>
              </ol>
            </nav>
            <p className="uppercase tracking-widest text-xs font-medium text-primary mb-4">{c.eyebrow}</p>
            <h1 className="font-display text-4xl md:text-6xl leading-tight text-primary mb-6">{c.h1}</h1>
            <p className="text-lg leading-relaxed text-muted-foreground max-w-3xl">{c.intro}</p>
          </div>
        </section>

        <div className="villa-section py-12 md:py-16">
          <div className="villa-container max-w-4xl">
            <AreaGuideMap locale={locale} />

            <div className="space-y-10 md:space-y-12">
              {c.places.map(place => {
                const Icon = placeIcons[place.id];
                return (
                  <article
                    key={place.id}
                    id={place.id}
                    className="scroll-mt-24 rounded-villa border border-border bg-card p-6 md:p-8 shadow-soft"
                  >
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-10 h-10 rounded-villa bg-secondary flex items-center justify-center shrink-0 text-primary">
                        <Icon className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          {place.category} · {place.locality} · {place.roadDistance}
                        </p>
                        <h2 className="font-display text-3xl md:text-4xl text-primary leading-tight">{place.name}</h2>
                      </div>
                    </div>

                    <div className="space-y-4 text-base md:text-lg leading-relaxed text-foreground">
                      {place.paragraphs.map(text => <p key={text}>{text}</p>)}
                    </div>

                    {place.ownerNote && (
                      <blockquote className="mt-6 rounded-villa border-l-2 border-primary bg-secondary/40 px-5 py-4">
                        <p className="text-xs uppercase tracking-wider font-medium text-primary mb-2">{place.ownerNote.label}</p>
                        <p className="text-base italic leading-relaxed text-foreground">{place.ownerNote.quote}</p>
                      </blockquote>
                    )}

                    <div className="mt-6 pt-5 border-t border-border/70 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium">
                      <a
                        href={place.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary underline underline-offset-4 hover:text-accent"
                      >
                        {place.officialLabel}
                        <ExternalLink className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                      </a>
                      <a
                        href={place.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary underline underline-offset-4 hover:text-accent"
                      >
                        <MapPin className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                        {place.mapsLabel}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            <section aria-labelledby="area-villa-links" className="mt-14 md:mt-16 pt-10 border-t border-border">
              <h2 id="area-villa-links" className="font-display text-3xl text-primary mb-3">{c.villaLinksTitle}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{c.villaLinksIntro}</p>
              <nav aria-label={c.villaLinksTitle} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {c.villaLinks.map(link => (
                  <a
                    key={link.to}
                    href={link.to}
                    className="rounded-villa border border-border bg-card px-4 py-3 text-sm font-medium text-primary hover:border-primary transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </section>

            <section className="mt-12 rounded-villa border border-border bg-villa-warm-white p-6 md:p-8">
              <h2 className="font-display text-3xl text-primary mb-3">{c.ctaTitle}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{c.ctaText}</p>
              <a
                href="#disponibilita"
                onClick={async () => {
                  if (await measurementAllowed()) {
                    window.__lovableEvents?.track?.("project.availability_cta_clicked", enquiryMeasurementProperties(locale));
                  }
                }}
                className="inline-flex items-center justify-center rounded-villa bg-primary text-primary-foreground px-6 py-4 min-h-[52px] font-semibold"
              >
                {c.ctaButton}
              </a>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}