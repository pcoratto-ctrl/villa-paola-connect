import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import ReportWizard from "@/components/ReportWizard";
import type { Client } from "@/lib/types";
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

  return (
    <Suspense>
      <ReportWizard clients={list} />
    </Suspense>
  );
}
