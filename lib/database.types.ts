export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      procurement_requests: {
        Row: {
          id: string;
          item_name: string;
          quantity: number;
          urgency: string;
          status: string;
          requester_id: string;
          organization_name: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          item_name: string;
          quantity: number;
          urgency: string;
          status?: string;
          requester_id: string;
          organization_name: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          item_name?: string;
          quantity?: number;
          urgency?: string;
          status?: string;
          requester_id?: string;
          organization_name?: string;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          role: Database["public"]["Enums"]["app_role"] | null;
          hospital_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          role?: Database["public"]["Enums"]["app_role"] | null;
          hospital_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          role?: Database["public"]["Enums"]["app_role"] | null;
          hospital_name?: string | null;
          created_at?: string;
        };
      };
    };
    Enums: {
      app_role:
        | "cpo"
        | "sourcing_director"
        | "ops_director"
        | "contract_specialist"
        | "category_manager"
        | "procurement_analyst"
        | "vendor";
    };
  };
};
