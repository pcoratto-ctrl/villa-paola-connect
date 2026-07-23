import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import ReportWizard from "@/components/ReportWizard";
import type { Client } from "@/lib/types";
import { isDemoClientName } from "@/lib/demoContent";
import { BETA_REPORT_LIMIT } from "@/lib/plans";
import Link from "next/link";

export default async function NewReportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: true });

  const list = (clients ?? []) as Client[];

  if (list.length === 0) {
    return (
      <div className="card mx-auto max-w-xl text-center">
        <p className="text-slate-600">Prima di creare un report ti serve almeno un cliente.</p>
        <Link href="/clients/new" className="btn-primary mt-4">
          + Crea un cliente
        </Link>
      </div>
    );
  }

  // Messaggio d'uso preventivo, non l'enforcement vero: il limite reale e
  // non aggirabile vive nel trigger SQL su public.reports (bypassabile
  // solo questo avviso, non il salvataggio). Il cliente demo non conta,
  // come da requisito beta.
  const idClientiReali = list.filter((c) => !isDemoClientName(c.nome)).map((c) => c.id);
  let numeroReportBeta = 0;
  if (idClientiReali.length > 0) {
    const { count } = await supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .in("client_id", idClientiReali);
    numeroReportBeta = count ?? 0;
  }

  if (numeroReportBeta >= BETA_REPORT_LIMIT) {
    return (
      <div className="card mx-auto max-w-xl text-center">
        <p className="text-slate-600">
          Hai raggiunto il limite di {BETA_REPORT_LIMIT} report della beta privata (il cliente
          demo non viene conteggiato). Scrivi al team Klaro se ti serve continuare a testare
          l&apos;app.
        </p>
      </div>
    );
  }

  return (
    <Suspense>
      <ReportWizard clients={list} />
    </Suspense>
  );
}
