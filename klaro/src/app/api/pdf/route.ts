import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderReportPdf } from "@/lib/pdf/ReportPdf";
import { isWhiteLabel } from "@/lib/plans";
import { prevMonth } from "@/lib/utils";
import { meseLabel } from "@/lib/types";
import type { Client, Report } from "@/lib/types";

export const maxDuration = 60;

// Scarica il logo e lo converte in data URI, così @react-pdf non deve fare fetch a runtime.
// Se il download fallisce il PDF viene generato senza logo (mai bloccare per il logo).
async function fetchLogoAsDataUri(url: string | null): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "image/png";
    if (!/image\/(png|jpe?g|webp)/.test(contentType)) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${contentType};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autenticato" }, { status: 401 });
  }

  const reportId = new URL(request.url).searchParams.get("report");
  if (!reportId) {
    return NextResponse.json({ error: "Parametro report mancante" }, { status: 400 });
  }

  const { data: report } = await supabase
    .from("reports")
    .select("*, clients(*)")
    .eq("id", reportId)
    .single();

  if (!report) {
    return NextResponse.json({ error: "Report non trovato" }, { status: 404 });
  }

  const r = report as Report & { clients: Client };
  const p = prevMonth(r.mese, r.anno);

  const [{ data: prev }, { data: profile }] = await Promise.all([
    supabase
      .from("reports")
      .select("dati_json, mese, anno")
      .eq("client_id", r.client_id)
      .eq("canale", r.canale)
      .eq("mese", p.mese)
      .eq("anno", p.anno)
      .maybeSingle(),
    supabase.from("profiles").select("piano").eq("id", user.id).single(),
  ]);

  try {
    const logoDataUri = await fetchLogoAsDataUri(r.clients.logo_url);

    const pdf = await renderReportPdf({
      report: r,
      client: r.clients,
      prev: prev?.dati_json ?? null,
      prevLabel: prev ? meseLabel(prev.mese, prev.anno) : null,
      logoDataUri,
      whiteLabel: isWhiteLabel(profile?.piano ?? "free"),
    });

    const filename = `report-${r.clients.nome.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${r.anno}-${String(r.mese).padStart(2, "0")}.pdf`;

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Errore generazione PDF:", err);
    return NextResponse.json(
      { error: "Generazione PDF non riuscita. Usa l'anteprima HTML come alternativa." },
      { status: 500 }
    );
  }
}
