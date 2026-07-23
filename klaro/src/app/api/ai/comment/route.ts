import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { meseLabel } from "@/lib/types";
import { SEZIONI_COMMENTO } from "@/lib/commento";
import { formatNumber } from "@/lib/utils";
import { isBetaAllowed, BETA_NOT_AUTHORIZED_MESSAGE } from "@/lib/betaAccess";
import { logAiCall } from "@/lib/aiLogger";
import { TESTO_LIBERO_MAX, TITOLO_CONTENUTO_MAX } from "@/lib/textLimits";

export const maxDuration = 60;

const SEPARATORE_OBIETTIVI = "===VALUTAZIONE OBIETTIVI===";

// Fallback dimostrativo locale: attivo in sviluppo, oppure altrove solo se
// esplicitamente abilitato. Non genera testo con un'AI, serve solo a non
// bloccare il flusso quando ANTHROPIC_API_KEY manca o non è valida.
const AI_DEMO_FALLBACK_ENABLED =
  process.env.NODE_ENV === "development" || process.env.ENABLE_AI_DEMO_FALLBACK === "true";

// Limiti di lunghezza dei campi testo liberi (condivisi con l'UI via
// src/lib/textLimits.ts): proteggono costo/affidabilità della chiamata AI e
// sono applicati qui lato server, quindi non aggirabili modificando l'HTML.
const topPostSchema = z.object({
  testo: z.string().max(TITOLO_CONTENUTO_MAX),
  metrica: z.string().max(TITOLO_CONTENUTO_MAX),
});

const datiSchema = z.object({
  reach: z.number().nonnegative(),
  impression: z.number().nonnegative(),
  follower_inizio: z.number().nonnegative(),
  follower_fine: z.number().nonnegative(),
  engagement_rate: z.number().min(0).max(100),
  numero_post: z.number().nonnegative(),
  top_post: z.array(topPostSchema).max(3),
  risultati_note: z.string().max(TESTO_LIBERO_MAX),
  visite_profilo: z.number().nonnegative().optional(),
  click_link: z.number().nonnegative().optional(),
});

const contestoSchema = z.object({
  cosa_fatto: z.string().max(TESTO_LIBERO_MAX).optional(),
  andato_bene: z.string().max(TESTO_LIBERO_MAX).optional(),
  non_funzionato: z.string().max(TESTO_LIBERO_MAX).optional(),
  priorita_prossimo: z.string().max(TESTO_LIBERO_MAX).optional(),
});

const bodySchema = z.object({
  clientId: z.string().uuid(),
  canale: z.enum(["instagram", "tiktok", "linkedin"]),
  mese: z.number().int().min(1).max(12),
  anno: z.number().int().min(2020).max(2100),
  dati: datiSchema,
  contesto: contestoSchema.nullable().optional(),
  prev: datiSchema.nullable(),
});

function datiToText(d: z.infer<typeof datiSchema>): string {
  const lines = [
    `- Reach (persone raggiunte): ${d.reach}`,
    `- Impression (visualizzazioni): ${d.impression}`,
    `- Follower a inizio mese: ${d.follower_inizio}`,
    `- Follower a fine mese: ${d.follower_fine}`,
    `- Engagement rate: ${d.engagement_rate}%`,
    `- Post pubblicati: ${d.numero_post}`,
  ];
  if (d.visite_profilo !== undefined) lines.push(`- Visite al profilo: ${d.visite_profilo}`);
  if (d.click_link !== undefined) lines.push(`- Click al link: ${d.click_link}`);
  if (d.top_post.length > 0) {
    lines.push(
      `- Contenuti migliori: ${d.top_post.map((p) => `"${p.testo}" (${p.metrica})`).join("; ")}`
    );
  }
  if (d.risultati_note) lines.push(`- Note del social media manager: ${d.risultati_note}`);
  return lines.join("\n");
}

// Testo dimostrativo locale, costruito dai numeri inseriti dall'utente. Va
// dichiarato esplicitamente come bozza automatica non generata da un'AI.
function buildDemoComment(params: {
  periodo: string;
  dati: z.infer<typeof datiSchema>;
  contesto: z.infer<typeof contestoSchema> | null | undefined;
  prev: z.infer<typeof datiSchema> | null;
}): { commento: string; valutazione_obiettivi: string } {
  const { periodo, dati, contesto, prev } = params;
  const fmt = formatNumber;
  // formatNumber arrotonda all'intero (pensata per conteggi come reach o
  // follower): l'engagement rate e' un decimale, va preservato cosi' come
  // viene mostrato nel resto dell'app (virgola italiana, nessun arrotondamento).
  const fmtPct = (n: number) => n.toString().replace(".", ",");
  const topPost = dati.top_post[0]?.testo;
  const confrontoTesto = prev
    ? `rispetto al mese precedente (reach ${fmt(prev.reach)} -> ${fmt(dati.reach)}).`
    : "senza un mese precedente da confrontare.";

  const commento = [
    `${SEZIONI_COMMENTO[0]}`,
    `[Bozza automatica locale — testo non generato da un'AI, chiave ANTHROPIC_API_KEY non configurata] In ${periodo} il canale ha registrato ${fmt(dati.reach)} di reach e un engagement rate del ${fmtPct(dati.engagement_rate)}%. Rivedi e completa questo paragrafo prima di inviarlo al cliente.`,
    "",
    `${SEZIONI_COMMENTO[1]}`,
    contesto?.andato_bene?.trim()
      ? contesto.andato_bene.trim()
      : topPost
        ? `Il contenuto "${topPost}" è quello segnalato come più performante del mese.`
        : "Aggiungi qui cosa ha funzionato meglio questo mese.",
    "",
    `${SEZIONI_COMMENTO[2]}`,
    contesto?.non_funzionato?.trim()
      ? contesto.non_funzionato.trim()
      : "Aggiungi qui cosa migliorare il prossimo mese.",
    "",
    `${SEZIONI_COMMENTO[3]}`,
    `Il canale ha raggiunto ${fmt(dati.reach)} persone con ${fmt(dati.impression)} impression e un engagement rate del ${fmtPct(dati.engagement_rate)}%, ${confrontoTesto}`,
    "",
    `${SEZIONI_COMMENTO[4]}`,
    contesto?.priorita_prossimo?.trim()
      ? contesto.priorita_prossimo.trim()
      : "Aggiungi qui 2-3 priorità concrete per il prossimo mese.",
  ].join("\n");

  const valutazione_obiettivi =
    "[Bozza automatica locale] I dati non sono stati valutati da un'AI: scrivi qui una valutazione prudente rispetto agli obiettivi del cliente, oppure indica che servono più dati per valutarli.";

  return { commento, valutazione_obiettivi };
}

function contestoToText(c: z.infer<typeof contestoSchema> | null | undefined): string {
  if (!c) return "";
  const parts: string[] = [];
  if (c.cosa_fatto) parts.push(`- Cosa è stato fatto questo mese: ${c.cosa_fatto}`);
  if (c.andato_bene) parts.push(`- Cosa è andato bene (secondo chi gestisce i social): ${c.andato_bene}`);
  if (c.non_funzionato) parts.push(`- Cosa non ha funzionato: ${c.non_funzionato}`);
  if (c.priorita_prossimo) parts.push(`- Priorità già individuate per il prossimo mese: ${c.priorita_prossimo}`);
  return parts.join("\n");
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sessione scaduta: accedi di nuovo e riprova." }, { status: 401 });
  }
  if (!isBetaAllowed(user.email)) {
    return NextResponse.json({ error: BETA_NOT_AUTHORIZED_MESSAGE }, { status: 403 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch (err) {
    const tooLong = err instanceof z.ZodError && err.issues.some((i) => i.code === "too_big");
    return NextResponse.json(
      {
        error: tooLong
          ? "Uno dei campi di testo è troppo lungo: accorcialo e riprova (i dati inseriti restano salvati sul tuo dispositivo)."
          : "Dati non validi.",
      },
      { status: 400 }
    );
  }

  // Verifica che il cliente appartenga all'utente (la RLS filtra già, ma diamo un errore chiaro)
  const { data: client } = await supabase
    .from("clients")
    .select("nome, obiettivi_testo")
    .eq("id", body.clientId)
    .single();
  if (!client) {
    return NextResponse.json({ error: "Cliente non trovato." }, { status: 404 });
  }

  const periodo = meseLabel(body.mese, body.anno);
  const canaleLabel =
    body.canale === "instagram" ? "Instagram" : body.canale === "tiktok" ? "TikTok" : "LinkedIn";

  const confrontoBlock = body.prev
    ? `DATI DEL MESE PRECEDENTE (per il confronto):
${datiToText(body.prev)}

Nella sezione "Lettura dei numeri principali" confronta i due mesi indicando le variazioni percentuali dei numeri principali (reach, impression, follower, engagement). Calcola le percentuali esclusivamente dai numeri forniti sopra e arrotondale a una cifra decimale.`
    : `NON è disponibile il mese precedente. REGOLA VINCOLANTE: non fare alcun confronto con altri mesi, non citare percentuali di crescita o calo, non ipotizzare trend. Nella sezione "Lettura dei numeri principali" dillo esplicitamente (questo report è la base di partenza, dal prossimo mese il confronto sarà automatico) e commenta solo i valori assoluti del mese.`;

  const obiettiviBlock = client.obiettivi_testo
    ? `OBIETTIVI DEL CLIENTE (dalla scheda cliente): ${client.obiettivi_testo}`
    : "OBIETTIVI DEL CLIENTE: non specificati.";

  const contestoText = contestoToText(body.contesto);
  const contestoBlock = contestoText
    ? `CONTESTO DEL MESE (scritto da chi gestisce i social — usalo come fonte principale per le sezioni qualitative):
${contestoText}`
    : `CONTESTO DEL MESE: non fornito. REGOLA VINCOLANTE: non inventare attività, iniziative o valutazioni qualitative non deducibili dai numeri e dalle note. Basati solo sui dati forniti.`;

  const titoli = SEZIONI_COMMENTO.map((t, i) => `${i + 1}. ${t}`).join("\n");

  const prompt = `Scrivi il commento per il report mensile social di un cliente. Il testo verrà inserito in un PDF che il social media manager consegnerà al cliente finale, quindi deve essere pronto da leggere senza ritocchi.

CLIENTE: ${client.nome}
CANALE: ${canaleLabel} (solo organico, nessuna sponsorizzata)
PERIODO: ${periodo}

${obiettiviBlock}

DATI DEL MESE:
${datiToText(body.dati)}

${contestoBlock}

${confrontoBlock}

STRUTTURA OBBLIGATORIA — il commento deve avere ESATTAMENTE queste 5 sezioni, in quest'ordine, ognuna introdotta dal suo titolo su una riga a sé (numerato, senza grassetti o markdown):
${titoli}

Contenuto delle sezioni:
1. Sintesi del mese: 3-4 frasi che un cliente non tecnico capisce al volo; il quadro generale del mese.
2. Cosa è andato bene: parti dai punti indicati nel contesto (se presenti) e dai contenuti migliori.
3. Cosa migliorare: onesto ma costruttivo; se il contesto indica cosa non ha funzionato, parti da lì.
4. Lettura dei numeri principali: reach, impression, follower, engagement spiegati in modo semplice${body.prev ? ", con i confronti percentuali sul mese precedente" : ", senza confronti con altri mesi"}.
5. Priorità consigliate per il prossimo mese: 2-3 priorità concrete e realizzabili, collegate agli obiettivi del cliente${body.contesto?.priorita_prossimo ? " e coerenti con le priorità già individuate nel contesto" : ""}.

REGOLE VINCOLANTI:
- NON inventare numeri, metriche, attività o risultati non forniti sopra. Se un'informazione manca, non c'è: scrivilo o ometti.
- Tono: consulente pratico che parla a un imprenditore; italiano naturale, frasi brevi, niente gergo tecnico non spiegato, niente inglesismi inutili, niente frasi vuote di riempimento, niente emoji, niente elenchi puntati (le priorità possono essere numerate nel testo: "1) … 2) …").
- Dai del "noi" al team che gestisce i social.
- Numeri formattati all'italiana (es. 24.900; percentuali con la virgola: 3,8%).
- Non aggiungere saluti, firme o altre sezioni oltre alle 5 richieste.

DOPO le 5 sezioni, aggiungi una riga contenente esattamente:
${SEPARATORE_OBIETTIVI}
e sotto scrivi 2-4 frasi di valutazione PRUDENTE dell'andamento rispetto agli obiettivi del cliente. Regole per questa parte: nessun numero o percentuale inventati; se gli obiettivi non sono specificati o i dati forniti non bastano per valutarli, scrivi esplicitamente che i dati disponibili non sono sufficienti per una valutazione e cosa servirebbe per misurarli. Questa parte comparirà nel PDF nella sezione "Obiettivi del cliente".`;

  function fallbackOrError(message: string, status: number) {
    if (AI_DEMO_FALLBACK_ENABLED) {
      return NextResponse.json(
        buildDemoComment({ periodo, dati: body.dati, contesto: body.contesto, prev: body.prev })
      );
    }
    return NextResponse.json({ error: message }, { status });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return fallbackOrError(
      "Chiave API Anthropic non configurata: imposta ANTHROPIC_API_KEY per generare il commento AI.",
      500
    );
  }

  const MODEL = "claude-sonnet-5";
  // maxRetries basso e timeout esplicito per attempt: la funzione serverless
  // (maxDuration sopra) ha un tetto di 60s su Vercel, e per l'SDK Anthropic
  // il timeout è per-tentativo (i retry si sommano) — con 1 retry e 25s a
  // tentativo il caso peggiore resta sotto i 60s, lasciando margine per la
  // nostra risposta. Non impostare retry più alti senza rivedere insieme i
  // due limiti.
  const anthropic = new Anthropic({ apiKey, maxRetries: 1, timeout: 25_000 });

  const startedAt = Date.now();
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });
    const durationMs = Date.now() - startedAt;

    if (response.stop_reason === "refusal") {
      logAiCall({ userId: user.id, success: false, model: MODEL, durationMs, errorCode: "refusal" });
      return NextResponse.json(
        { error: "L'AI non ha potuto generare il commento. Riprova o scrivilo a mano." },
        { status: 502 }
      );
    }

    const testo = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    if (!testo) {
      logAiCall({ userId: user.id, success: false, model: MODEL, durationMs, errorCode: "empty_response" });
      return NextResponse.json(
        { error: "Risposta vuota dall'AI. Riprova tra qualche istante." },
        { status: 502 }
      );
    }

    // Separa il commento (5 sezioni) dalla valutazione obiettivi
    const [commentoRaw, valutazioneRaw] = testo.split(SEPARATORE_OBIETTIVI);
    const commento = (commentoRaw ?? "").trim();
    const valutazione_obiettivi = (valutazioneRaw ?? "").trim();

    if (!commento) {
      logAiCall({ userId: user.id, success: false, model: MODEL, durationMs, errorCode: "unexpected_format" });
      return NextResponse.json(
        { error: "Risposta AI in un formato inatteso. Riprova." },
        { status: 502 }
      );
    }

    logAiCall({
      userId: user.id,
      success: true,
      model: MODEL,
      durationMs,
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens,
    });
    return NextResponse.json({ commento, valutazione_obiettivi });
  } catch (err) {
    const durationMs = Date.now() - startedAt;
    if (err instanceof Anthropic.RateLimitError) {
      logAiCall({ userId: user.id, success: false, model: MODEL, durationMs, errorCode: "rate_limit" });
      return NextResponse.json(
        { error: "Troppe richieste all'AI in questo momento. Attendi un minuto e riprova. I dati del report restano salvati." },
        { status: 429 }
      );
    }
    if (err instanceof Anthropic.APIConnectionTimeoutError) {
      logAiCall({ userId: user.id, success: false, model: MODEL, durationMs, errorCode: "timeout" });
      return NextResponse.json(
        { error: "La generazione ha impiegato troppo tempo. Riprova tra poco, oppure scrivi il commento a mano: i dati del report restano salvati." },
        { status: 504 }
      );
    }
    if (err instanceof Anthropic.PermissionDeniedError) {
      logAiCall({ userId: user.id, success: false, model: MODEL, durationMs, errorCode: "permission_denied" });
      return NextResponse.json(
        { error: "Il servizio AI non è al momento disponibile per l'account configurato (permessi o credito insufficiente). Contatta chi gestisce Klaro; i dati del report restano salvati." },
        { status: 502 }
      );
    }
    if (err instanceof Anthropic.AuthenticationError) {
      logAiCall({ userId: user.id, success: false, model: MODEL, durationMs, errorCode: "authentication" });
      return fallbackOrError("Chiave API Anthropic non valida: controlla ANTHROPIC_API_KEY.", 500);
    }
    if (err instanceof Anthropic.APIError) {
      logAiCall({ userId: user.id, success: false, model: MODEL, durationMs, errorCode: `api_error_${err.status}` });
      return NextResponse.json(
        { error: `Servizio AI temporaneamente non disponibile (${err.status}). Riprova tra poco; i dati del report restano salvati.` },
        { status: 502 }
      );
    }
    logAiCall({ userId: user.id, success: false, model: MODEL, durationMs, errorCode: "network_error" });
    return NextResponse.json(
      { error: "Errore di rete verso il servizio AI. Riprova; i dati del report restano salvati." },
      { status: 502 }
    );
  }
}
