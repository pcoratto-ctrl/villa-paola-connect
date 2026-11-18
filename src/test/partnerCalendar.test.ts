import { describe, it, expect } from "vitest";
import { dayHalves, nightState, todayRome, type PartnerData } from "@/lib/partnerCalendar";

const data: PartnerData = {
  lastNight: "2027-12-31",
  cleaningCents: 15000,
  electricityIncluded: true,
  linenIncluded: true,
  bookings: [{ arrival: "2027-07-10", departure: "2027-07-17" }],
  periods: [
    { kind: "rate", arrival: "2027-07-01", departure: "2027-08-01", cents: 25000 },
    { kind: "block", arrival: "2027-07-20", departure: "2027-07-22", cents: null },
  ],
};

describe("partner calendar rules", () => {
  it("nights are end-exclusive: departure night is not booked", () => {
    expect(nightState(data, "2027-07-16").kind).toBe("booked");
    expect(nightState(data, "2027-07-17").kind).toBe("rate");
  });
  it("arrival day: morning free, afternoon (check-in 15:00) booked", () => {
    const h = dayHalves(data, "2027-07-10");
    expect(h.morning.kind).toBe("rate");
    expect(h.afternoon.kind).toBe("booked");
  });
  it("departure day: morning (until check-out 10:00) booked, afternoon free", () => {
    const h = dayHalves(data, "2027-07-17");
    expect(h.morning.kind).toBe("booked");
    expect(h.afternoon.kind).toBe("rate");
  });
  it("no nights after lastNight", () => {
    expect(nightState(data, "2027-12-31").kind).not.toBe("closed");
    expect(nightState(data, "2028-01-01").kind).toBe("closed");
  });
  it("today is computed in Europe/Rome", () => {
    // 23:30 UTC on 31 Dec is already 1 Jan in Rome (UTC+1)
    expect(todayRome(new Date("2026-12-31T23:30:00Z"))).toBe("2027-01-01");
  });
  it("blocks outrank rates", () => {
    expect(nightState(data, "2027-07-20").kind).toBe("block");
  });
});
