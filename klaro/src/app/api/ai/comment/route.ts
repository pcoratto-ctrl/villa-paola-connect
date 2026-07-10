import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { meseLabel } from "@/lib/types";

export const maxDuration = 60;

const topPostSchema = z.object({ testo: z.string(), metrica: z.string() });

const datiSchema = z.object({
  reach: z.number().nonnegative(),
  impression: z.number().nonnegative(),
  follower_inizio: z.number().nonnegative(),
  follower_fine: z.number().nonnegative(),
  engagement_rate: z.number().min(0).max(100),
  numero_post: z.number().nonnegative(),
  top_post: z.array(topPostSchema).max(3),
  risultati_note: z.string(),
});

const bodySchema = z.object({
  clientId: z.string().uuid(),
  canale: z.enum(["instagram", "tiktok", "linkedin"]),
  mese: z.number().int().min(1).max(12),
  anno: z.number().int().min(2020).max(2100),
  dati: datiSchema,
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
  if (d.top_post.length > 0) {
    lines.push(
      `- Contenuti migliori: ${d.top_post.map((p) => `"${p.testo}" (${p.metrica})`).join("; ")}`
    );
  }
  if (d.risultati_note) lines.push(`- Note del social media manager: ${d.risultati_note}`);
  return lines.join("\n");
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autenticato." }, { status: 401 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Dati non validi." }, { status: 400 });
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
    ? `DATI DEL MESE PRECEDENTE (per il confronto):\n${datiToText(body.prev)}\n\nConfronta i due mesi indicando le variazioni percentuali dei numeri principali (reach, impression, follower, engagement). Calcola tu le percentuali dai numeri forniti e arrotondale a una cifra decimale.`
    : `NON è disponibile il mese precedente: non fare confronti con altri mesi e non inventare dati storici. Segnala con naturalezza che questo report costituisce la base di partenza e che dal prossimo mese il confronto sarà automatico.`;

  const obiettiviBlock = client.obiettivi_testo
    ? `OBIETTIVI DEL CLIENTE: ${client.obiettivi_testo}`
    : "OBIETTIVI DEL CLIENTE: non specificati.";

  const prompt = `Scrivi il commento per il report mensile social di un cliente. Il testo verrà inserito in un PDF che il social media manager consegnerà al cliente finale.

CLIENTE: ${client.nome}
CANALE: ${canaleLabel} (solo organico, nessuna sponsorizzata)
PERIODO: ${periodo}

${obiettiviBlock}

DATI DEL MESE:
${datiToText(body.dati)}

${confrontoBlock}

ISTRUZIONI DI SCRITTURA:
- Scrivi in italiano, 3-5 paragrafi separati da riga vuota.
- Struttura: cosa è andato bene; cosa è cambiato rispetto al mese scorso (con percentuali, solo se disponibile); chiudi con 2-3 raccomandazioni concrete per il mese successivo, collegate agli obiettivi del cliente.
- Tono da consulente: professionale, chiaro, costruttivo. Dai del "noi" al team che gestisce i social.
- Niente gergo tecnico non spiegato, niente inglesismi inutili, niente emoji, niente elenchi puntati: solo paragrafi di prosa (le raccomandazioni possono essere numerate nel testo, es. "1) ... 2) ...").
- Usa i numeri reali forniti, formattati all'italiana (es. 24.900). Non inventare dati.
- Non aggiungere titoli, saluti o firme: solo il corpo del commento.`;

  const anthropic = new Anthropic({ maxRetries: 3 });

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json(
        { error: "L'AI non ha potuto generare il commento. Riprova o scrivilo a mano." },
        { status: 502 }
      );
    }

    const commento = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    if (!commento) {
      return NextResponse.json(
        { error: "Risposta vuota dall'AI. Riprova." },
        { status: 502 }
      );
    }

    return NextResponse.json({ commento });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Troppe richieste all'AI in questo momento. Attendi un minuto e riprova." },
        { status: 429 }
      );
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "Chiave API Anthropic non valida: controlla ANTHROPIC_API_KEY." },
        { status: 500 }
      );
    }
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Servizio AI temporaneamente non disponibile (${err.status}). Riprova tra poco.` },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: "Errore di rete verso il servizio AI. Riprova." },
      { status: 502 }
    );
  }
}
