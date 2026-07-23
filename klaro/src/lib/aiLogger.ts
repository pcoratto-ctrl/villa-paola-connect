// Logging server-side delle chiamate AI: SOLO metadati non sensibili.
// Non passare MAI qui prompt, contesto, obiettivi, nome cliente o il testo
// del commento generato — solo i campi elencati in AiCallLog. Su Vercel
// questi log sono visibili in Project -> Logs (Runtime Logs), filtrabili per
// funzione/route; ogni riga è un JSON compatto per poterla cercare/filtrare.

// Stima approssimativa, da aggiornare secondo il listino prezzi Anthropic in
// vigore: prezzo per milione di token, separato per input/output. Non è una
// fonte di verità per la fatturazione, serve solo a monitorare l'ordine di
// grandezza della spesa durante la beta.
const PREZZI_STIMATI_USD_PER_MILIONE: Record<string, { input: number; output: number }> = {
  "claude-sonnet-5": { input: 3, output: 15 },
};

function stimaCostoUsd(model: string, inputTokens?: number, outputTokens?: number): number | null {
  if (inputTokens === undefined || outputTokens === undefined) return null;
  const prezzi = PREZZI_STIMATI_USD_PER_MILIONE[model];
  if (!prezzi) return null;
  return (inputTokens / 1_000_000) * prezzi.input + (outputTokens / 1_000_000) * prezzi.output;
}

export type AiCallLog = {
  userId: string;
  success: boolean;
  model: string;
  durationMs: number;
  inputTokens?: number;
  outputTokens?: number;
  errorCode?: string;
};

export function logAiCall(entry: AiCallLog): void {
  const costoStimatoUsd = stimaCostoUsd(entry.model, entry.inputTokens, entry.outputTokens);
  console.log(
    JSON.stringify({
      tag: "ai_comment_call",
      timestamp: new Date().toISOString(),
      userId: entry.userId,
      success: entry.success,
      model: entry.model,
      durationMs: entry.durationMs,
      inputTokens: entry.inputTokens ?? null,
      outputTokens: entry.outputTokens ?? null,
      costoStimatoUsd: costoStimatoUsd === null ? null : Number(costoStimatoUsd.toFixed(5)),
      errorCode: entry.errorCode ?? null,
    })
  );
}
