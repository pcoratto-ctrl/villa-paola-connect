import { ArrowRight, Droplets, Landmark, Wind, Wine } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { areaGuideContent, type AreaPlaceId } from "@/lib/areaGuideContent";

const placeIcons: Record<AreaPlaceId, typeof Droplets> = {
  "terme-caronte": Droplets,
  "fiumefreddo-bruzio": Landmark,
  "cantine-benvenuto": Wine,
  "kitesurf-gizzeria": Wind,
};

export default function ExploreAreaSection() {
  const { i18n } = useTranslation();
  const locale = i18n.resolvedLanguage?.startsWith("en") ? "en" : "it";
  const guide = areaGuideContent[locale];
  const isEn = locale === "en";

  return (
    <section id="dintorni" className="villa-section py-20 md:py-24 bg-background border-t border-border/70">
      <div className="villa-container">
        <div className="max-w-2xl mb-10">
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">
            {isEn ? "Around Gizzeria" : "Nei dintorni"}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            {isEn ? "Explore the area" : "Da scoprire nei dintorni"}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {isEn
              ? "Four authentic ideas within driving reach of Villa Paola — thermal baths, a hilltop coastal village, a local winery and Gizzeria’s kitesurfing shoreline."
              : "Quattro spunti reali raggiungibili in auto da Villa Paola, tra tradizione termale, borghi sul Tirreno, cantine e kitesurf sul litorale di Gizzeria."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {guide.places.map(place => {
            const Icon = placeIcons[place.id];
            return (
              <div key={place.id} className="rounded-villa border border-border bg-card p-5 shadow-soft flex flex-col justify-between gap-4">
                <div>
                  <Icon className="w-5 h-5 text-primary mb-3" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="font-display text-2xl text-foreground mb-1">{place.name}</h3>
                  <p className="text-sm text-muted-foreground">{place.category}</p>
                </div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {place.locality} · {place.roadDistance}
                </p>
              </div>
            );
          })}
        </div>

        <Link
          to={guide.path}
          className="inline-flex items-center gap-2 rounded-villa border border-primary bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold hover:opacity-95 transition-opacity"
        >
          {isEn ? "Read the local guide" : "Apri la guida ai dintorni"}
          <ArrowRight className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}