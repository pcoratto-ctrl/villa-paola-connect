import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import i18n from "../i18n/i18n";
import Footer from "../components/Footer";
import { publicAlternates, publicVillaContent, SITE_ORIGIN, villaStructuredData, villaFacts, AIRPORT_URL, DIRECTIONS_URL } from "../lib/publicVillaContent";
import { renderStaticPage, staticPaths } from "../lib/staticPublicDocument";
import { englishDiscoveryLinks, englishVillaTopics } from "../lib/englishVillaTopics";

describe("Public localized SEO rules", () => {
  it("uses the owner's corrected street number in structured data", () => {
    expect(villaStructuredData("it").address.streetAddress).toBe("SS18, Contrada Caposuvero 6");
    expect(villaStructuredData("en").address.streetAddress).toBe("SS18, Contrada Caposuvero 6");
  });
  it("includes the requested direct beach access preview route", () => {
    expect(englishVillaTopics.beach.path).toBe("/en/villa-direct-beach-access-calabria");
    expect(staticPaths).toContain(englishVillaTopics.beach.path);
  });
  it("includes the requested spring and autumn preview route", () => {
    expect(englishVillaTopics.seasons.path).toBe("/en/calabria-spring-autumn-holidays");
    expect(staticPaths).toContain(englishVillaTopics.seasons.path);
  });
  it("does not assign unrelated Italian language equivalents to English topics", () => {
    for (const c of Object.values(englishVillaTopics)) {
      expect(renderStaticPage(c.path).head).not.toContain('hreflang=');
      expect(renderStaticPage(c.path).lang).toBe("en");
    }
  });
  it("keeps the existing Italian villa URL", () => {
    expect(publicVillaContent.it.path).toBe("/villa-sul-mare-calabria");
  });
  it("keeps the sole international English URL", () => {
    expect(publicVillaContent.en.path).toBe("/en/beachfront-villa-calabria");
  });
  it("excludes the unpublished German route from generated output and sitemap", () => {
    const path = "/de/ferienvilla-am-meer-kalabrien";
    expect(staticPaths).not.toContain(path);
    expect(readFileSync("public/sitemap.xml", "utf8")).not.toContain(path);
  });
  it("excludes the unpublished French route from generated output and sitemap", () => {
    const path = "/fr/villa-bord-de-mer-calabre";
    expect(staticPaths).not.toContain(path);
    expect(readFileSync("public/sitemap.xml", "utf8")).not.toContain(path);
  });
  it("covers only Italian and English on the canonical production origin", () => {
    expect(publicAlternates.map(a => a.lang)).toEqual(["it", "en"]);
    expect(publicAlternates.map(a => new URL(a.href).origin)).toEqual([SITE_ORIGIN, SITE_ORIGIN]);
  });
  it("exposes three bedrooms as verified accommodation data", () => {
    expect(villaStructuredData("it").containsPlace.numberOfBedrooms).toBe(3);
  });
  it("limits the advertised accommodation capacity to six guests", () => {
    expect(villaStructuredData("en").containsPlace.occupancy.maxValue).toBe(6);
  });
  it("retains all six existing Italian commercial inbound routes", () => {
    for (const path of ["/villa-accesso-diretto-spiaggia-calabria", "/casa-vacanze-gizzeria", "/villa-vicino-aeroporto-lamezia", "/villa-per-famiglie-calabria", "/villa-pet-friendly-calabria", "/vacanze-settembre-calabria"]) expect(staticPaths).toContain(path);
  });
  it("makes URL locale independent of visitor preferences in static rendering", () => {
    expect(renderStaticPage(publicVillaContent.en.path).lang).toBe("en");
    expect(renderStaticPage(publicVillaContent.it.path).lang).toBe("it");
  });
  it("uses the owner's approximate airport drive time", () => {
    expect(villaFacts.airportDriveMinutes).toBe(15);
  });
  it("identifies Lamezia Terme airport by SUF", () => {
    expect(villaFacts.airportCode).toBe("SUF");
  });
  it("uses the official SACAL source supplied by the owner", () => {
    expect(AIRPORT_URL).toBe("https://sacal.it/it/lamezia-terme/");
  });
  it("uses the existing property address for map directions", () => {
    expect(new URL(DIRECTIONS_URL).searchParams.get("destination")).toBe("Villa Paola Caposuvero, SS18, Contrada Caposuvero 6, Gizzeria Lido, Calabria, Italy");
  });

  it("links Footer discovery to the 3 English routes in English and retains Italian routes in Italian", async () => {
    await i18n.changeLanguage("en");
    const enHtml = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Footer)));
    for (const link of englishDiscoveryLinks) {
      expect(enHtml).toContain(`href="${link.to}"`);
      expect(enHtml).toContain(link.label.replace(/&/g, "&amp;"));
    }
    expect(enHtml).not.toContain('href="/villa-sul-mare-calabria"');
    expect(enHtml).not.toContain('href="/casa-vacanze-gizzeria"');

    await i18n.changeLanguage("it");
    const itHtml = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Footer)));
    for (const path of ["/villa-sul-mare-calabria", "/villa-accesso-diretto-spiaggia-calabria", "/casa-vacanze-gizzeria", "/villa-vicino-aeroporto-lamezia", "/villa-per-famiglie-calabria", "/villa-pet-friendly-calabria", "/vacanze-settembre-calabria"]) {
      expect(itHtml).toContain(`href="${path}"`);
    }
  });

  it("exposes crawlable English topic discovery in generated homepage HTML", () => {
    const home = renderStaticPage("/");
    expect(home.head).toContain(`rel="canonical" href="${SITE_ORIGIN}/"`);
    for (const link of englishDiscoveryLinks) {
      expect(home.body).toContain(`href="${link.to}"`);
      expect(home.body).toContain(link.label.replace(/&/g, "&amp;"));
    }
  });

  it("renders distinct visible English FAQs, quote CTA and no-JS fallback without FAQPage or rating schema", () => {
    const main = renderStaticPage("/en/beachfront-villa-calabria");
    const beach = renderStaticPage("/en/villa-direct-beach-access-calabria");
    const seasons = renderStaticPage("/en/calabria-spring-autumn-holidays");

    expect(main.body).toContain("three bedrooms, two bathrooms");
    expect(main.body).toContain("not a private beach");
    expect(main.body).toContain("15-minute drive");
    expect(main.body).toContain("7 nights unless explicitly agreed");
    expect(main.head).toContain(`hreflang="it" href="${SITE_ORIGIN}/villa-sul-mare-calabria"`);
    expect(main.head).toContain(`hreflang="en" href="${SITE_ORIGIN}/en/beachfront-villa-calabria"`);

    expect(beach.body).toContain("mobility requirements");
    expect(beach.body).toContain("not a private beach");
    expect(beach.body).toContain("7 nights unless explicitly agreed");

    expect(seasons.body).toContain("flexible itinerary");
    expect(seasons.body).toContain("opening hours");
    expect(seasons.body).toContain("7 nights unless explicitly agreed");

    for (const page of [main, beach, seasons]) {
      expect(page.body).toContain("Check availability &amp; request a quote");
      expect(page.body).toContain('href="#disponibilita"');
      expect(page.body).toContain('href="/?lang=en#disponibilita"');
      expect(page.head).not.toContain("FAQPage");
      expect(page.head).not.toContain("AggregateRating");
    }
  });
});