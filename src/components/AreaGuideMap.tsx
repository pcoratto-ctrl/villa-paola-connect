import { ExternalLink } from "lucide-react";
import { areaGuideContent, type AreaPlaceId } from "../lib/areaGuideContent";
import type { PublicLocale } from "../lib/publicVillaContent";

// Schematic positions preserving relative N/S/E/W orientation from verified coordinates (not to scale).
const placeNodes: Record<AreaPlaceId, { x: number; y: number; lx: number; ly: number; anchor: "start" | "end"; short: string }> = {
  "fiumefreddo-bruzio": { x: 148, y: 54, lx: 162, ly: 58, anchor: "start", short: "Fiumefreddo Bruzio" },
  "terme-caronte": { x: 356, y: 158, lx: 344, ly: 146, anchor: "end", short: "Terme Caronte" },
  "kitesurf-gizzeria": { x: 256, y: 204, lx: 270, ly: 209, anchor: "start", short: "Hang Loose · Kite" },
  "cantine-benvenuto": { x: 332, y: 278, lx: 318, ly: 282, anchor: "end", short: "Cantine Benvenuto" },
};

const villaNode = { x: 206, y: 176 };

export default function AreaGuideMap({ locale }: { locale: PublicLocale }) {
  const c = areaGuideContent[locale];
  const descId = `area-guide-map-desc-${locale}`;
  return (
    <section aria-labelledby="area-map-heading" className="mb-14 md:mb-16 rounded-villa border border-border bg-card p-6 md:p-8 shadow-soft">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
        <h2 id="area-map-heading" className="font-display text-2xl md:text-3xl text-primary">{c.mapSection.title}</h2>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{c.mapSection.caption}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7">
          <svg
            viewBox="0 0 460 320"
            role="img"
            aria-describedby={descId}
            className="w-full h-auto rounded-villa border border-border/70 bg-background"
          >
            <desc id={descId}>{`${c.mapSection.caption}: ${c.mapSection.villaLabel}, ${c.places.map(p => `${p.name} (${p.roadDistance})`).join(", ")}.`}</desc>
            <rect width="460" height="320" fill="hsl(var(--secondary) / 0.35)" />
            <path
              d="M 118 0 C 138 65, 166 125, 206 176 C 242 214, 278 248, 286 320 L 460 320 L 460 0 Z"
              fill="hsl(var(--background))"
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
            />
            <text x="24" y="256" fill="hsl(var(--primary) / 0.65)" fontSize="12" fontStyle="italic" fontFamily="Georgia, serif">
              {c.mapSection.seaLabel}
            </text>
            <text x="434" y="28" textAnchor="end" fill="hsl(var(--muted-foreground))" fontSize="11" fontWeight="600">N ↑</text>
            {c.places.map(place => {
              const node = placeNodes[place.id];
              return (
                <g key={place.id}>
                  <line
                    x1={villaNode.x}
                    y1={villaNode.y}
                    x2={node.x}
                    y2={node.y}
                    stroke="hsl(var(--primary) / 0.35)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <circle cx={node.x} cy={node.y} r="5.5" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="2" />
                  <text x={node.lx} y={node.ly} textAnchor={node.anchor} fill="hsl(var(--foreground))" fontSize="12" fontWeight="500">
                    {node.short}
                  </text>
                </g>
              );
            })}
            <g>
              <circle cx={villaNode.x} cy={villaNode.y} r="7" fill="hsl(var(--primary))" />
              <circle cx={villaNode.x} cy={villaNode.y} r="12" fill="hsl(var(--primary) / 0.16)" />
              <text x={villaNode.x - 14} y={villaNode.y + 4} textAnchor="end" fill="hsl(var(--primary))" fontSize="12.5" fontWeight="700">
                {c.mapSection.villaLabel}
              </text>
            </g>
          </svg>
        </div>
        <div className="lg:col-span-5 space-y-3">
          {c.places.map(place => (
            <div key={place.id} className="flex items-baseline justify-between gap-3 border-b border-border/70 pb-3 last:border-b-0 last:pb-0">
              <div className="min-w-0">
                <a href={`#${place.id}`} className="font-medium text-foreground hover:text-primary transition-colors">{place.name}</a>
                <p className="text-xs text-muted-foreground">{place.locality} · {place.roadDistance}</p>
              </div>
              <a
                href={place.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary underline underline-offset-4 shrink-0 hover:text-accent"
              >
                {place.mapsLabel}
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          ))}
          <p className="pt-2 text-xs leading-relaxed text-muted-foreground">{c.mapSection.note}</p>
        </div>
      </div>
    </section>
  );
}