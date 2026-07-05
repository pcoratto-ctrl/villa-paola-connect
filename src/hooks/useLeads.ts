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
      const { data, error } = await supabase
        .from("leads")
        .insert(lead)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
}
