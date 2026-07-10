import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Link href="/dashboard" className="text-xl font-extrabold tracking-tight text-brand-700">
            klaro
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link href="/dashboard" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Clienti
            </Link>
            <Link href="/settings" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              Impostazioni
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
    </div>
  );
}
