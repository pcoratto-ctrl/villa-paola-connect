import { describe, it, expect } from "vitest";
import { buildIcs, sanitize, unavailable } from "../../supabase/functions/_shared/partnerCore";

const raw = {
  lastNight: "2027-12-31",
  cleaningCents: 15000,
  electricityIncluded: true,
  linenIncluded: true,
  guestName: "Mario Rossi",
  bookings: [{ arrival: "2027-07-10", departure: "2027-07-17", guest: "Mario Rossi", email: "m@x.it" }],
  periods: [
    { kind: "rate", arrival: "2027-07-01", departure: "2027-08-01", cents: 25000 },
    { kind: "block", arrival: "2027-07-20", departure: "2027-07-22", cents: 0 },
    { kind: "option", arrival: "2027-07-16", departure: "2027-07-19", cents: 0 },
    { kind: "evil", arrival: "2027-09-01", departure: "2027-09-05" },
  ],
};

describe("partner data contract", () => {
  it("drops any field outside the contract (no guest/CRM data)", () => {
    const d = sanitize(raw);
    expect(JSON.stringify(d)).not.toContain("Mario");
    expect(JSON.stringify(d)).not.toContain("m@x.it");
    expect(d.periods.map((p) => p.kind)).toEqual(["rate", "block", "option"]);
  });
  it("defaults lastNight to 2027-12-31", () => {
    expect(sanitize({}).lastNight).toBe("2027-12-31");
  });
});

describe("iCal export", () => {
  const ranges = unavailable(sanitize(raw));
  const ics = buildIcs(ranges, new Date("2026-11-18T12:00:00Z"));

  it("contains bookings, blocks and options only — overlapping ranges merged, rates excluded", () => {
    expect(ranges).toEqual([
      { arrival: "2027-07-10", departure: "2027-07-19" },
      { arrival: "2027-07-20", departure: "2027-07-22" },
    ]);
  });
  it("uses all-day events with exclusive DTEND equal to the departure day", () => {
    expect(ics).toContain("DTSTART;VALUE=DATE:20270710\r\nDTEND;VALUE=DATE:20270719");
  });
  it("has no prices or guest data", () => {
    expect(ics).not.toMatch(/25000|250|€|Mario|@x\.it/);
    expect(ics).toContain("SUMMARY:Non disponibile");
  });
  it("uses CRLF line endings only", () => {
    expect(ics.split("\r\n").length).toBeGreaterThan(5);
    expect(ics.replace(/\r\n/g, "")).not.toContain("\n");
  });
  it("UIDs are stable across exports", () => {
    const again = buildIcs(ranges, new Date("2027-01-01T00:00:00Z"));
    const uids = (s: string) => s.match(/^UID:.*$/gm);
    expect(uids(again)).toEqual(uids(ics));
  });
});
