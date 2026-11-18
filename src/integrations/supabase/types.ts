export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      click_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          page: string
          source: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          page?: string
          source?: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          page?: string
          source?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          arrival_date: string | null
          created_at: string
          departure_date: string | null
          email: string
          guest_name: string
          guests_count: number | null
          id: string
          message: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          arrival_date?: string | null
          created_at?: string
          departure_date?: string | null
          email: string
          guest_name: string
          guests_count?: number | null
          id?: string
          message?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          arrival_date?: string | null
          created_at?: string
          departure_date?: string | null
          email?: string
          guest_name?: string
          guests_count?: number | null
          id?: string
          message?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      partner_access_log: {
        Row: {
          created_at: string
          id: string
          ip_prefix: string | null
          kind: string
          operator_id: string | null
          outcome: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_prefix?: string | null
          kind: string
          operator_id?: string | null
          outcome: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_prefix?: string | null
          kind?: string
          operator_id?: string | null
          outcome?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_access_log_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "partner_operators"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_feed_tokens: {
        Row: {
          allowed_origins: string[]
          created_at: string
          id: string
          kind: string
          operator_id: string
          revoked_at: string | null
          token_hash: string
        }
        Insert: {
          allowed_origins?: string[]
          created_at?: string
          id?: string
          kind: string
          operator_id: string
          revoked_at?: string | null
          token_hash: string
        }
        Update: {
          allowed_origins?: string[]
          created_at?: string
          id?: string
          kind?: string
          operator_id?: string
          revoked_at?: string | null
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_feed_tokens_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "partner_operators"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_operators: {
        Row: {
          company: string
          contact_name: string | null
          created_at: string
          email: string
          id: string
          last_access_at: string | null
          notes: string | null
          phone: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company: string
          contact_name?: string | null
          created_at?: string
          email: string
          id?: string
          last_access_at?: string | null
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string
          contact_name?: string | null
          created_at?: string
          email?: string
          id?: string
          last_access_at?: string | null
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          guest_name: string
          id: string
          rating: number
          status: Database["public"]["Enums"]["review_status"]
          stay_date: string | null
          updated_at: string
        }
        Insert: {
          comment: string
          created_at?: string
          guest_name: string
          id?: string
          rating: number
          status?: Database["public"]["Enums"]["review_status"]
          stay_date?: string | null
          updated_at?: string
        }
        Update: {
          comment?: string
          created_at?: string
          guest_name?: string
          id?: string
          rating?: number
          status?: Database["public"]["Enums"]["review_status"]
          stay_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "partner"
      review_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user", "partner"],
      review_status: ["pending", "approved", "rejected"],
    },
  },
} as const
