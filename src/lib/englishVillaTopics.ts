import { publicVillaContent } from "./publicVillaContent";

export const englishVillaTopics = {
  beach: {
    ...publicVillaContent.en,
    path: "/en/villa-direct-beach-access-calabria",
    title: "Villa with direct beach access in Calabria | Villa Paola",
    description: "Stay in an entire villa with direct beach access in Gizzeria, Calabria: three bedrooms for up to six guests, a garden and covered veranda by the sea.",
    h1: "A villa with direct beach access in Calabria",
    intro: "Stay together in an entire villa with direct beach access in Calabria. At Villa Paola in Gizzeria, the garden and covered veranda connect everyday life at the house with the shore, with three bedrooms for up to six guests.",
    imageAlt: "The shoreline beside Villa Paola in Caposuvero, Calabria",
    sections: [
      { title: "From the garden to the shore in Gizzeria", text: "Step out into Villa Paola's garden and follow the property's access route to the beach, without crossing a road. In Caposuvero, Gizzeria, the shore is part of everyday life at the villa: a walk beside the water, time in the garden and a return to the veranda for lunch. If your group has mobility needs, ask the owner about the route before arranging your stay." },
      { title: "A whole villa for your group", text: "The entire villa is for your exclusive use, rather than a room in shared accommodation. Three bedrooms accommodate up to six guests, with two bathrooms and an equipped kitchen across approximately 120 m². You can prepare meals together and keep separate bedrooms for quieter moments." },
      { title: "Between the garden, veranda and shore", text: "The private garden by the sea and covered veranda give you somewhere to return to after time on the beach: lunch at the house, a book in the shade or an evening meal together. Bring suitable footwear for exploring the shore and check sea conditions on the day. For beach equipment or nearby seasonal services, ask what is available during your stay." },
      { title: "Arriving in Gizzeria", text: "Plan your arrival with the owner." },
      { title: "Plan your stay by the shore", text: "Send your preferred dates and the number of guests for a personal availability reply. Include any questions about the beach route or your group's needs. The owner will discuss the details with you and confirm your stay directly; the form starts an enquiry." },
    ],
  },
  seasons: {
    ...publicVillaContent.en,
    path: "/en/calabria-spring-autumn-holidays",
    title: "Spring and Autumn Villa Holidays in Calabria | Villa Paola",
    description: "Plan a May or October villa holiday in Gizzeria, Calabria: three bedrooms for six guests, a garden by the sea, covered veranda and flexible coastal and inland days.",
    h1: "Spring and autumn villa holidays in Calabria",
    intro: "Make a private seafront villa in Gizzeria your base for a spring or autumn holiday in Calabria. Whether you are considering May or October, Villa Paola offers exclusive use of the whole home: three bedrooms for up to six guests, a garden by the sea, a covered veranda and direct beach access.",
    imageAlt: "Villa Paola's garden and sea view in changing evening light",
    sections: [
      { title: "May: mornings by the sea, afternoons exploring", text: "Start with breakfast at the villa, then choose a walk by the shore or a drive into Calabria's towns and countryside. Plan one outing at a time and leave space for a long lunch or an afternoon at home. Check the forecast and opening hours before heading out so your May itinerary can change with the day." },
      { title: "October: coast, countryside and meals together", text: "Combine coastal walks with inland outings, returning to the villa for dinner around the table. The equipped kitchen makes self-catering easy, while the covered veranda offers another place to gather when conditions suit. Check directly with restaurants and attractions for October opening hours rather than relying on summer schedules." },
      { title: "A flexible itinerary, a comfortable base", text: "Bring layers, a light rain jacket and comfortable walking shoes, and keep a mix of outdoor outings and relaxed time at the villa in your plans. Weather and sea conditions vary in spring and autumn. The November garden photograph records one observed day on 19 November 2026, not a forecast for your stay." },
      { title: "Getting here outside high summer", text: "Check travel options for your dates." },
      { title: "A stay planned around your priorities", text: "Tell the owner whether you are looking for quiet days at the villa, coastal walks or a base for exploring. Share your dates and group size, along with questions about local services or arrival arrangements. You will receive a personal availability reply and quote before confirming your stay directly." },
    ],
  },
};
export type EnglishVillaTopic = keyof typeof englishVillaTopics;
export const englishTopicImages = {
  beach: { hero: "gallery-spiaggia-e-isola-allorizzonte.webp", detail: "gallery-passaggio-laterale-vista-mare.webp", alt: "The sea-facing side passage at Villa Paola" },
  seasons: { hero: "giardino-tramonto-mare.webp", detail: "terrazza-pranzo-vista-mare.webp", alt: "The outdoor dining space at Villa Paola overlooking the sea" },
};