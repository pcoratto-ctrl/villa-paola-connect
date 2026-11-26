import { useSyncExternalStore } from "react";
import { publicVillaContent } from "./publicVillaContent";
import { englishVillaTopics } from "./englishVillaTopics";
import { canTrack, readChoice, saveChoices, onConsentChange } from "./consent";

const publicPaths = new Set(["/", ...Object.values(publicVillaContent).map(c => c.path), ...Object.values(englishVillaTopics).map(c => c.path), "/villa-accesso-diretto-spiaggia-calabria", "/casa-vacanze-gizzeria", "/villa-vicino-aeroporto-lamezia", "/villa-per-famiglie-calabria", "/villa-pet-friendly-calabria", "/vacanze-settembre-calabria"]);
const utmValues = {
  utm_source: ["facebook", "instagram", "google", "bing", "newsletter"],
  utm_medium: ["social", "organic", "referral", "email", "cpc", "paid_social"],
  utm_campaign: ["villa_paola", "villa-paola", "spring", "autumn", "summer"],
} as const;
const referrerHosts = new Set(["google.com", "google.it", "google.co.uk", "facebook.com", "l.facebook.com", "lm.facebook.com", "instagram.com", "l.instagram.com", "bing.com", "villapaolacaposuvero.it", "villa-paola-connect.lovable.app"]);
export interface EnquiryAttribution {
  landing_path: string;
  referrer_host: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}
/** Only public paths and explicitly approved campaign values; never retain raw URLs. */
export function sanitizeEnquiryAttribution(href: string, referrer: string): EnquiryAttribution {
  let url: URL;
  try { url = new URL(href); } catch { return { landing_path: "/", referrer_host: "" }; }
  let host = "";
  try { host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, ""); } catch { /* no referrer */ }
  const attribution: EnquiryAttribution = { landing_path: publicPaths.has(url.pathname) ? url.pathname : "/", referrer_host: referrerHosts.has(host) ? host : "" };
  for (const key of Object.keys(utmValues) as (keyof typeof utmValues)[]) {
    const value = url.searchParams.get(key)?.toLowerCase();
    if (value && (utmValues[key] as readonly string[]).includes(value)) attribution[key] = value;
  }
  return attribution;
}

let attribution: EnquiryAttribution | undefined;
export async function measurementAllowed() {
  if (typeof window === "undefined" || readChoice("analytics") !== "granted") return false;
  return canTrack("analytics");
}
export function setEnquiryMeasurementConsent(allowed: boolean) {
  saveChoices({ analytics: allowed ? "granted" : "denied" });
  if (readChoice("analytics") !== "granted") attribution = undefined;
}
export function enquiryMeasurementProperties(language: string) {
  if (typeof window === "undefined" || readChoice("analytics") !== "granted") {
    attribution = undefined;
    return { page_language: language.startsWith("en") ? "en" : "it" };
  }
  if (!attribution) {
    // The document navigation entry retains the landing URL across client-side routing.
    const navigation = typeof performance.getEntriesByType === "function" ? performance.getEntriesByType("navigation")[0] : undefined;
    attribution = sanitizeEnquiryAttribution(navigation?.name || window.location.href, document.referrer);
  }
  return { ...attribution, page_language: language.startsWith("en") ? "en" : "it" };
}
export function useEnquiryMeasurementConsent() {
  return useSyncExternalStore(listener => onConsentChange(() => {
    if (readChoice("analytics") !== "granted") attribution = undefined;
    listener();
  }), () => readChoice("analytics") === "granted", () => false);
}