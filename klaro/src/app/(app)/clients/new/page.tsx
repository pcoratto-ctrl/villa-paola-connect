import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolvePlan } from "@/lib/plans";
import ClientForm from "@/components/ClientForm";

export default async function NewClientPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from("profiles").select("piano, created_at").eq("id", user!.id).single(),
    supabase.from("clients").select("id", { count: "exact", head: true }).eq("user_id", user!.id),
  ]);

  const plan = resolvePlan(profile?.piano, profile?.created_at);
  if ((count ?? 0) >= plan.maxClients) {
    redirect("/settings?limit=1");
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900">
        ← Torna ai clienti
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-bold text-slate-900">Nuovo cliente</h1>
      <ClientForm />
    </div>
  );
}
