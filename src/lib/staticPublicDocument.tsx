import { renderToStaticMarkup } from "react-dom/server";
import PublicVillaArticle from "../components/PublicVillaArticle";
import { publicVillaContent, publicAlternates, SITE_ORIGIN, villaStructuredData, type PublicLocale } from "./publicVillaContent";
import it from "../locales/it.json";
import { englishDiscoveryLinks, englishVillaTopics, type EnglishVillaTopic } from "./englishVillaTopics";
import GettingHere from "../components/GettingHere";

const legacyPages = {
  "/villa-accesso-diretto-spiaggia-calabria": "beach", "/casa-vacanze-gizzeria": "gizzeria",
  "/villa-vicino-aeroporto-lamezia": "airport", "/villa-per-famiglie-calabria": "family",
  "/villa-pet-friendly-calabria": "pet", "/vacanze-settembre-calabria": "september",
} as const;
const internalPaths = ["/admin", "/admin/login", "/admin/operatori", "/calendario", "/calendario/login", "/reset-password"];
const legalPaths = ["/privacy-policy", "/cookie-policy", "/termini-condizioni"];
const legacyHomeRedirects = ["/it/home"];
export const staticPaths = ["/", ...legacyHomeRedirects, ...Object.values(publicVillaContent).map(c => c.path), ...Object.values(englishVillaTopics).map(c => c.path), ...Object.keys(legacyPages), ...internalPaths, ...legalPaths];
const escape = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));

export function renderStaticPage(path: string) {
  if (legacyHomeRedirects.includes(path)) {
    const target = `${SITE_ORIGIN}/`;
    const title: string = it.index.title;
    const description: string = it.index.description;
    const head = `<title>${escape(title)}</title><meta data-rh="true" name="description" content="${escape(description)}"><meta data-rh="true" name="robots" content="index,follow"><link data-rh="true" rel="canonical" href="${target}"><meta http-equiv="refresh" content="0; url=${target}"><meta data-rh="true" property="og:title" content="${escape(title)}"><meta data-rh="true" property="og:description" content="${escape(description)}"><meta data-rh="true" property="og:url" content="${target}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}">`;
    const body = renderToStaticMarkup(<main className="villa-section py-20"><div className="villa-container"><p>Questa pagina si trova ora all&apos;indirizzo principale: <a href={target}>Villa Paola Caposuvero</a>.</p></div></main>);
    return { head, body, lang: "it" };
  }
  const topic = (Object.keys(englishVillaTopics) as EnglishVillaTopic[]).find(t => englishVillaTopics[t].path === path);
  const locale = topic ? "en" : (Object.keys(publicVillaContent) as PublicLocale[]).find(l => publicVillaContent[l].path === path);
  let title: string = it.index.title;
  let description: string = it.index.description;
  let body = "";
  const noindex = internalPaths.includes(path) || legalPaths.includes(path);
  if (locale) {
    const c = topic ? englishVillaTopics[topic] : publicVillaContent[locale]; title = c.title; description = c.description;
    body = renderToStaticMarkup(<><PublicVillaArticle locale={locale} topic={topic} /><section id="disponibilita" className="villa-section py-12"><div className="villa-container"><h2 className="font-display text-3xl mb-4">{c.cta}</h2><p>{c.sections[4].text}</p><a href={locale === "en" ? "/?lang=en#disponibilita" : "/#disponibilita"}>{c.cta}</a></div></section></>);
  } else if (path in legacyPages) {
    const key = legacyPages[path as keyof typeof legacyPages]; const c = it.seoPages[key]; title = c.title; description = c.description;
    body = renderToStaticMarkup(<main className="villa-section py-24"><div className="villa-container"><a href="/">Villa Paola Caposuvero</a><h1 className="font-display text-4xl my-8">{c.h1}</h1><p>{c.intro}</p>{c.body.map(text => <p key={text} className="my-6">{text}</p>)}<a href="#disponibilita">Richiedi disponibilità</a><section id="disponibilita"><a href="/#disponibilita">Richiedi le date disponibili</a></section></div></main>);
  } else if (path === "/") {
    body = renderToStaticMarkup(<main className="villa-section py-20"><div className="villa-container"><h1 className="font-display text-5xl">{it.hero.titleLine1} {it.hero.titleLine2}</h1><p>{it.hero.subtitle}</p><img src="/images/villa-paola-restyle/hero-giardino-mare-desktop.webp" alt={it.hero.imageAlt} width={2560} height={1920} /><h2>Villa Paola Caposuvero</h2><p>{publicVillaContent.it.intro}</p>{publicVillaContent.it.sections.slice(0, 4).map((s, index) => <section key={s.title}><h2>{s.title}</h2><p>{s.text}</p>{index === 3 && <GettingHere locale="it" />}</section>)}<section id="disponibilita"><h2>{it.availability.titleStart} {it.availability.titleEmph}</h2><p>{it.availability.subtitle}</p><a href="https://wa.me/393355384250">WhatsApp</a></section><nav aria-label="Italiano e English"><p><a href={publicVillaContent.it.path}>{publicVillaContent.it.language} · {publicVillaContent.it.h1}</a></p><ul>{englishDiscoveryLinks.map(link => <li key={link.to}><a href={link.to} lang="en">{link.label}</a></li>)}</ul></nav></div></main>);
  } else { title = noindex ? "Area riservata / Informazioni · Villa Paola Caposuvero" : title; }
  const alternates = locale && !topic ? [...publicAlternates, { lang: "x-default", href: publicAlternates[0].href }].map(a => `<link data-rh="true" rel="alternate" hreflang="${a.lang}" href="${a.href}">`).join("") : "";
  const head = `<title>${escape(title)}</title><meta data-rh="true" name="description" content="${escape(description)}"><meta data-rh="true" name="robots" content="${noindex ? "noindex,nofollow" : "index,follow"}"><link data-rh="true" rel="canonical" href="${SITE_ORIGIN + path}">${alternates}<meta data-rh="true" property="og:title" content="${escape(title)}"><meta data-rh="true" property="og:description" content="${escape(description)}"><meta data-rh="true" property="og:url" content="${SITE_ORIGIN + path}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}"><meta name="twitter:description" content="${escape(description)}">${locale || path === "/" ? `<script data-rh="true" type="application/ld+json">${JSON.stringify(villaStructuredData(locale ?? "it"))}</script>` : ""}`;
  return { head: topic ? head.replace(JSON.stringify(villaStructuredData("en")), JSON.stringify({ ...villaStructuredData("en"), url: SITE_ORIGIN + path, description })) : head, body, lang: locale ?? "it" };
}