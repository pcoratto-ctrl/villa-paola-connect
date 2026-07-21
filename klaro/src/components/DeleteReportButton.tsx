"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteReportButton({
  reportId,
  periodo,
  clientName,
  redirectTo,
  compact = false,
}: {
  reportId: string;
  periodo: string;
  clientName: string;
  // Se presente, dopo l'eliminazione si naviga qui (usato nella pagina del
  // singolo report). Se assente, si aggiorna solo la lista (storico cliente).
  redirectTo?: string;
  // Versione compatta (testo più piccolo), per righe di elenco strette.
  compact?: boolean;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleDelete() {
    if (
      !window.confirm(
        `Eliminare il report di ${periodo} per ${clientName}? Verrà cancellato solo questo report. L'operazione non è reversibile.`
      )
    )
      return;
    setDeleting(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.from("reports").delete().eq("id", reportId);
    setDeleting(false);
    if (err) {
      setError(`Eliminazione non riuscita: ${err.message}. Riprova.`);
      return;
    }
    setDone(true);
    setTimeout(() => {
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    }, 500);
  }

  const textSize = compact ? "text-xs" : "text-sm";

  if (done) {
    return <p className={`${textSize} font-medium text-emerald-600`}>Report eliminato.</p>;
  }

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className={`${textSize} font-semibold text-red-500 hover:text-red-700 disabled:opacity-50`}
      >
        {deleting ? "Eliminazione…" : "Elimina report"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
