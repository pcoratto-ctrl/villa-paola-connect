import { useCallback, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ChevronLeft, ChevronRight, Grid2X2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { galleryPhotos, galleryCategories, previewPhotos, type GalleryCategory, type RoomCategory } from "@/lib/galleryCatalog";

const spans = ["md:col-span-8 md:row-span-2", "md:col-span-4", "md:col-span-4", "md:col-span-4", "md:col-span-4", "md:col-span-4", "md:col-span-4", "md:col-span-4", "md:col-span-4"];
const roomKeys: RoomCategory[] = ["bedrooms", "living", "kitchen", "baths"];

const GalleriaSection = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("en") ? "en" : "it";
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const [category, setCategory] = useState<GalleryCategory | "all">("all");
  const [room, setRoom] = useState<RoomCategory | "all">("all");
  const trigger = useRef<HTMLElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const photo = photoIndex === null ? undefined : galleryPhotos[photoIndex];
  const move = useCallback((offset: number) => setPhotoIndex(i => i === null ? i : (i + offset + galleryPhotos.length) % galleryPhotos.length), []);
  const openGallery = (el: HTMLElement, index: number | null = null) => {
    trigger.current = el; setCategory("all"); setRoom("all"); setPhotoIndex(index); setIsOpen(true);
  };
  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ room?: RoomCategory; trigger?: HTMLElement }>).detail;
      trigger.current = detail?.trigger ?? null;
      setCategory("interiors"); setRoom(detail?.room ?? "all"); setPhotoIndex(null); setIsOpen(true);
    };
    window.addEventListener("villa-gallery-open", onOpen);
    return () => window.removeEventListener("villa-gallery-open", onOpen);
  }, []);
  const groups = galleryCategories.filter(c => category === "all" || c === category);
  return (
    <section id="galleria" className="villa-section py-24 md:py-36">
      <div className="villa-container">
        <div className="grid md:grid-cols-12 gap-6 items-end mb-12 md:mb-16">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5">{t("gallery.eyebrow")}</p>
            <h2 className="font-display font-medium text-[2.4rem] sm:text-5xl lg:text-6xl leading-[1.04]">{t("gallery.titleStart")} <span className="italic font-normal text-primary">{t("gallery.titleEmph")}</span></h2>
          </div>
          <p className="md:col-span-5 text-muted-foreground text-lg">{t("gallery.subtitle")}</p>
        </div>
        <div data-gallery-preview className="grid grid-cols-2 md:grid-cols-12 md:auto-rows-[240px] lg:auto-rows-[280px] gap-2 md:gap-4">
          {previewPhotos.map((p, i) => (
            <Button key={p.id} variant="ghost" onClick={e => openGallery(e.currentTarget, galleryPhotos.findIndex(item => item.id === p.id))} className={`relative overflow-hidden rounded-villa bg-muted p-0 h-auto ${i === 0 ? "col-span-2 aspect-[4/3] md:aspect-auto" : "aspect-square md:aspect-auto"} ${spans[i]}`} aria-label={p[lang]}>
              <img src={p.thumb ?? p.src} alt={p[lang]} width={p.width} height={p.height} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
            </Button>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button variant="outline" size="lg" className="min-h-[50px] h-auto whitespace-normal" onClick={e => openGallery(e.currentTarget)}>{t("galleryMore.showAll")} <span className="text-muted-foreground">{t("galleryMore.count", { n: galleryPhotos.length })}</span></Button>
        </div>
      </div>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-foreground/95" />
          <Dialog.Content aria-describedby={undefined} onCloseAutoFocus={e => { e.preventDefault(); trigger.current?.focus(); }} onKeyDown={e => {
            if (!photo) return;
            if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
            if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
          }} className={`fixed inset-0 z-[71] outline-none ${photo ? "text-primary-foreground" : "bg-background text-foreground overflow-y-auto"}`}>
            <div className={`sticky top-0 z-10 flex items-center justify-between gap-3 px-5 md:px-10 py-4 ${photo ? "" : "bg-background border-b border-border"}`}>
              <Dialog.Title className="font-display text-2xl md:text-3xl">{t("gallery.eyebrow")} <span className="font-body text-sm ml-2">50</span></Dialog.Title>
              <div className="flex gap-2">
                {photo && <Button variant="ghost" size="icon" onClick={() => { setPhotoIndex(null); setCategory("all"); setRoom("all"); }} aria-label={t("galleryMore.showAll")} title={t("galleryMore.showAll")} className="hover:bg-background/10 hover:text-primary-foreground"><Grid2X2 /></Button>}
                <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label={t("gallery.close")} className={photo ? "hover:bg-background/10 hover:text-primary-foreground" : ""}><X /></Button></Dialog.Close>
              </div>
            </div>
            {photo ? (
              <div className="absolute inset-x-0 top-20 bottom-0 flex flex-col items-center justify-center gap-4 px-4 pb-6" onTouchStart={e => { const point = e.touches[0]; touch.current = point ? { x: point.clientX, y: point.clientY } : null; }} onTouchEnd={e => {
                const point = e.changedTouches[0];
                if (!touch.current || !point) return;
                const dx = point.clientX - touch.current.x;
                const dy = point.clientY - touch.current.y;
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? -1 : 1);
                touch.current = null;
              }}>
                <img src={photo.src} alt={photo[lang]} width={photo.width} height={photo.height} className="w-auto h-auto max-w-full max-h-[calc(100dvh-210px)] object-contain" />
                <div className="flex items-center justify-between gap-3 w-full max-w-3xl">
                  <Button variant="ghost" size="icon" className="shrink-0 hover:bg-background/10 hover:text-primary-foreground" onClick={() => move(-1)} aria-label={t("gallery.prev")}><ChevronLeft /></Button>
                  <p aria-live="polite" className="text-center text-sm"><span className="block font-display text-lg">{photo[lang]}</span>{(photoIndex ?? 0) + 1} / {galleryPhotos.length}</p>
                  <Button variant="ghost" size="icon" className="shrink-0 hover:bg-background/10 hover:text-primary-foreground" onClick={() => move(1)} aria-label={t("gallery.next")}><ChevronRight /></Button>
                </div>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto px-5 md:px-10 pb-16">
                <nav aria-label={t("gallery.eyebrow")} className="flex flex-wrap gap-x-4 gap-y-1 py-5 border-b border-border mb-8">
                  {(["all", ...galleryCategories] as const).map(c => <Button key={c} variant="ghost" aria-pressed={category === c} className={`h-auto min-h-11 px-1 py-2 whitespace-normal text-left border-b-2 rounded-none ${category === c ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`} onClick={() => { setCategory(c); setRoom("all"); }}>{t(c === "all" ? "gallery.all" : `gallery.categories.${c}`)}</Button>)}
                </nav>
                {category === "interiors" && <nav aria-label={t("rooms.eyebrow")} className="flex flex-wrap gap-2 mb-8">
                  {(["all", ...roomKeys] as const).map(r => <Button key={r} variant="ghost" aria-pressed={room === r} className={`min-h-11 whitespace-normal ${room === r ? "text-primary underline underline-offset-4" : "text-muted-foreground"}`} onClick={() => setRoom(r)}>{t(r === "all" ? "gallery.roomAll" : `rooms.items.${r}.title`)}</Button>)}
                </nav>}
                {groups.map(c => (
                  <section key={c} className="mb-12" aria-label={t(`gallery.categories.${c}`)}>
                    <h3 className="font-display text-3xl mb-6">{t(`gallery.categories.${c}`)}</h3>
                    <div data-gallery-grid className="grid grid-cols-2 lg:grid-cols-3 items-start gap-3 md:gap-5">
                      {galleryPhotos.filter(p => p.category === c && (c !== "interiors" || room === "all" || p.room === room)).map(p => (
                        <Button key={p.id} variant="ghost" onClick={() => setPhotoIndex(galleryPhotos.findIndex(item => item.id === p.id))} aria-label={p[lang]} className={`block w-full h-auto p-0 overflow-hidden rounded-villa ${p.width / p.height > 1.9 ? "col-span-2 lg:col-span-1" : ""}`}>
                          <img src={p.thumb ?? p.src} alt={p[lang]} width={p.width} height={p.height} loading="lazy" decoding="async" className="w-full h-auto" />
                        </Button>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
};
export default GalleriaSection;
