import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

function sb() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export default defineTool({
  name: "submit_availability_request",
  title: "Submit availability request",
  description:
    "Send a new availability/quote request for Villa Paola Caposuvero. The owner will follow up by email or WhatsApp; this does not confirm a booking.",
  inputSchema: {
    guest_name: z.string().min(1).max(100).describe("Full name of the guest."),
    email: z.string().email().max(200).describe("Contact email."),
    phone: z.string().max(40).optional().describe("Phone number (with country code)."),
    arrival_date: z.string().optional().describe("Requested arrival date (YYYY-MM-DD)."),
    departure_date: z.string().optional().describe("Requested departure date (YYYY-MM-DD)."),
    guests_count: z.number().int().optional().describe("Number of guests."),
    message: z.string().max(1500).optional().describe("Free-form message or special requests."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input) => {
    const { data, error } = await sb()
      .from("leads")
      .insert({
        guest_name: input.guest_name.trim(),
        email: input.email.trim(),
        phone: input.phone?.trim() || null,
        arrival_date: input.arrival_date || null,
        departure_date: input.departure_date || null,
        guests_count: input.guests_count ?? null,
        message: input.message?.trim() || null,
      })
      .select("id,created_at")
      .single();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [
        {
          type: "text",
          text: `Request received (id ${data.id}). The owner will reply via email or WhatsApp.`,
        },
      ],
      structuredContent: { id: data.id, created_at: data.created_at },
    };
  },
});
