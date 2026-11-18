import { describe, it, expect } from "vitest";
import { galleryPhotos, galleryCategories, previewPhotos } from "@/lib/galleryCatalog";

describe("V2 gallery selection", () => {
  it("contains 50 distinct photos in the CSV order", () => {
    expect(galleryPhotos).toHaveLength(50);
    expect(new Set(galleryPhotos.map(p => p.src)).size).toBe(50);
    expect(galleryPhotos.map(p => p.order)).toEqual(Array.from({ length: 50 }, (_, i) => i + 1));
  });
  it("keeps nine exterior, terrace and sea preview photos", () => {
    expect(previewPhotos).toHaveLength(9);
    expect(previewPhotos.every(p => ["villa", "terrace", "sea"].includes(p.category))).toBe(true);
    expect(previewPhotos.some(p => p.id === 52)).toBe(false);
  });
  it("excludes the four rejected catalog IDs and the mobile hero", () => {
    expect(galleryPhotos.filter(p => [9, 28, 30, 39, 15].includes(p.id))).toEqual([]);
    expect(galleryPhotos.some(p => p.src.includes("hero-terrazza-mare-mobile"))).toBe(false);
  });
  it("includes all four V2 additions and places the gate last in its category", () => {
    expect(galleryPhotos.filter(p => p.id >= 52).map(p => p.id).sort()).toEqual([52, 53, 54, 55]);
    expect(galleryPhotos.filter(p => p.category === "villa").at(-1)?.id).toBe(52);
  });
  it("keeps categories ordered and interiors secondary, including the verified existing photos", () => {
    expect(galleryCategories).toEqual(["villa", "terrace", "sea", "sunset", "interiors"]);
    expect(galleryPhotos.slice(40).every(p => p.category === "interiors")).toBe(true);
    expect(galleryPhotos.slice(-2).map(p => [p.id, p.room])).toEqual([[50, "living"], [51, "bedrooms"]]);
  });
});