import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { renderStaticPage, staticPaths } from "../lib/staticPublicDocument";
import { publicVillaContent, publicAlternates, SITE_ORIGIN, villaStructuredData } from "../lib/publicVillaContent";
import { englishVillaTopics } from "../lib/englishVillaTopics";

describe("Rental metadata and discoverability", () => {
  it("emits route-owned metadata matching the shared catalog and canonical", () => {
    for (const content of [publicVillaContent.it, publicVillaContent.en, ...Object.values(englishVillaTopics)]) {
      const head = new DOMParser().parseFromString(renderStaticPage(content.path).head, "text/html");
      expect(head.title).toBe(content.title);
      expect(head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(content.description);
      expect(head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
      expect(head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(SITE_ORIGIN + content.path);
    }
  });
  it("retains genuinely reciprocal IT/EN alternates only on the main pair", () => {
    for (const content of Object.values(publicVillaContent)) {
      const doc = new DOMParser().parseFromString(renderStaticPage(content.path).head, "text/html");
      for (const alternate of publicAlternates) expect(doc.querySelector(`link[hreflang="${alternate.lang}"]`)?.getAttribute("href")).toBe(alternate.href);
    }
    for (const content of Object.values(englishVillaTopics)) expect(renderStaticPage(content.path).head).not.toContain("hreflang=");
  });
  it("matches verified bathroom, bedroom and occupancy facts without fabricated ratings or offers", () => {
    const schema = villaStructuredData("en");
    expect(schema.containsPlace.numberOfBathroomsTotal).toBe(2);
    expect(schema.containsPlace.numberOfBedrooms).toBe(3);
    expect(schema.containsPlace.occupancy.maxValue).toBe(6);
    expect(schema).not.toHaveProperty("aggregateRating");
    expect(schema).not.toHaveProperty("offers");
  });
  it("keeps 11 existing sitemap URLs, public rendering and crawler access without new language pages", () => {
    const sitemap = new DOMParser().parseFromString(readFileSync("public/sitemap.xml", "utf8"), "application/xml");
    const urls = [...sitemap.querySelectorAll("loc")].map(loc => new URL(loc.textContent ?? ""));
    expect(urls).toHaveLength(11);
    for (const url of urls) { expect(url.origin).toBe(SITE_ORIGIN); expect(staticPaths).toContain(url.pathname); }
    expect(urls.some(url => /^\/(pl|de)\//.test(url.pathname))).toBe(false);
    const robots = readFileSync("public/robots.txt", "utf8");
    expect(robots).toContain("Sitemap: " + SITE_ORIGIN + "/sitemap.xml");
    expect(robots.split("\n")).not.toContain("Disallow: /");
    expect(robots).toContain("Disallow: /calendario");
  });
});