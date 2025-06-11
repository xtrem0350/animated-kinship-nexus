export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      family_media: {
        Row: {
          created_at: string | null
          date_taken: string | null
          description: string | null
          family_member_id: string | null
          id: string
          location: string | null
          media_type: string
          media_url: string
          title: string | null
          uploaded_by: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          date_taken?: string | null
          description?: string | null
          family_member_id?: string | null
          id?: string
          location?: string | null
          media_type: string
          media_url: string
          title?: string | null
          uploaded_by?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          date_taken?: string | null
          description?: string | null
          family_member_id?: string | null
          id?: string
          location?: string | null
          media_type?: string
          media_url?: string
          title?: string | null
          uploaded_by?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "family_media_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          added_by: string | null
          bio: string | null
          birth_date: string | null
          birth_place: string | null
          created_at: string | null
          current_location: string | null
          death_date: string | null
          email: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          occupation: string | null
          phone_number: string | null
          profile_image_url: string | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          added_by?: string | null
          bio?: string | null
          birth_date?: string | null
          birth_place?: string | null
          created_at?: string | null
          current_location?: string | null
          death_date?: string | null
          email?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          occupation?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          added_by?: string | null
          bio?: string | null
          birth_date?: string | null
          birth_place?: string | null
          created_at?: string | null
          current_location?: string | null
          death_date?: string | null
          email?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          occupation?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      family_relationships: {
        Row: {
          added_by: string | null
          created_at: string | null
          id: string
          person_id: string | null
          related_person_id: string | null
          relationship_type: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string | null
          id?: string
          person_id?: string | null
          related_person_id?: string | null
          relationship_type: string
        }
        Update: {
          added_by?: string | null
          created_at?: string | null
          id?: string
          person_id?: string | null
          related_person_id?: string | null
          relationship_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_relationships_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_relationships_related_person_id_fkey"
            columns: ["related_person_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      family_requests: {
        Row: {
          created_at: string | null
          id: string
          request_data: Json
          request_type: string
          requester_id: string | null
          review_comment: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          target_member_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          request_data: Json
          request_type: string
          requester_id?: string | null
          review_comment?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          target_member_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          request_data?: Json
          request_type?: string
          requester_id?: string | null
          review_comment?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          target_member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_requests_target_member_id_fkey"
            columns: ["target_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          can_add_members: boolean | null
          can_verify_data: boolean | null
          created_at: string | null
          display_name: string | null
          family_member_id: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          can_add_members?: boolean | null
          can_verify_data?: boolean | null
          created_at?: string | null
          display_name?: string | null
          family_member_id?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          can_add_members?: boolean | null
          can_verify_data?: boolean | null
          created_at?: string | null
          display_name?: string | null
          family_member_id?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
