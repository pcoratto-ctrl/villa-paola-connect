import { supabase } from "@/integrations/supabase/client";

/**
 * Registra un click sui pulsanti di contatto (telefono / WhatsApp).
 * Fire-and-forget: non blocca mai la navigazione dell'utente.
 */
export function trackClick(eventType: "call" | "whatsapp", source: string) {
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
