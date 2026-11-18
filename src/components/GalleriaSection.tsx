import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import g10 from "@/assets/villa/gallery/10-soggiorno.webp.asset.json";
import g11 from "@/assets/villa/gallery/11-cucina.webp.asset.json";
import g12 from "@/assets/villa/gallery/12-camera-doppia.webp.asset.json";
import g13 from "@/assets/villa/gallery/13-camera-matrimoniale.webp.asset.json";
import g14 from "@/assets/villa/gallery/14-bagno.webp.asset.json";

const B = "/images/villa-paola-restyle/";
type Photo = { src: string; thumb?: string; it: string; en: string };

// Order and alt text follow MAPPATURA_ASSET.csv
const photos: Photo[] = [
  { src: B + "villa-esterno-panoramica.webp", it: "Panoramica del vialetto, giardino e Villa Paola", en: "Panoramic view of the path, garden and Villa Paola" },
  { src: B + "giardino-mare-luce.webp", it: "Giardino soleggiato affacciato sul mare", en: "Sunny garden overlooking the sea" },
  { src: B + "terrazza-pranzo-vista-mare.webp", it: "Tavola apparecchiata sulla terrazza fronte mare", en: "Table set on the seafront terrace" },
  { src: B + "terrazza-pergolato-panoramica.webp", it: "Pergolato della terrazza con divano e vista sul mare", en: "Terrace pergola with sofa and sea view" },
  { src: B + "villa-esterno-giardino.webp", it: "Facciata della villa con giardino e pergolato", en: "Villa façade with garden and pergola" },
  { src: B + "hero-giardino-mare-desktop.webp", thumb: B + "hero-giardino-mare-1280.webp", it: "Giardino di Villa Paola con sedute e mare sullo sfondo", en: "Villa Paola garden with seating and the sea beyond" },
  { src: B + "giardino-sedie-sdraio.webp", it: "Sdraio sul prato della villa accanto al mare", en: "Sun loungers on the villa lawn by the sea" },
  { src: B + "villa-vialetto-giardino.webp", it: "Vialetto in pietra tra il prato e la casa", en: "Stone path between the lawn and the house" },
  { src: B + "terrazza-divano-fronte-mare.webp", it: "Divano bianco all’ombra del pergolato di fronte al mare", en: "White sofa in the shade of the pergola facing the sea" },
  { src: B + "vista-mare-dalla-terrazza.webp", it: "Vista del giardino e del mare dalla terrazza", en: "View of the garden and sea from the terrace" },
  { src: B + "mare-muretto-bianco.webp", it: "Mare azzurro oltre il muretto bianco della villa", en: "Blue sea beyond the villa’s white wall" },
  { src: B + "spiaggia-sole-sul-mare.webp", it: "Spiaggia con il sole sul mare", en: "Beach with the sun over the sea" },
  { src: B + "colazione-terrazza.webp", it: "Colazione con cornetti e vista sul mare", en: "Breakfast with croissants and sea view" },
  { src: B + "aperitivo-giardino-mare.webp", it: "Aperitivo sul tavolo esterno con giardino e mare", en: "Aperitif on the outdoor table with garden and sea" },
  { src: B + "villa-facciata-sera.webp", it: "Facciata illuminata di Villa Paola all’imbrunire", en: "Villa Paola façade lit up at dusk" },
  { src: B + "giardino-tramonto-mare.webp", it: "Giardino della villa al tramonto sul mare", en: "The villa garden at sunset over the sea" },
  { src: B + "tramonto-vista-dalla-villa.webp", it: "Tramonto sul mare visto dalla villa", en: "Sunset over the sea seen from the villa" },
  { src: g10.url, it: "Soggiorno", en: "Living room" },
  { src: g13.url, it: "Camera matrimoniale", en: "Double bedroom" },
  { src: g12.url, it: "Camera doppia", en: "Twin bedroom" },
  { src: g11.url, it: "Cucina", en: "Kitchen" },
  { src: g14.url, it: "Bagno", en: "Bathroom" },
];

const PREVIEW = 9;
// editorial mosaic spans for the 9-photo preview (desktop)
const spans = [
  "md:col-span-8 md:row-span-2", "md:col-span-4", "md:col-span-4",
  "md:col-span-4", "md:col-span-4", "md:col-span-4",
  "md:col-span-4", "md:col-span-4", "md:col-span-4",
];

const GalleriaSection = () => {
  const { t, i18n } = useTranslation();
  const lang: "it" | "en" = i18n.language.startsWith("en") ? "en" : "it";
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    requestAnimationFrame(() => lastTrigger.current?.focus());
  }, []);
  const prev = useCallback(() => setOpen((p) => (p === null ? p : (p - 1 + photos.length) % photos.length)), []);
  const next = useCallback(() => setOpen((p) => (p === null ? p : (p + 1) % photos.length)), []);

  useEffect(() => {
    if (open === null) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const ov = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ov; };
  }, [open, close, prev, next]);

  const openAt = (i: number, el: HTMLElement) => { lastTrigger.current = el; setOpen(i); };
  const visible = showAll ? photos : photos.slice(0, PREVIEW);

  return (
    <section id="galleria" className="villa-section py-24 md:py-36">
      <div className="villa-container">
        <div className="grid md:grid-cols-12 gap-6 items-end mb-12 md:mb-16">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5">{t("gallery.eyebrow")}</p>
            <h2 className="font-display font-medium text-[2.4rem] sm:text-5xl lg:text-6xl leading-[1.04]">
              {t("gallery.titleStart")} <span className="italic font-normal text-primary">{t("gallery.titleEmph")}</span>
            </h2>
          </div>
          <p className="md:col-span-5 text-muted-foreground text-lg">{t("gallery.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-12 md:auto-rows-[240px] lg:auto-rows-[280px] gap-2 md:gap-4">
          {visible.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={(e) => openAt(i, e.currentTarget)}
              className={`group relative overflow-hidden rounded-villa bg-muted ${i === 0 ? "col-span-2 aspect-[4/3] md:aspect-auto" : "aspect-square md:aspect-auto"} ${i < PREVIEW ? spans[i] : "md:col-span-4"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
              aria-label={p[lang]}
            >
              <img src={p.thumb ?? p.src} alt={p[lang]} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
            </button>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center gap-3 px-7 py-3.5 min-h-[50px] rounded-villa border border-foreground/25 text-foreground font-medium hover:bg-foreground hover:text-background transition-colors"
          >
            {showAll ? t("galleryMore.showLess") : t("galleryMore.showAll")}
            <span className="text-muted-foreground text-sm">{t("galleryMore.count", { n: photos.length })}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={t("gallery.eyebrow")}
            className="fixed inset-0 z-[60] bg-foreground/95 flex items-center justify-center"
            onClick={close}
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
              touchX.current = null;
            }}
          >
            <button ref={closeBtn} onClick={close} className="absolute top-5 right-5 p-2 text-primary-foreground/80 hover:text-primary-foreground" aria-label={t("gallery.close")}>
              <X className="w-8 h-8" strokeWidth={1.5} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-2 md:left-8 p-2 text-primary-foreground/70 hover:text-primary-foreground" aria-label={t("gallery.prev")}>
              <ChevronLeft className="w-10 h-10" strokeWidth={1.25} />
            </button>
            <motion.img
              key={open}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={photos[open].src}
              alt={photos[open][lang]}
              className="max-w-[92vw] max-h-[82vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-2 md:right-8 p-2 text-primary-foreground/70 hover:text-primary-foreground" aria-label={t("gallery.next")}>
              <ChevronRight className="w-10 h-10" strokeWidth={1.25} />
            </button>
            <div className="absolute bottom-6 inset-x-0 text-center text-primary-foreground/75 text-sm px-6">
              <span className="font-display italic text-base">{photos[open][lang]}</span>
              <span className="ml-3">{open + 1} / {photos.length}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GalleriaSection;
