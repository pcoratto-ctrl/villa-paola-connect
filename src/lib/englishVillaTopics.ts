import { publicVillaContent } from "./publicVillaContent";

export const englishVillaTopics = {
  beach: {
    ...publicVillaContent.en,
    path: "/en/villa-direct-beach-access-calabria",
    title: "Villa with direct beach access in Calabria | Villa Paola",
    description: "Stay in an entire villa with direct beach access in Gizzeria, Calabria: three bedrooms for up to six guests, a garden and covered veranda by the sea.",
    h1: "From your villa straight to the beach",
    intro: "Stay together in an entire villa with direct beach access in Calabria. At Villa Paola in Gizzeria, the garden and covered veranda connect everyday life at the house with the shore, with three bedrooms for up to six guests.",
    imageAlt: "The shoreline beside Villa Paola in Caposuvero, Calabria",
    sections: [
      { title: "Direct access, not a private beach", text: "You can reach the beach directly from the property without crossing a road. That describes the connection between the villa and the shore, not an exclusive stretch of sand: the beach is not advertised as private. Before travelling, ask the owner about the access route if steps, uneven ground or mobility needs matter to your group." },
      { title: "A whole villa for your group", text: "The entire villa is for your exclusive use, rather than a room in shared accommodation. Three bedrooms accommodate up to six guests, with two bathrooms and an equipped kitchen across approximately 120 m². You can prepare meals together and keep separate bedrooms for quieter moments." },
      { title: "Between the garden, veranda and shore", text: "The sea-facing garden and covered veranda give you somewhere to return to after time on the beach: lunch at the house, a book in the shade or an evening meal together. Bring suitable footwear and check sea conditions on the day. Direct access does not imply lifeguards, beach equipment or year-round beach services; ask what is available for your dates." },
      { title: "Arriving in Gizzeria", text: "Plan your arrival with the owner." },
      { title: "Ask about your dates and access needs", text: "Send your preferred arrival and departure dates and the number of guests. Include any questions about the beach route or your group's needs so the owner can answer before you commit. The availability form is an enquiry, not a confirmed booking." },
    ],
  },
  seasons: {
    ...publicVillaContent.en,
    path: "/en/calabria-spring-autumn-holidays",
    title: "Spring and autumn holidays in Calabria | Villa Paola",
    description: "Plan a spring or autumn stay in an entire seaside villa in Gizzeria, Calabria: coastal walks, meals on the covered veranda and flexible days exploring inland.",
    h1: "Spring and autumn by the sea in Calabria",
    intro: "Make the villa your base, rather than building every day around swimming. Villa Paola offers an entire seaside home in Gizzeria for up to six guests, with three bedrooms, a garden, a covered veranda and direct beach access.",
    imageAlt: "Villa Paola's garden and sea view in changing evening light",
    sections: [
      { title: "Spring: leave room for unplanned days", text: "Start with breakfast at the house, then choose between a walk by the shore and a drive into Calabria's towns and countryside. Keep plans flexible: check the forecast before heading out and confirm opening hours for any attraction or restaurant you want to visit. A spring stay need not depend on swimming weather." },
      { title: "Autumn: combine the coast with time at home", text: "Use settled days for coastal walks and outings, then return to the villa for a meal together. The equipped kitchen makes self-catering practical when nearby services operate reduced hours. Do not assume summer beach clubs or restaurants remain open throughout autumn; ask the owner about your dates and check directly with each venue." },
      { title: "Pack for changing conditions", text: "Bring layers, a light rain jacket and comfortable walking shoes. The covered veranda provides an outdoor place to sit, but it does not guarantee shelter from wind or comfortable outdoor temperatures. Sea and weather conditions vary; swimming and sunshine are not promised. If indoor temperature control is important, ask the owner to confirm the available facilities before booking." },
      { title: "Getting here outside high summer", text: "Check travel options for your dates." },
      { title: "A stay planned around your priorities", text: "Tell the owner whether you are looking for quiet days at the villa, coastal walks or a base for exploring. Include your dates and group size in the availability enquiry, along with any questions about local services or arrival arrangements. Availability, price and conditions are confirmed directly, not by submitting the form." },
    ],
  },
};
export type EnglishVillaTopic = keyof typeof englishVillaTopics;
export const englishTopicImages = {
  beach: { hero: "gallery-spiaggia-e-isola-allorizzonte.webp", detail: "gallery-passaggio-laterale-vista-mare.webp", alt: "The sea-facing side passage at Villa Paola" },
  seasons: { hero: "giardino-tramonto-mare.webp", detail: "terrazza-pranzo-vista-mare.webp", alt: "The outdoor dining space at Villa Paola overlooking the sea" },
};