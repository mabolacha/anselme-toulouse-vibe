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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      audio_content: {
        Row: {
          created_at: string
          description: string | null
          duration_seconds: number | null
          featured: boolean | null
          file_path: string
          file_size: number | null
          genre: string | null
          id: string
          mix_type: string | null
          play_count: number | null
          release_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          featured?: boolean | null
          file_path: string
          file_size?: number | null
          genre?: string | null
          id?: string
          mix_type?: string | null
          play_count?: number | null
          release_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          featured?: boolean | null
          file_path?: string
          file_size?: number | null
          genre?: string | null
          id?: string
          mix_type?: string | null
          play_count?: number | null
          release_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          budget_range: string | null
          created_at: string
          email: string
          event_date: string | null
          event_type: string
          guest_count: number | null
          id: string
          message: string | null
          name: string
          phone: string | null
          status: string | null
          updated_at: string
          venue: string | null
        }
        Insert: {
          budget_range?: string | null
          created_at?: string
          email: string
          event_date?: string | null
          event_type: string
          guest_count?: number | null
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          venue?: string | null
        }
        Update: {
          budget_range?: string | null
          created_at?: string
          email?: string
          event_date?: string | null
          event_type?: string
          guest_count?: number | null
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          location: string
          price: string
          status: string
          time: string
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          location: string
          price: string
          status?: string
          time: string
          title: string
          updated_at?: string
          venue: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          location?: string
          price?: string
          status?: string
          time?: string
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          created_at: string
          display_order: number
          event_date: string | null
          event_type: string | null
          featured: boolean
          id: string
          image_url: string
          location: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          event_date?: string | null
          event_type?: string | null
          featured?: boolean
          id?: string
          image_url: string
          location?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          event_date?: string | null
          event_type?: string | null
          featured?: boolean
          id?: string
          image_url?: string
          location?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mix_sessions: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number
          embed_url: string
          id: string
          is_active: boolean | null
          platform: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number
          embed_url: string
          id?: string
          is_active?: boolean | null
          platform: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number
          embed_url?: string
          id?: string
          is_active?: boolean | null
          platform?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          balance_amount: number | null
          base_package_with_equipment: number | null
          base_package_without_equipment: number | null
          budget_range: string | null
          created_at: string
          custom_playlist_included: boolean | null
          deposit_amount: number | null
          deposit_percentage: number | null
          dj_animation_included: boolean | null
          duration_hours: number | null
          email: string
          equipment_included: boolean | null
          event_date: string | null
          event_type: string
          extra_options: Json | null
          guest_count: number | null
          id: string
          message: string | null
          name: string
          payment_terms: string | null
          phone: string | null
          quote_amount: number | null
          quote_generated_at: string | null
          quote_notes: string | null
          quote_sent_at: string | null
          special_requests: string | null
          status: string | null
          technical_installation_included: boolean | null
          travel_fees: number | null
          updated_at: string
          venue: string | null
          venue_distance_km: number | null
        }
        Insert: {
          balance_amount?: number | null
          base_package_with_equipment?: number | null
          base_package_without_equipment?: number | null
          budget_range?: string | null
          created_at?: string
          custom_playlist_included?: boolean | null
          deposit_amount?: number | null
          deposit_percentage?: number | null
          dj_animation_included?: boolean | null
          duration_hours?: number | null
          email: string
          equipment_included?: boolean | null
          event_date?: string | null
          event_type: string
          extra_options?: Json | null
          guest_count?: number | null
          id?: string
          message?: string | null
          name: string
          payment_terms?: string | null
          phone?: string | null
          quote_amount?: number | null
          quote_generated_at?: string | null
          quote_notes?: string | null
          quote_sent_at?: string | null
          special_requests?: string | null
          status?: string | null
          technical_installation_included?: boolean | null
          travel_fees?: number | null
          updated_at?: string
          venue?: string | null
          venue_distance_km?: number | null
        }
        Update: {
          balance_amount?: number | null
          base_package_with_equipment?: number | null
          base_package_without_equipment?: number | null
          budget_range?: string | null
          created_at?: string
          custom_playlist_included?: boolean | null
          deposit_amount?: number | null
          deposit_percentage?: number | null
          dj_animation_included?: boolean | null
          duration_hours?: number | null
          email?: string
          equipment_included?: boolean | null
          event_date?: string | null
          event_type?: string
          extra_options?: Json | null
          guest_count?: number | null
          id?: string
          message?: string | null
          name?: string
          payment_terms?: string | null
          phone?: string | null
          quote_amount?: number | null
          quote_generated_at?: string | null
          quote_notes?: string | null
          quote_sent_at?: string | null
          special_requests?: string | null
          status?: string | null
          technical_installation_included?: boolean | null
          travel_fees?: number | null
          updated_at?: string
          venue?: string | null
          venue_distance_km?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      check_booking_rate_limit: { Args: { p_email: string }; Returns: boolean }
      check_quote_rate_limit: { Args: { p_email: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "user"],
    },
  },
} as const
