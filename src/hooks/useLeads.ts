import { isLeadAcknowledgement } from "@/lib/leadAcknowledgement";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LeadInput {
  guest_name: string;
  email: string;
  phone?: string;
  arrival_date?: string;
  departure_date?: string;
  guests_count?: number;
  message?: string;
}

export function useSubmitLead() {
  return useMutation({
    mutationFn: async (lead: LeadInput) => {
      const { data, error } = await supabase.functions.invoke("notify-lead", {
        body: lead,
      });
      if (error) throw error;
      if (!isLeadAcknowledgement(data)) throw new Error("Lead was not acknowledged by the server");
      return data;
    },
  });
}
