import { defineTool } from "@lovable.dev/mcp-js";

const info = {
  name: "Villa Paola Caposuvero",
  location: "Gizzeria Lido, Calabria, Italy",
  description:
    "Premium seaside villa with direct/private beach access, garden, sea-view terrace. Pet-friendly, family-friendly, close to Lamezia Terme airport.",
  contacts: {
    whatsapp: "+39 335 538 4250",
    website: "https://villapaolacaposuvero.it",
  },
  features: [
    "Direct/private sea access",
    "Sea-view terrace and garden",
    "Pet-friendly (animals allowed)",
    "Family-friendly",
    "Close to Lamezia Terme airport",
  ],
  booking_channel:
    "No online booking. Availability is confirmed via WhatsApp, phone, or the availability request form on the website.",
};

export default defineTool({
  name: "get_villa_info",
  title: "Get villa info",
  description:
    "Return essential facts about Villa Paola Caposuvero: location, features, contacts, and how to book.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
    structuredContent: info,
  }),
});
