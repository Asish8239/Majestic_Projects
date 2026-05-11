// Database types for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          image: string | null;
          provider: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          image?: string | null;
          provider?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          image?: string | null;
          provider?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          domain: string;
          difficulty: string | null;
          purpose: string | null;
          output_type: string | null;
          project_json: Json;
          favorite: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          domain: string;
          difficulty?: string | null;
          purpose?: string | null;
          output_type?: string | null;
          project_json: Json;
          favorite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          domain?: string;
          difficulty?: string | null;
          purpose?: string | null;
          output_type?: string | null;
          project_json?: Json;
          favorite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Project JSON structure (matches existing types)
export interface ProjectJSON {
  title: string;
  domain: string;
  problem_statement: string;
  solution: string;
  tech_stack: string[];
  abstract: {
    background: string;
    objective: string;
    methodology: string;
    results: string;
    conclusion: string;
  };
}

// Extended project type with database fields
export interface DBProject {
  id: string;
  user_id: string;
  title: string;
  domain: string;
  difficulty: string | null;
  purpose: string | null;
  output_type: string | null;
  project_json: ProjectJSON;
  favorite: boolean;
  created_at: string;
  updated_at: string;
}

// User type
export interface DBUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  provider: string | null;
  created_at: string;
  updated_at: string;
}
