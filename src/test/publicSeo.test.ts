import { describe, it, expect } from "vitest";
import { publicAlternates, publicVillaContent, SITE_ORIGIN, villaStructuredData, villaFacts, AIRPORT_URL, DIRECTIONS_URL } from "../lib/publicVillaContent";
import { renderStaticPage, staticPaths } from "../lib/staticPublicDocument";

describe("Public localized SEO rules", () => {
  it("keeps the existing Italian villa URL", () => {
    expect(publicVillaContent.it.path).toBe("/villa-sul-mare-calabria");
  });
  it("covers Italian, German, English and French on the canonical production origin", () => {
    expect(publicAlternates.map(a => a.lang)).toEqual(["it", "de", "en", "fr"]);
    expect(publicAlternates.map(a => new URL(a.href).origin)).toEqual([SITE_ORIGIN, SITE_ORIGIN, SITE_ORIGIN, SITE_ORIGIN]);
  });
  it("exposes three bedrooms as verified accommodation data", () => {
    expect(villaStructuredData("de").containsPlace.numberOfBedrooms).toBe(3);
  });
  it("limits the advertised accommodation capacity to six guests", () => {
    expect(villaStructuredData("en").containsPlace.occupancy.maxValue).toBe(6);
  });
  it("retains all six existing Italian commercial inbound routes", () => {
    for (const path of ["/villa-accesso-diretto-spiaggia-calabria", "/casa-vacanze-gizzeria", "/villa-vicino-aeroporto-lamezia", "/villa-per-famiglie-calabria", "/villa-pet-friendly-calabria", "/vacanze-settembre-calabria"]) expect(staticPaths).toContain(path);
  });
  it("makes URL locale independent of visitor preferences in static rendering", () => {
    expect(renderStaticPage(publicVillaContent.de.path).lang).toBe("de");
    expect(renderStaticPage(publicVillaContent.en.path).lang).toBe("en");
    expect(renderStaticPage(publicVillaContent.it.path).lang).toBe("it");
    expect(renderStaticPage(publicVillaContent.fr.path).lang).toBe("fr");
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
    expect(new URL(DIRECTIONS_URL).searchParams.get("destination")).toBe("Villa Paola Caposuvero, SS18, Contrada Caposuvero 31, Gizzeria Lido, Calabria, Italy");
  });
});