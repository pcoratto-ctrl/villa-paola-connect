import { measurementAllowed } from "./enquiryConsent";
import { supabase } from "@/integrations/supabase/client";

/**
 * Registra un click sui pulsanti di contatto (telefono / WhatsApp).
 * Fire-and-forget: non blocca mai la navigazione dell'utente.
 */
export async function trackClick(eventType: "call" | "whatsapp", source: string) {
  if (!(await measurementAllowed())) return;
  try {
    void supabase
      .from("click_events")
      .insert({
        event_type: eventType,
        source,
        page: window.location.pathname,
      })
      .then(({ error }) => {
        if (error) console.warn("trackClick failed:", error.message);
      });
  } catch {
    // mai bloccare il click dell'utente
  }
}
