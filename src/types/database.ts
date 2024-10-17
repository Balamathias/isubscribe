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
      account: {
        Row: {
          account_name: string | null
          account_number: string | null
          bank_code: string | null
          bank_name: string | null
          created_at: string
          id: number
          reference: string | null
          status: string | null
          updated_at: string | null
          user: string
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          bank_code?: string | null
          bank_name?: string | null
          created_at?: string
          id?: number
          reference?: string | null
          status?: string | null
          updated_at?: string | null
          user: string
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          bank_code?: string | null
          bank_name?: string | null
          created_at?: string
          id?: number
          reference?: string | null
          status?: string | null
          updated_at?: string | null
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_user_fkey"
            columns: ["user"]
            isOneToOne: true
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_room: {
        Row: {
          created_at: string
          id: string
          participants: string[] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          participants?: string[] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          participants?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_room_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          attachment_url: string | null
          avatar: string | null
          chat_room: string | null
          created_at: string
          id: number
          message: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          attachment_url?: string | null
          avatar?: string | null
          chat_room?: string | null
          created_at?: string
          id?: number
          message: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          attachment_url?: string | null
          avatar?: string | null
          chat_room?: string | null
          created_at?: string
          id?: number
          message?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_chat_room_fkey"
            columns: ["chat_room"]
            isOneToOne: false
            referencedRelation: "chat_room"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      history: {
        Row: {
          amount: number | null
          commission: number | null
          created_at: string
          description: string | null
          email: string | null
          id: number
          meta_data: Json | null
          provider: string | null
          request_id: string | null
          status: string | null
          title: string | null
          transaction_id: string | null
          type: string | null
          updated_at: string | null
          user: string | null
        }
        Insert: {
          amount?: number | null
          commission?: number | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: number
          meta_data?: Json | null
          provider?: string | null
          request_id?: string | null
          status?: string | null
          title?: string | null
          transaction_id?: string | null
          type?: string | null
          updated_at?: string | null
          user?: string | null
        }
        Update: {
          amount?: number | null
          commission?: number | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: number
          meta_data?: Json | null
          provider?: string | null
          request_id?: string | null
          status?: string | null
          title?: string | null
          transaction_id?: string | null
          type?: string | null
          updated_at?: string | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "history_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_requests: {
        Row: {
          expires_at: string
          id: number
          otp: string
          used: boolean | null
          user_id: string | null
        }
        Insert: {
          expires_at: string
          id?: number
          otp: string
          used?: boolean | null
          user_id?: string | null
        }
        Update: {
          expires_at?: string
          id?: number
          otp?: string
          used?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "otp_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          avatar: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          onboarded: boolean | null
          phone: string | null
          phone_numbers: string[] | null
          pin: string | null
          security_answer: string | null
          security_question: string | null
          state: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          onboarded?: boolean | null
          phone?: string | null
          phone_numbers?: string[] | null
          pin?: string | null
          security_answer?: string | null
          security_question?: string | null
          state?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          onboarded?: boolean | null
          phone?: string | null
          phone_numbers?: string[] | null
          pin?: string | null
          security_answer?: string | null
          security_question?: string | null
          state?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      wallet: {
        Row: {
          balance: number | null
          bonus_claimed: boolean | null
          cashback_balance: number | null
          created_at: string
          email: string | null
          id: number
          meta_data: Json | null
          updated_at: string | null
          user: string
        }
        Insert: {
          balance?: number | null
          bonus_claimed?: boolean | null
          cashback_balance?: number | null
          created_at?: string
          email?: string | null
          id?: number
          meta_data?: Json | null
          updated_at?: string | null
          user: string
        }
        Update: {
          balance?: number | null
          bonus_claimed?: boolean | null
          cashback_balance?: number | null
          created_at?: string
          email?: string | null
          id?: number
          meta_data?: Json | null
          updated_at?: string | null
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_user_fkey"
            columns: ["user"]
            isOneToOne: true
            referencedRelation: "profile"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
