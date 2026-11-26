import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { fireEvent, render, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { canTrack, needsAnswer, onConsentChange, readChoice, saveChoices } from "../lib/consent";
import ConsentChoices from "../components/ConsentChoices";
import i18n from "../i18n/i18n";

const signal = vi.fn();
beforeEach(async () => {
  cleanup(); localStorage.clear(); signal.mockClear();
  Object.defineProperty(navigator, "globalPrivacyControl", { configurable: true, value: false });
  Object.assign(window, { consentAskEverywhere: true, gtag: signal });
  await i18n.changeLanguage("en");
});
describe("Shared consent signals", () => {
  it("denies optional analytics worldwide before choice, without requiring an analytics ID", () => {
    const html = readFileSync("index.html", "utf8");
    const defaults = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
    expect(defaults).toBeDefined();
    const runtime: Record<string, unknown> = { localStorage: { getItem: () => null }, navigator: {} };
    runtime.window = runtime;
    runInNewContext(defaults ?? "", runtime);
    const calls = runtime.dataLayer as IArguments[];
    expect(calls[0][0]).toBe("consent");
    expect(calls[0][1]).toBe("default");
    expect(calls[0][2]).toEqual({ analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  });
  it("transmits acceptance and withdrawal to Consent Mode", async () => {
    expect(await canTrack("analytics")).toBe(false);
    saveChoices({ analytics: "granted" });
    expect(await canTrack("analytics")).toBe(true);
    expect(signal).toHaveBeenLastCalledWith("consent", "update", { analytics_storage: "granted" });
    saveChoices({ analytics: "denied" });
    expect(await canTrack("analytics")).toBe(false);
    expect(signal).toHaveBeenLastCalledWith("consent", "update", { analytics_storage: "denied" });
  });
  it("enforces a browser privacy signal even over a saved grant", async () => {
    saveChoices({ analytics: "granted" });
    Object.defineProperty(navigator, "globalPrivacyControl", { configurable: true, value: true });
    saveChoices({ analytics: "granted" });
    expect(readChoice("analytics")).toBe("denied");
    expect(await needsAnswer(["analytics"])).toBe(false);
    expect(signal).toHaveBeenLastCalledWith("consent", "update", { analytics_storage: "denied" });
  });
  it("expires a grant without silently enabling tracking", async () => {
    localStorage.setItem("cookie_consent_analytics", JSON.stringify({ choice: "granted", at: Date.now() - 366 * 86400000 }));
    expect(await canTrack("analytics")).toBe(false);
    expect(await needsAnswer(["analytics"])).toBe(true);
  });
  it("propagates another tab’s refusal and restores denied signals", () => {
    const listener = vi.fn(); const unsubscribe = onConsentChange(listener);
    localStorage.setItem("cookie_consent_analytics", JSON.stringify({ choice: "denied", at: Date.now() }));
    window.dispatchEvent(new StorageEvent("storage", { key: "cookie_consent_analytics" }));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(signal).toHaveBeenLastCalledWith("consent", "update", { analytics_storage: "denied" });
    unsubscribe();
  });
  it("lets a visitor reject, reopen settings and change the same analytics purpose", async () => {
    const ui = render(<MemoryRouter><ConsentChoices /></MemoryRouter>);
    await waitFor(() => expect(ui.getByRole("button", { name: "Reject all" })).toBeInTheDocument());
    fireEvent.click(ui.getByRole("button", { name: "Reject all" }));
    expect(readChoice("analytics")).toBe("denied");
    fireEvent.click(ui.getByRole("button", { name: "Cookie settings" }));
    fireEvent.click(ui.getByRole("checkbox"));
    fireEvent.click(ui.getByRole("button", { name: "Save choices" }));
    expect(readChoice("analytics")).toBe("granted");
  });
});