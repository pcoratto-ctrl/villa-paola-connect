import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ReportView from "@/components/ReportView";
import { prevMonth } from "@/lib/utils";
import type { Client, Report } from "@/lib/types";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: report } = await supabase
    .from("reports")
    .select("*, clients(*)")
    .eq("id", id)
    .single();

  if (!report) notFound();

  const r = report as Report & { clients: Client };
  const p = prevMonth(r.mese, r.anno);

  const { data: prev } = await supabase
    .from("reports")
    .select("*")
    .eq("client_id", r.client_id)
    .eq("canale", r.canale)
    .eq("mese", p.mese)
    .eq("anno", p.anno)
    .maybeSingle();

  return <ReportView report={r} client={r.clients} prev={(prev as Report) ?? null} />;
}
