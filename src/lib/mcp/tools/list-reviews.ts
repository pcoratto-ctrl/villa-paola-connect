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
  name: "list_reviews",
  title: "List approved reviews",
  description:
    "Return the latest approved guest reviews for Villa Paola Caposuvero (public data).",
  inputSchema: {
    limit: z
      .number()
      .int()
      .default(10)
      .describe("Maximum number of reviews to return (1-50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }) => {
    const capped = Math.min(Math.max(limit ?? 10, 1), 50);
    const { data, error } = await sb()
      .from("reviews")
      .select("guest_name,rating,comment,stay_date,created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(capped);
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { reviews: data ?? [] },
    };
  },
});
