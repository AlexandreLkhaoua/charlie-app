/**
 * Supabase Database Types
 * ------------------------
 * Shared type definitions for the Supabase database schema.
 */

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          investing_experience: string | null;
          preferred_language: string | null;
          investment_horizon: string | null;
          risk_comfort: string | null;
          goals: string[] | null;
          answer_style: string | null;
          content_priority: string | null;
          avoid_jargon: boolean | null;
          onboarding_status: string | null;
          onboarding_completed_at: string | null;
          login_count: number | null;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          investing_experience?: string | null;
          preferred_language?: string | null;
          investment_horizon?: string | null;
          risk_comfort?: string | null;
          goals?: string[] | null;
          answer_style?: string | null;
          content_priority?: string | null;
          avoid_jargon?: boolean | null;
          onboarding_status?: string | null;
          onboarding_completed_at?: string | null;
          login_count?: number | null;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          investing_experience?: string | null;
          preferred_language?: string | null;
          investment_horizon?: string | null;
          risk_comfort?: string | null;
          goals?: string[] | null;
          answer_style?: string | null;
          content_priority?: string | null;
          avoid_jargon?: boolean | null;
          onboarding_status?: string | null;
          onboarding_completed_at?: string | null;
          login_count?: number | null;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      portfolios: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          is_default: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          is_default?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          is_default?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      positions: {
        Row: {
          id: string;
          portfolio_id: string;
          ticker: string;
          name: string;
          quantity: number;
          average_price: number;
          current_price: number;
          asset_class: string;
          currency: string;
          region: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          portfolio_id: string;
          ticker: string;
          name: string;
          quantity: number;
          average_price: number;
          current_price: number;
          asset_class: string;
          currency: string;
          region?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          portfolio_id?: string;
          ticker?: string;
          name?: string;
          quantity?: number;
          average_price?: number;
          current_price?: number;
          asset_class?: string;
          currency?: string;
          region?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      news_items: {
        Row: {
          id: string;
          provider: string;
          provider_id: string | null;
          url: string;
          title: string;
          summary: string | null;
          source: string | null;
          image_url: string | null;
          published_at: string;
          lang: string | null;
          tickers: string[];
          content_hash: string;
          created_at: string;
        };
        Insert: {
          provider: string;
          provider_id?: string | null;
          url: string;
          title: string;
          summary?: string | null;
          source?: string | null;
          image_url?: string | null;
          published_at: string;
          lang?: string | null;
          tickers: string[];
          content_hash: string;
          id?: string;
          created_at?: string;
        };
        Update: {
          provider?: string;
          provider_id?: string | null;
          url?: string;
          title?: string;
          summary?: string | null;
          source?: string | null;
          image_url?: string | null;
          published_at?: string;
          lang?: string | null;
          tickers?: string[];
          content_hash?: string;
          id?: string;
          created_at?: string;
        };
      };
      onboarding_responses: {
        Row: {
          id: string;
          user_id: string;
          version: string;
          answers: {
            goal?: string;
            horizon?: string;
            drawdown_reaction?: string;
          };
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          version?: string;
          answers: {
            goal?: string;
            horizon?: string;
            drawdown_reaction?: string;
          };
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          version?: string;
          answers?: {
            goal?: string;
            horizon?: string;
            drawdown_reaction?: string;
          };
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_latest_news: {
        Args: { p_limit?: number; p_offset?: number };
        Returns: Database['public']['Tables']['news_items']['Row'][];
      };
      get_portfolio_news: {
        Args: { p_tickers: string[]; p_limit?: number; p_offset?: number };
        Returns: Database['public']['Tables']['news_items']['Row'][];
      };
      upsert_news_item: {
        Args: {
          p_provider: string;
          p_provider_id: string | null;
          p_url: string;
          p_title: string;
          p_summary: string | null;
          p_source: string | null;
          p_image_url: string | null;
          p_published_at: string;
          p_lang: string | null;
          p_tickers: string[];
          p_content_hash: string;
        };
        Returns: string;
      };
      increment_login_count: {
        Args: { p_user_id: string };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
