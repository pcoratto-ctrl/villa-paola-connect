import { measurementAllowed, enquiryMeasurementProperties } from "../lib/enquiryConsent";
import { Button } from "./ui/button";

/** Shared by React pages and the build-time public article renderer. */
export default function EnglishHeroBookingLink() {
  return <div className="absolute bottom-4 right-4 z-10 flex max-w-[calc(100%-2rem)] flex-col items-end gap-2 md:bottom-6 md:right-8">
    <Button asChild size="lg" className="min-h-[52px] rounded-villa border border-primary-foreground bg-primary text-primary-foreground">
      <a href="#disponibilita" onClick={async () => { if (await measurementAllowed()) window.__lovableEvents?.track?.("project.availability_cta_clicked", enquiryMeasurementProperties("en")); }} aria-label="Request availability and a quote">Request availability</a>
    </Button>
    <span className="bg-background text-foreground px-2 py-1 text-xs leading-relaxed">Subject to availability and confirmation.</span>
  </div>;
}