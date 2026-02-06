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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      news_items: {
        Row: {
          content_hash: string
          created_at: string
          id: string
          image_url: string | null
          lang: string | null
          provider: string
          provider_id: string | null
          published_at: string
          source: string | null
          summary: string | null
          tickers: string[]
          title: string
          url: string
        }
        Insert: {
          content_hash: string
          created_at?: string
          id?: string
          image_url?: string | null
          lang?: string | null
          provider: string
          provider_id?: string | null
          published_at: string
          source?: string | null
          summary?: string | null
          tickers?: string[]
          title: string
          url: string
        }
        Update: {
          content_hash?: string
          created_at?: string
          id?: string
          image_url?: string | null
          lang?: string | null
          provider?: string
          provider_id?: string | null
          published_at?: string
          source?: string | null
          summary?: string | null
          tickers?: string[]
          title?: string
          url?: string
        }
        Relationships: []
      }
      onboarding_responses: {
        Row: {
          answers: Json
          created_at: string
          id: string
          user_id: string
          version: string
        }
        Insert: {
          answers: Json
          created_at?: string
          id?: string
          user_id: string
          version?: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          asset_class: string
          average_price: number
          created_at: string
          currency: string
          current_price: number
          id: string
          name: string
          portfolio_id: string
          quantity: number
          region: string | null
          ticker: string
          updated_at: string
        }
        Insert: {
          asset_class: string
          average_price: number
          created_at?: string
          currency?: string
          current_price: number
          id?: string
          name: string
          portfolio_id: string
          quantity: number
          region?: string | null
          ticker: string
          updated_at?: string
        }
        Update: {
          asset_class?: string
          average_price?: number
          created_at?: string
          currency?: string
          current_price?: number
          id?: string
          name?: string
          portfolio_id?: string
          quantity?: number
          region?: string | null
          ticker?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          answer_style: string | null
          avoid_jargon: boolean | null
          content_priority: string | null
          created_at: string
          display_name: string | null
          email: string | null
          goals: string[] | null
          id: string
          investing_experience: string | null
          investment_horizon: string | null
          last_login_at: string | null
          login_count: number | null
          onboarding_completed_at: string | null
          onboarding_status: string | null
          preferred_language: string | null
          risk_comfort: string | null
          updated_at: string
        }
        Insert: {
          answer_style?: string | null
          avoid_jargon?: boolean | null
          content_priority?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          goals?: string[] | null
          id: string
          investing_experience?: string | null
          investment_horizon?: string | null
          last_login_at?: string | null
          login_count?: number | null
          onboarding_completed_at?: string | null
          onboarding_status?: string | null
          preferred_language?: string | null
          risk_comfort?: string | null
          updated_at?: string
        }
        Update: {
          answer_style?: string | null
          avoid_jargon?: boolean | null
          content_priority?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          goals?: string[] | null
          id?: string
          investing_experience?: string | null
          investment_horizon?: string | null
          last_login_at?: string | null
          login_count?: number | null
          onboarding_completed_at?: string | null
          onboarding_status?: string | null
          preferred_language?: string | null
          risk_comfort?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_latest_news: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: {
          content_hash: string
          created_at: string
          id: string
          image_url: string | null
          lang: string | null
          provider: string
          provider_id: string | null
          published_at: string
          source: string | null
          summary: string | null
          tickers: string[]
          title: string
          url: string
        }[]
        SetofOptions: {
          from: "*"
          to: "news_items"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_portfolio_news: {
        Args: { p_limit?: number; p_offset?: number; p_tickers: string[] }
        Returns: {
          content_hash: string
          created_at: string
          id: string
          image_url: string | null
          lang: string | null
          provider: string
          provider_id: string | null
          published_at: string
          source: string | null
          summary: string | null
          tickers: string[]
          title: string
          url: string
        }[]
        SetofOptions: {
          from: "*"
          to: "news_items"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      increment_login_count: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      upsert_news_item: {
        Args: {
          p_content_hash: string
          p_image_url: string
          p_lang: string
          p_provider: string
          p_provider_id: string
          p_published_at: string
          p_source: string
          p_summary: string
          p_tickers: string[]
          p_title: string
          p_url: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
