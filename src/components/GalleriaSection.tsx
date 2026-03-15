import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const photos = [
  { src: "/images/villa-1.jpg", alt: "Vista esterna della villa", category: "Esterni" },
  { src: "/images/villa-2.jpg", alt: "Vista panoramica", category: "Vista mare" },
  { src: "/images/villa-3.jpg", alt: "Soggiorno", category: "Interni" },
  { src: "/images/villa-4.jpg", alt: "Zona living", category: "Interni" },
  { src: "/images/villa-5.jpg", alt: "Camera da letto principale", category: "Camere" },
  { src: "/images/villa-6.jpg", alt: "Dettagli interni", category: "Interni" },
  { src: "/images/villa-7.jpg", alt: "Cucina attrezzata", category: "Cucina" },
  { src: "/images/villa-8.jpg", alt: "Camera da letto", category: "Camere" },
  { src: "/images/villa-9.jpg", alt: "Bagno", category: "Bagni" },
  { src: "/images/villa-11.jpg", alt: "Terrazza esterna", category: "Esterni" },
  { src: "/images/villa-12.jpg", alt: "Zona pranzo esterna", category: "Esterni" },
  { src: "/images/villa-13.jpg", alt: "Dettagli della villa", category: "Interni" },
  { src: "/images/villa-14.jpg", alt: "Spazi comuni", category: "Interni" },
  { src: "/images/villa-15.jpg", alt: "Camera", category: "Camere" },
  { src: "/images/villa-16.jpg", alt: "Vista mare dalla terrazza", category: "Vista mare" },
  { src: "/images/villa-20.jpg", alt: "Arredamento", category: "Interni" },
  { src: "/images/villa-21.jpg", alt: "Zona relax", category: "Interni" },
  { src: "/images/villa-22.jpg", alt: "Giardino", category: "Esterni" },
  { src: "/images/villa-23.jpg", alt: "Panorama", category: "Vista mare" },
  { src: "/images/villa-24.jpg", alt: "Dettagli bagno", category: "Bagni" },
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
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
            Galleria
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Scopri ogni <span className="italic">angolo</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            54 foto per farvi sentire già in vacanza.
          </p>
        </motion.div>

        {/* Bento Grid - first 5 photos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2"
        >
          <div
            className="col-span-2 row-span-2 cursor-pointer overflow-hidden rounded-villa"
            onClick={() => openLightbox(0)}
          >
            <img
              src={photos[0].src}
              alt={photos[0].alt}
              className="w-full h-full min-h-[300px] md:min-h-[500px] object-cover hover:scale-105 transition-transform duration-700"
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
                className="w-full h-[200px] md:h-[248px] object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>

        {/* Masonry Grid - remaining photos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
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
                className="w-full h-[180px] md:h-[220px] object-cover hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
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
