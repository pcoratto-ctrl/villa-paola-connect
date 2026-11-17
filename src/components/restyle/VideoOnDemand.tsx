import { useRef, useState } from "react";
import { Play } from "lucide-react";

interface Props { src: string; poster: string; label: string; alt: string; width: number; height: number; className?: string }

/** Loads the video only after the user taps play (preload none, no autoplay). */
const VideoOnDemand = ({ src, poster, label, alt, width, height, className = "" }: Props) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const start = () => {
    setStarted(true);
    requestAnimationFrame(() => ref.current?.play().catch(() => {}));
  };
  return (
    <div className={`relative overflow-hidden rounded-villa bg-foreground ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      {started ? (
        <video ref={ref} src={src} poster={poster} controls playsInline preload="none" className="absolute inset-0 w-full h-full object-contain" aria-label={alt} />
      ) : (
        <button type="button" onClick={start} className="group absolute inset-0 w-full h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label={label}>
          <img src={poster} alt={alt} loading="lazy" decoding="async" width={width} height={height} className="absolute inset-0 w-full h-full object-cover" />
          <span className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          <span className="absolute bottom-5 left-5 right-5 flex items-center gap-3 text-primary-foreground text-sm font-medium">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-foreground/90 text-primary group-hover:scale-105 transition-transform">
              <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
            </span>
            {label}
          </span>
        </button>
      )}
    </div>
  );
};
export default VideoOnDemand;
