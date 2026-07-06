import { defineMcp } from "@lovable.dev/mcp-js";
import getVillaInfo from "./tools/get-villa-info";
import listReviews from "./tools/list-reviews";
import submitAvailabilityRequest from "./tools/submit-availability-request";

export default defineMcp({
  name: "villa-paola-mcp",
  title: "Villa Paola Caposuvero",
  version: "0.1.0",
  instructions:
    "Tools for Villa Paola Caposuvero, a seaside villa in Gizzeria (Calabria, Italy). Use `get_villa_info` for facts and contacts, `list_reviews` for guest reviews, and `submit_availability_request` to send an availability/quote request to the owner. There is no online booking — the owner confirms via WhatsApp or email.",
  tools: [getVillaInfo, listReviews, submitAvailabilityRequest],
});
