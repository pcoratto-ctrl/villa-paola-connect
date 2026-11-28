import { useEffect, useId, useRef, useState } from "react";
import { Home, Navigation, Pause, Plane, Play, RotateCcw, TrainFront } from "lucide-react";
import { Button } from "./ui/button";
import { DIRECTIONS_URL, type PublicLocale } from "../lib/publicVillaContent";
import { ARRIVAL_ANIMATION_MS, arrivalRoutes, gettingHereContent, type ArrivalOrigin } from "../lib/gettingHereContent";

function ArrivalMap({ locale, origin }: { locale: PublicLocale; origin: ArrivalOrigin }) {
  const c = gettingHereContent[locale];
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [reduced, setReduced] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);
  const elapsed = useRef(0);
  const descriptionId = useId();
  const route = arrivalRoutes[origin];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReduced(media.matches); if (media.matches) setPlaying(false); };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!playing || reduced) return;
    const path = pathRef.current;
    const car = carRef.current;
    if (!path || !car) return;
    const length = path.getTotalLength();
    let previous: number | undefined;
    let frame = 0;
    const tick = (now: number) => {
      if (previous !== undefined) elapsed.current += now - previous;
      previous = now;
      const distance = Math.min(elapsed.current / ARRIVAL_ANIMATION_MS, 1) * length;
      const point = path.getPointAtLength(distance);
      const behind = path.getPointAtLength(Math.max(0, distance - 2));
      const ahead = path.getPointAtLength(Math.min(length, distance + 2));
      const angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180 / Math.PI;
      car.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
      if (elapsed.current >= ARRIVAL_ANIMATION_MS) { setFinished(true); setPlaying(false); }
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reduced, origin]);

  function play() {
    if (reduced) return;
    if (finished) { elapsed.current = 0; setFinished(false); }
    setPlaying(true);
  }

  const Icon = origin === "airport" ? Plane : TrainFront;
  return <article aria-label={c.origins[origin]} className="min-w-0 rounded-villa border border-border bg-card p-4 md:p-6">
    <div className="flex items-start gap-3 min-h-16">
      <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-primary mt-1" />
      <div className="min-w-0"><p className="text-xs uppercase text-muted-foreground mb-1">{c.from}</p><h4 className="font-medium leading-snug">{c.origins[origin]}</h4></div>
    </div>
    <div className="border-y border-border py-4 mt-3">
      <p className="text-xs uppercase text-muted-foreground mb-1">{c.to}</p>
      <p className="font-display text-2xl text-primary tracking-normal">Villa Paola Caposuvero</p>
      <p className="mt-2 text-primary text-lg font-medium">{c.time}</p>
    </div>
    <figure className="m-0 mt-5">
      <svg viewBox="0 0 600 450" role="img" aria-label={c.illustrative} aria-describedby={descriptionId} className="block w-full aspect-[4/3] rounded-villa bg-villa-sea-light overflow-hidden">
        <desc id={descriptionId}>{c.description}</desc>
        <path d="M190 0 C182 70 214 116 230 190 S285 275 292 340 S305 410 300 450 H600 V0Z" className="fill-background" />
        <path d="M190 0 C182 70 214 116 230 190 S285 275 292 340 S305 410 300 450" fill="none" className="stroke-secondary" strokeWidth="3" />
        <text x="34" y="270" className="fill-primary font-display" fontSize="26">{c.sea}</text>
        <g transform="translate(550 32)" className="text-muted-foreground"><path d="M0 34 V0 M-6 10 L0 0 L6 10" fill="none" stroke="currentColor" strokeWidth="2" /><text x="0" y="57" textAnchor="middle" fill="currentColor" fontSize="18">N</text></g>
        <path ref={pathRef} d={route.path} fill="none" className="stroke-accent" strokeWidth="4" strokeDasharray="7 9" strokeLinecap="round" />
        <g transform="translate(210 70)" className="text-primary"><circle r="23" className="fill-primary" /><Home x="-13" y="-13" width="26" height="26" className="text-primary-foreground" strokeWidth="1.7" /></g>
        <text x="245" y="63" className="fill-primary font-display" fontSize="27">Villa Paola</text>
        <text x="245" y="88" className="fill-muted-foreground" fontSize="18">Caposuvero</text>
        <g transform={`translate(${route.x} ${route.y})`} className="text-primary">
          <circle r="23" className="fill-card" stroke="currentColor" strokeWidth="2" /><Icon x="-13" y="-13" width="26" height="26" strokeWidth="1.7" />
          <text x="0" y="43" textAnchor="middle" fill="currentColor" fontSize="18">{origin === "airport" ? "SUF" : "Lamezia Centrale"}</text>
        </g>
        <g ref={carRef} data-testid="arrival-car" aria-hidden="true" transform={`translate(${route.x} ${route.y}) rotate(-135)`}>
          <path d="M-12-12V-17H-3V-12 M7-12V-17H16V-12 M-12 12V17H-3V12 M7 12V17H16V12" className="fill-foreground stroke-foreground" strokeWidth="3" />
          <rect x="-24" y="-12" width="48" height="24" rx="6" className="fill-accent stroke-accent-foreground" strokeWidth="2" />
          <path d="M-8-9H6L12-6V6L6 9H-8Z" className="fill-primary" />
          <path d="M17-8V-3 M17 3V8" className="stroke-primary-foreground" strokeWidth="3" />
        </g>
      </svg>
      <figcaption className="mt-3 text-sm text-muted-foreground">{c.illustrative}</figcaption>
    </figure>
    <div className="flex items-center gap-3 mt-4 min-h-12">
      <Button variant="outline" size="icon" disabled={reduced} aria-label={playing ? c.pause : finished ? c.replay : c.play} title={playing ? c.pause : finished ? c.replay : c.play} onClick={() => playing ? setPlaying(false) : play()} className="h-12 w-12 rounded-villa">
        {playing ? <Pause /> : finished ? <RotateCcw /> : <Play />}
      </Button>
      {reduced && <span className="text-sm text-muted-foreground">{c.reduced}</span>}
      <Button asChild variant="link" className="h-auto min-h-12 px-0 whitespace-normal text-left"><a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer"><Navigation aria-hidden="true" />{c.directions}</a></Button>
    </div>
    <p className="mt-3 text-sm text-muted-foreground">{c.note}</p>
  </article>;
}

export default function GettingHere({ locale, heading = true }: { locale: PublicLocale; heading?: boolean }) {
  const c = gettingHereContent[locale];
  return <div id="getting-here" className="w-full min-w-0">
    {heading && <h3 className="font-display text-3xl md:text-4xl text-primary mb-6 tracking-normal">{c.title}</h3>}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      <ArrivalMap locale={locale} origin="airport" />
      <ArrivalMap locale={locale} origin="station" />
    </div>
  </div>;
}
