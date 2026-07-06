import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import g01 from "@/assets/villa/gallery/01-casa-vista-mare.webp.asset.json";
import g02 from "@/assets/villa/gallery/02-esterno-villa-giardino-mare.webp.asset.json";
import g03 from "@/assets/villa/gallery/03-giardino-vista-mare.webp.asset.json";
import g04 from "@/assets/villa/gallery/04-pranzo-terrazza-vista-mare.webp.asset.json";
import g05 from "@/assets/villa/gallery/05-relax-giardino-mare.webp.asset.json";
import g06 from "@/assets/villa/gallery/06-percorso-esterno-casa.webp.asset.json";
import g07 from "@/assets/villa/gallery/07-casa-giardino-sedute.webp.asset.json";
import g08 from "@/assets/villa/gallery/08-casa-sera.webp.asset.json";
import g09 from "@/assets/villa/gallery/09-terrazza-vista-mare.webp.asset.json";
import g10 from "@/assets/villa/gallery/10-soggiorno.webp.asset.json";
import g11 from "@/assets/villa/gallery/11-cucina.webp.asset.json";
import g12 from "@/assets/villa/gallery/12-camera-doppia.webp.asset.json";
import g13 from "@/assets/villa/gallery/13-camera-matrimoniale.webp.asset.json";
import g14 from "@/assets/villa/gallery/14-bagno.webp.asset.json";
import g15 from "@/assets/villa/gallery/15-tramonto-mare.webp.asset.json";

const photos = [
  { src: g01.url, alt: "Villa Paola Caposuvero fronte mare a Gizzeria" },
  { src: g02.url, alt: "Esterno villa e giardino vista mare Villa Paola Caposuvero" },
  { src: g03.url, alt: "Giardino vista mare Villa Paola Caposuvero" },
  { src: g04.url, alt: "Pranzo in terrazza vista mare, casa vacanze sul mare in Calabria" },
  { src: g05.url, alt: "Relax in giardino fronte mare Villa Paola Caposuvero" },
  { src: g06.url, alt: "Percorso esterno tra casa e giardino Villa Paola Caposuvero" },
  { src: g07.url, alt: "Casa e giardino con sedute Villa Paola Caposuvero" },
  { src: g08.url, alt: "Villa Paola Caposuvero al tramonto" },
  { src: g09.url, alt: "Terrazza vista mare Villa Paola Caposuvero" },
  { src: g10.url, alt: "Interni Villa Paola Caposuvero — soggiorno" },
  { src: g11.url, alt: "Cucina Villa Paola Caposuvero" },
  { src: g12.url, alt: "Camera doppia Villa Paola Caposuvero" },
  { src: g13.url, alt: "Camera matrimoniale Villa Paola Caposuvero" },
  { src: g14.url, alt: "Bagno Villa Paola Caposuvero" },
  { src: g15.url, alt: "Tramonto sul mare a Villa Paola Caposuvero" },
];

const GalleriaSection = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = () =>
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
  const goNext = () =>
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));

  return (
    <section id="galleria" className="villa-section py-24 md:py-32">
      <div className="villa-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">Galleria</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-6">
            Scopri ogni <span className="italic">angolo</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Il mare, la terrazza, gli spazi interni: un percorso visivo della tua prossima vacanza.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-3"
        >
          <div
            className="col-span-2 row-span-2 cursor-pointer overflow-hidden rounded-villa"
            onClick={() => openLightbox(0)}
          >
            <img
              src={photos[0].src}
              alt={photos[0].alt}
              className="w-full h-full min-h-[300px] md:min-h-[520px] object-cover hover:scale-[1.03] transition-transform duration-700"
              loading="lazy"
            />
          </div>
          {photos.slice(1, 5).map((photo, i) => (
            <div
              key={i}
              className="cursor-pointer overflow-hidden rounded-lg"
              onClick={() => openLightbox(i + 1)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-[180px] md:h-[254px] object-cover hover:scale-[1.03] transition-transform duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3"
        >
          {photos.slice(5).map((photo, i) => (
            <div
              key={i}
              className="cursor-pointer overflow-hidden rounded-lg"
              onClick={() => openLightbox(i + 5)}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-[180px] md:h-[240px] object-cover hover:scale-[1.03] transition-transform duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/95 backdrop-blur-xl flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              aria-label="Chiudi"
            >
              <X className="w-8 h-8" strokeWidth={1.5} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 md:left-8 p-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              aria-label="Foto precedente"
            >
              <ChevronLeft className="w-10 h-10" strokeWidth={1.5} />
            </button>

            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              src={photos[lightboxIndex].src}
              alt={photos[lightboxIndex].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 md:right-8 p-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              aria-label="Foto successiva"
            >
              <ChevronRight className="w-10 h-10" strokeWidth={1.5} />
            </button>

            <div className="absolute bottom-6 text-primary-foreground/60 text-sm">
              {lightboxIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GalleriaSection;
