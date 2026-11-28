import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { areaGuideAlternates, areaGuideContent, areaGuideStructuredData } from "../lib/areaGuideContent";
import { renderStaticPage, staticPaths } from "../lib/staticPublicDocument";
import { SITE_ORIGIN } from "../lib/publicVillaContent";

const stripHtml = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

describe("Area guide IT/EN pages", () => {
  it("registers both canonical routes in staticPaths and sitemap.xml", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    for (const path of ["/esperienze-dintorni", "/en/things-to-do-near-gizzeria"]) {
      expect(staticPaths).toContain(path);
      expect(sitemap).toContain(`<loc>${SITE_ORIGIN}${path}</loc>`);
    }
  });

  it("emits exact titles, self canonicals, reciprocal hreflang and truthful WebPage + BreadcrumbList JSON-LD", () => {
    const expectedTitles = {
      it: "Cosa vedere vicino a Gizzeria | Villa Paola",
      en: "Things to Do near Gizzeria, Calabria | Villa Paola",
    } as const;

    for (const locale of ["it", "en"] as const) {
      const c = areaGuideContent[locale];
      const page = renderStaticPage(c.path);
      const head = new DOMParser().parseFromString(page.head, "text/html");
      const body = new DOMParser().parseFromString(page.body, "text/html");

      expect(page.lang).toBe(locale);
      expect(head.title).toBe(expectedTitles[locale]);
      expect(head.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("index,follow");
      expect(head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
      expect(head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(SITE_ORIGIN + c.path);
      for (const alt of areaGuideAlternates) {
        expect(head.querySelector(`link[hreflang="${alt.lang}"]`)?.getAttribute("href")).toBe(alt.href);
      }
      expect(head.querySelector('link[hreflang="x-default"]')?.getAttribute("href")).toBe(areaGuideAlternates[0].href);
      expect(body.querySelectorAll("h1")).toHaveLength(1);

      const jsonLd = JSON.parse(head.querySelector('script[type="application/ld+json"]')?.textContent ?? "{}");
      const types = (jsonLd["@graph"] ?? []).map((n: { "@type": string }) => n["@type"]);
      expect(types).toEqual(["WebPage", "BreadcrumbList"]);
      expect(page.head).not.toContain("FAQPage");
      expect(page.head).not.toContain("AggregateRating");
      expect(page.head).not.toContain('"Review"');
      expect(areaGuideStructuredData(locale)["@graph"]).toHaveLength(2);
    }
  });

  it("includes only the 4 approved destinations, owner note only on Fiumefreddo, verified links and 450-750 words", () => {
    for (const locale of ["it", "en"] as const) {
      const c = areaGuideContent[locale];
      expect(c.places.map(p => p.id)).toEqual([
        "terme-caronte",
        "fiumefreddo-bruzio",
        "cantine-benvenuto",
        "kitesurf-gizzeria",
      ]);
      expect(c.places.filter(p => p.ownerNote).map(p => p.id)).toEqual(["fiumefreddo-bruzio"]);

      const page = renderStaticPage(c.path);
      expect(page.body.toLowerCase()).not.toContain("le moire");
      expect(page.body).toContain("https://www.termecaronte.it/piscina");
      expect(page.body).toContain("https://calabriastraordinaria.it/idee-di-viaggio/nel-borgo-di-fiumefreddo-bruzio-tra-i-borghi-piu-belli-ditalia");
      expect(page.body).toContain("https://cantinebenvenuto.it/");
      expect(page.body).toContain("https://hangloosebeach.it/kitesurf/");
      expect(page.body).toContain("https://www.google.com/maps/dir/");
      expect(page.body).toContain('href="#disponibilita"');

      const words = wordCount(stripHtml(page.body));
      expect(words).toBeGreaterThanOrEqual(450);
      expect(words).toBeLessThanOrEqual(750);
    }
  });

  it("links contextually from the 3 English landing pages and static homepage", () => {
    for (const path of [
      "/en/beachfront-villa-calabria",
      "/en/villa-direct-beach-access-calabria",
      "/en/calabria-spring-autumn-holidays",
    ]) {
      expect(renderStaticPage(path).body).toContain('href="/en/things-to-do-near-gizzeria"');
    }
    const home = renderStaticPage("/");
    expect(home.body).toContain('href="/esperienze-dintorni"');
    expect(home.body).toContain('href="/en/things-to-do-near-gizzeria"');
  });
});