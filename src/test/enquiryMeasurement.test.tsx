import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, cleanup, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DisponibilitaSection from "../components/DisponibilitaSection";
import PublicVillaArticle from "../components/PublicVillaArticle";
import i18n from "../i18n/i18n";
import { measurementAllowed, setEnquiryMeasurementConsent, sanitizeEnquiryAttribution, enquiryMeasurementProperties } from "../lib/enquiryConsent";
import { isLeadAcknowledgement } from "../lib/leadAcknowledgement";
import { trackClick } from "../lib/trackClick";

const { invoke, insert } = vi.hoisted(() => ({ invoke: vi.fn(), insert: vi.fn(() => Promise.resolve({ error: null })) }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke }, from: () => ({ insert }) } }));
vi.mock("@/hooks/use-toast", () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock("framer-motion", () => ({ motion: { div: ({ initial, whileInView, viewport, transition, ...props }: Record<string, unknown>) => <div {...props} /> } }));
const ack = { id: "12345678-1234-1234-1234-123456789abc", created_at: "2026-11-26T21:30:00Z", email_sent: false };
const track = vi.fn();
function renderForm() {
  return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}><DisponibilitaSection /></QueryClientProvider>);
}
function fillAndSubmit(container: HTMLElement) {
  fireEvent.change(container.querySelector('input[type="text"]') as Element, { target: { value: "Synthetic local test" } });
  fireEvent.change(container.querySelector('input[type="email"]') as Element, { target: { value: "synthetic@example.invalid" } });
  fireEvent.click(container.querySelector('form input[type="checkbox"]') as Element);
  fireEvent.submit(container.querySelector("form") as Element);
}
beforeEach(async () => {
  cleanup(); vi.clearAllMocks(); localStorage.clear();
  Object.defineProperty(navigator, "globalPrivacyControl", { configurable: true, value: false });
  setEnquiryMeasurementConsent(false);
  window.__lovableEvents = { track };
  await i18n.changeLanguage("en");
});
afterEach(() => { cleanup(); setEnquiryMeasurementConsent(false); delete window.__lovableEvents; });

describe("Consent and attribution", () => {
  it("does not transmit legacy contact measurements before opt-in", async () => {
    expect(await measurementAllowed()).toBe(false);
    await trackClick("whatsapp", "footer");
    expect(insert).not.toHaveBeenCalled();
  });
  it("allows opt-in, then stops on withdrawal and erases attribution", async () => {
    setEnquiryMeasurementConsent(true);
    expect(await measurementAllowed()).toBe(true);
    expect(enquiryMeasurementProperties("en")).toHaveProperty("landing_path");
    setEnquiryMeasurementConsent(false);
    await trackClick("whatsapp", "footer");
    expect(await measurementAllowed()).toBe(false);
    expect(enquiryMeasurementProperties("en")).not.toHaveProperty("landing_path");
    expect(insert).not.toHaveBeenCalled();
  });
  it("Global Privacy Control overrides opt-in", async () => {
    Object.defineProperty(navigator, "globalPrivacyControl", { configurable: true, value: true });
    setEnquiryMeasurementConsent(true);
    expect(await measurementAllowed()).toBe(false);
    expect(enquiryMeasurementProperties("it")).toEqual({ page_language: "it" });
  });
  it("keeps only public paths, referral hosts and allowlisted UTM values", () => {
    expect(sanitizeEnquiryAttribution("https://villapaolacaposuvero.it/en/beachfront-villa-calabria?utm_source=facebook&utm_medium=social&utm_campaign=villa_paola&email=private@example.invalid&gclid=secret#private", "https://www.facebook.com/private?token=secret")).toEqual({ landing_path: "/en/beachfront-villa-calabria", referrer_host: "facebook.com", utm_source: "facebook", utm_medium: "social", utm_campaign: "villa_paola" });
  });
  it("drops personal paths, unknown hosts and free-form campaign values", () => {
    expect(sanitizeEnquiryAttribution("https://villapaolacaposuvero.it/admin/person-name?utm_source=private@example.invalid&utm_campaign=person-name", "https://person-name.example.invalid/private")).toEqual({ landing_path: "/", referrer_host: "" });
  });
});
describe("Actual enquiry handlers (delivery mocked; no live leads or emails)", () => {
  it("saves an enquiry without optional measurement consent and emits nothing", async () => {
    invoke.mockResolvedValue({ data: ack, error: null });
    const { container } = renderForm(); fillAndSubmit(container);
    await waitFor(() => expect(container.querySelector("form")).toBeNull());
    expect(invoke).toHaveBeenCalledTimes(1);
    expect(invoke.mock.calls[0][1].body).not.toHaveProperty("attribution");
    expect(track).not.toHaveBeenCalled();
  });
  it("emits one form start and one generate_lead only after server acknowledgement, despite repeated submit", async () => {
    let resolve: (value: unknown) => void = () => {};
    invoke.mockImplementation(() => new Promise(r => { resolve = r; }));
    const { container } = renderForm();
    fireEvent.click(container.querySelector('input[type="checkbox"]') as Element);
    fillAndSubmit(container);
    fireEvent.submit(container.querySelector("form") as Element);
    expect(track.mock.calls.filter(c => c[0] === "project.generate_lead")).toHaveLength(0);
    await waitFor(() => expect(invoke).toHaveBeenCalledTimes(1));
    resolve({ data: ack, error: null });
    await waitFor(() => expect(track.mock.calls.filter(c => c[0] === "project.generate_lead")).toHaveLength(1));
    expect(track.mock.calls.filter(c => c[0] === "project.availability_form_started")).toHaveLength(1);
    for (const call of track.mock.calls) expect(call[1]).toEqual(expect.objectContaining({ page_language: "en" }));
    expect(JSON.stringify(track.mock.calls)).not.toContain("synthetic@example.invalid");
  });
  it.each([{ data: null, error: new Error("failed") }, { data: { error: "failed" }, error: null }, { data: {}, error: null }])("never emits generate_lead for failure or a malformed success response", async response => {
    invoke.mockResolvedValue(response);
    const { container } = renderForm();
    fireEvent.click(container.querySelector('input[type="checkbox"]') as Element);
    fillAndSubmit(container);
    await waitFor(() => expect(invoke).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(container.querySelector('button[type="submit"]')).not.toBeDisabled());
    expect(container.querySelector("form")).not.toBeNull();
    expect(track.mock.calls.filter(c => c[0] === "project.generate_lead")).toHaveLength(0);
  });
  it("does not send a success event when consent is withdrawn while delivery is pending", async () => {
    let resolve: (value: unknown) => void = () => {};
    invoke.mockImplementation(() => new Promise(r => { resolve = r; }));
    const { container } = renderForm();
    fireEvent.click(container.querySelector('input[type="checkbox"]') as Element);
    fillAndSubmit(container);
    await waitFor(() => expect(invoke).toHaveBeenCalledTimes(1));
    fireEvent.click(container.querySelector('input[type="checkbox"]') as Element);
    resolve({ data: ack, error: null });
    await waitFor(() => expect(container.querySelector("form")).toBeNull());
    expect(track.mock.calls.filter(c => c[0] === "project.generate_lead")).toHaveLength(0);
  });
  it("distinguishes WhatsApp clicks from saved enquiries", async () => {
    const { container } = renderForm();
    fireEvent.click(container.querySelector('input[type="checkbox"]') as Element);
    fireEvent.click(container.querySelector('a[href^="https://wa.me"]') as Element);
    await waitFor(() => expect(track).toHaveBeenCalledWith("project.whatsapp_clicked", expect.objectContaining({ page_language: "en" })));
    expect(invoke).not.toHaveBeenCalled();
    expect(track.mock.calls.filter(c => c[0] === "project.generate_lead")).toHaveLength(0);
  });
  it("measures availability anchors only after opt-in", async () => {
    const { container } = render(<PublicVillaArticle locale="en" />);
    const anchor = container.querySelector('a[href="#disponibilita"]') as Element;
    fireEvent.click(anchor); await Promise.resolve(); expect(track).not.toHaveBeenCalled();
    setEnquiryMeasurementConsent(true);
    fireEvent.click(anchor);
    await waitFor(() => expect(track).toHaveBeenCalledWith("project.availability_cta_clicked", expect.objectContaining({ page_language: "en" })));
    setEnquiryMeasurementConsent(false);
    fireEvent.click(anchor); await Promise.resolve(); expect(track).toHaveBeenCalledTimes(1);
  });
  it("accepts saved-request acknowledgement even when email delivery is not confirmed", () => {
    expect(isLeadAcknowledgement(ack)).toBe(true);
    expect(isLeadAcknowledgement({ ...ack, id: "" })).toBe(false);
  });
});