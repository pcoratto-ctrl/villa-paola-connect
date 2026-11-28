import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GettingHere from "../components/GettingHere";
import { ARRIVAL_ANIMATION_MS, arrivalRoutes } from "../lib/gettingHereContent";
import { renderStaticPage } from "../lib/staticPublicDocument";

let frames: Map<number, FrameRequestCallback>;
let nextId: number;
let reduced: boolean;
let mediaChanges: Array<() => void>;

beforeEach(() => {
  frames = new Map(); nextId = 0; reduced = false; mediaChanges = [];
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { frames.set(++nextId, callback); return nextId; });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal("matchMedia", () => ({ get matches() { return reduced; }, addEventListener: (_: string, fn: () => void) => { mediaChanges.push(fn); }, removeEventListener: () => {} }));
  // Geometry only for component lifecycle tests; actual SVG motion is checked in Chromium.
  Object.defineProperty(SVGElement.prototype, "getTotalLength", { configurable: true, value: () => 100 });
  Object.defineProperty(SVGElement.prototype, "getPointAtLength", { configurable: true, value: (distance: number) => ({ x: 410 - 2 * distance, y: 365 - 2.95 * distance }) });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
function frame(time: number) {
  act(() => { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(callback => callback(time)); });
}

describe("arrival controls", () => {
  it("uses the owner's 15-minute indication for both origins", () => {
    expect(arrivalRoutes.airport.minutes).toBe(15);
    expect(arrivalRoutes.station.minutes).toBe(15);
  });
  it("keeps airport and station playback independent", () => {
    render(<GettingHere locale="en" />);
    const airport = within(screen.getByRole("article", { name: "Lamezia Terme Airport (SUF)" }));
    const station = within(screen.getByRole("article", { name: "Lamezia Terme Centrale Station" }));
    const initialStation = station.getByTestId("arrival-car").getAttribute("transform");
    fireEvent.click(airport.getByRole("button", { name: "Play route" })); frame(0); frame(2000);
    expect(station.getByTestId("arrival-car").getAttribute("transform")).toBe(initialStation);
    const airportProgress = airport.getByTestId("arrival-car").getAttribute("transform");
    fireEvent.click(station.getByRole("button", { name: "Play route" }));
    fireEvent.click(airport.getByRole("button", { name: "Pause" })); frame(3000); frame(4000);
    expect(airport.getByTestId("arrival-car").getAttribute("transform")).toBe(airportProgress);
    expect(station.getByTestId("arrival-car").getAttribute("transform")).not.toBe(initialStation);
    expect(frames.size).toBe(1);
  });
  it("finishes in six seconds and replays from the start", () => {
    expect(ARRIVAL_ANIMATION_MS).toBe(6000);
    render(<GettingHere locale="en" />);
    fireEvent.click(screen.getAllByRole("button", { name: "Play route" })[0]);
    frame(0); frame(5999);
    expect(screen.getByRole("button", { name: "Pause" })).toBeEnabled();
    frame(6000);
    expect(screen.getAllByTestId("arrival-car")[0].getAttribute("transform")).toContain("translate(210 70)");
    fireEvent.click(screen.getByRole("button", { name: "Replay route" }));
    frame(7000);
    expect(screen.getAllByTestId("arrival-car")[0].getAttribute("transform")).toContain("translate(410 365)");
  });
  it("pauses without losing progress and resumes from the same point", () => {
    render(<GettingHere locale="en" />);
    fireEvent.click(screen.getAllByRole("button", { name: "Play route" })[0]); frame(0); frame(2000);
    const paused = screen.getAllByTestId("arrival-car")[0].getAttribute("transform");
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(frames.size).toBe(0);
    fireEvent.click(screen.getAllByRole("button", { name: "Play route" })[0]); frame(10000);
    expect(screen.getAllByTestId("arrival-car")[0].getAttribute("transform")).toBe(paused);
    frame(14000);
    expect(screen.getByRole("button", { name: "Replay route" })).toBeEnabled();
  });
  it("keeps both routes static with reduced motion", () => {
    reduced = true;
    render(<GettingHere locale="it" />);
    for (const button of screen.getAllByRole("button", { name: "Avvia percorso" })) expect(button).toBeDisabled();
    expect(frames.size).toBe(0);
    const cars = screen.getAllByTestId("arrival-car");
    expect(cars[0].getAttribute("transform")).toContain("translate(410 365)");
    expect(cars[1].getAttribute("transform")).toContain("translate(450 240)");
  });
  it("stops an active animation when reduced motion is enabled", () => {
    render(<GettingHere locale="en" />);
    fireEvent.click(screen.getAllByRole("button", { name: "Play route" })[0]); frame(0); frame(2000);
    act(() => { reduced = true; mediaChanges.forEach(fn => fn()); });
    expect(frames.size).toBe(0);
    expect(screen.getAllByRole("button", { name: "Play route" })[0]).toBeDisabled();
  });
});

it("prerenders one arrival diagram per homepage/commercial page without changing canonicals", () => {
  for (const path of ["/", "/villa-sul-mare-calabria", "/en/beachfront-villa-calabria", "/en/villa-direct-beach-access-calabria", "/en/calabria-spring-autumn-holidays"]) {
    const page = renderStaticPage(path);
    expect(page.body.match(/id="getting-here"/g)).toHaveLength(1);
    expect(page.body).toContain(path.startsWith("/en/") ? "Illustrative map" : "Mappa illustrativa");
    expect(page.head).toContain(`rel="canonical" href="https://villapaolacaposuvero.it${path}"`);
  }
});