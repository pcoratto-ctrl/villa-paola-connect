import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";

const PartnerLogin = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) setError("Credenziali non valide o accesso sospeso");
    else navigate("/calendario");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Helmet><title>Area operatori · Villa Paola Caposuvero</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="w-full max-w-sm">
        <p className="eyebrow mb-3 text-center">Area riservata</p>
        <h1 className="font-display text-3xl text-center mb-2">Operatori autorizzati</h1>
        <p className="text-muted-foreground text-sm text-center mb-8">Accedi con le credenziali ricevute da Villa Paola.</p>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm">
            Email
            <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="mt-1 w-full px-4 py-3 rounded-villa border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring" />
          </label>
          <label className="block text-sm">
            Password
            <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="mt-1 w-full px-4 py-3 rounded-villa border border-border bg-card focus:outline-none focus:ring-2 focus:ring-ring" />
          </label>
          {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 rounded-villa bg-primary text-primary-foreground font-medium disabled:opacity-50">
            {loading ? "Accesso…" : "Accedi"}
          </button>
        </form>
        <p className="text-center mt-6"><a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Torna al sito</a></p>
      </div>
    </div>
  );
};
export default PartnerLogin;
