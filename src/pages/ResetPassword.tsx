import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/** Public page reached from the password-reset email: sets a new password for the recovery session. */
const ResetPassword = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && window.location.hash.includes("type=recovery"))) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && window.location.hash.includes("type=recovery")) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 10) return setError("La password deve avere almeno 10 caratteri.");
    if (password !== confirm) return setError("Le due password non coincidono.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setError("Impossibile aggiornare la password. Richiedi un nuovo link.");
    await supabase.auth.signOut();
    setDone(true);
  };

  const input = "w-full pl-10 pr-4 py-3 rounded-[4px] border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Helmet><title>Imposta password · Villa Paola</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Lock className="w-10 h-10 text-primary mx-auto mb-4" strokeWidth={1.5} />
          <h1 className="font-display text-3xl text-foreground">Imposta la password</h1>
        </div>
        {done ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground text-sm">Password aggiornata. Ora puoi accedere.</p>
            <button onClick={() => navigate("/admin/login")} className="w-full py-3 rounded-[4px] bg-primary text-primary-foreground font-medium">Vai all'accesso</button>
          </div>
        ) : !ready ? (
          <p className="text-muted-foreground text-sm text-center">Link non valido o scaduto. Richiedi un nuovo link dalla pagina di accesso.</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} placeholder="Nuova password" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={input} placeholder="Ripeti password" required />
            </div>
            {error && <p className="text-destructive text-sm text-center">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 rounded-[4px] bg-primary text-primary-foreground font-medium disabled:opacity-50">
              {loading ? "Salvataggio..." : "Salva password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
