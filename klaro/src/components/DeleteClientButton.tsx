"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteClientButton({
  clientId,
  clientName,
}: {
  clientId: string;
  clientName: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (
      !window.confirm(
        `Eliminare "${clientName}" e tutti i suoi report? L'operazione non è reversibile.`
      )
    )
      return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("clients").delete().eq("id", clientId);
    if (error) {
      alert(`Errore: ${error.message}`);
      setDeleting(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
    >
      {deleting ? "Eliminazione…" : "Elimina cliente"}
    </button>
  );
}
