import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Gestisce il link di conferma email (e di recupero password) di Supabase.
// Non mostra mai query param tecnici o errori Supabase grezzi all'utente:
// in caso di problema rimanda a /link-non-valido con un motivo leggibile.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const errorCode = searchParams.get("error_code");
  const next = searchParams.get("next"); // usato dal recupero password

  if (errorCode) {
    const motivo = errorCode === "otp_expired" ? "scaduto" : "non-valido";
    return NextResponse.redirect(`${origin}/link-non-valido?motivo=${motivo}`);
  }

  if (!code) {
    // Nessun codice e nessun errore esplicito: link manomesso o incompleto.
    return NextResponse.redirect(`${origin}/link-non-valido?motivo=non-valido`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // Il caso più comune qui è un link già usato in precedenza (i codici
    // sono monouso) o scaduto senza un error_code esplicito nell'URL.
    return NextResponse.redirect(`${origin}/link-non-valido?motivo=usato`);
  }

  // Link di recupero password: prosegue verso la pagina di nuova password,
  // non verso dashboard/benvenuto (sessione temporanea, non un vero accesso).
  if (next) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Conferma riuscita: prima volta -> /benvenuto, altrimenti dashboard.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed_at")
      .eq("id", user.id)
      .single();
    if (profile && !profile.onboarding_completed_at) {
      return NextResponse.redirect(`${origin}/benvenuto`);
    }
  }
  return NextResponse.redirect(`${origin}/dashboard`);
}
