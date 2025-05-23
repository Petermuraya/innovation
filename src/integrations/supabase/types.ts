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
      certificates: {
        Row: {
          certificate_url: string
          created_at: string | null
          created_by: string | null
          event_id: string | null
          id: string
          issue_date: string | null
          user_id: string | null
        }
        Insert: {
          certificate_url: string
          created_at?: string | null
          created_by?: string | null
          event_id?: string | null
          id?: string
          issue_date?: string | null
          user_id?: string | null
        }
        Update: {
          certificate_url?: string
          created_at?: string | null
          created_by?: string | null
          event_id?: string | null
          id?: string
          issue_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          event_id: string | null
          id: string
          payment_id: string | null
          payment_status: string | null
          registered_at: string | null
          user_id: string | null
        }
        Insert: {
          event_id?: string | null
          id?: string
          payment_id?: string | null
          payment_status?: string | null
          registered_at?: string | null
          user_id?: string | null
        }
        Update: {
          event_id?: string | null
          id?: string
          payment_id?: string | null
          payment_status?: string | null
          registered_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "mpesa_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string
          description: string | null
          id: string
          location: string | null
          max_attendees: number | null
          price: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date: string
          description?: string | null
          id?: string
          location?: string | null
          max_attendees?: number | null
          price?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          location?: string | null
          max_attendees?: number | null
          price?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          course: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          registration_status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          course?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          registration_status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          course?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          registration_status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      mpesa_configurations: {
        Row: {
          business_short_code: string
          callback_url: string
          consumer_key: string
          consumer_secret: string
          created_at: string | null
          id: string
          is_active: boolean | null
          passkey: string
          updated_at: string | null
        }
        Insert: {
          business_short_code: string
          callback_url: string
          consumer_key: string
          consumer_secret: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          passkey: string
          updated_at?: string | null
        }
        Update: {
          business_short_code?: string
          callback_url?: string
          consumer_key?: string
          consumer_secret?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          passkey?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mpesa_payments: {
        Row: {
          amount: number
          checkout_request_id: string | null
          created_at: string | null
          id: string
          merchant_request_id: string | null
          mpesa_receipt_number: string | null
          payment_type: string
          phone_number: string
          reference_id: string | null
          result_code: string | null
          result_desc: string | null
          status: string | null
          transaction_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          checkout_request_id?: string | null
          created_at?: string | null
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          payment_type: string
          phone_number: string
          reference_id?: string | null
          result_code?: string | null
          result_desc?: string | null
          status?: string | null
          transaction_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          checkout_request_id?: string | null
          created_at?: string | null
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          payment_type?: string
          phone_number?: string
          reference_id?: string | null
          result_code?: string | null
          result_desc?: string | null
          status?: string | null
          transaction_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          amount: number
          checkout_request_id: string | null
          created_at: string | null
          id: string
          merchant_request_id: string | null
          payment_type: string
          phone_number: string
          reference_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          checkout_request_id?: string | null
          created_at?: string | null
          id?: string
          merchant_request_id?: string | null
          payment_type: string
          phone_number: string
          reference_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          checkout_request_id?: string | null
          created_at?: string | null
          id?: string
          merchant_request_id?: string | null
          payment_type?: string
          phone_number?: string
          reference_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      project_submissions: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          description: string
          github_url: string
          id: string
          status: string | null
          tech_tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          description: string
          github_url: string
          id?: string
          status?: string | null
          tech_tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          description?: string
          github_url?: string
          id?: string
          status?: string | null
          tech_tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
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
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "member"
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
    Enums: {
      user_role: ["admin", "member"],
    },
  },
} as const
