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
      care_reports: {
        Row: {
          audio_file_url: string | null
          caregiver_id: string | null
          created_at: string | null
          food_water_intake: string | null
          id: string
          medication_given: string | null
          mood: string | null
          physical_condition: string | null
          resident_id: string | null
          special_notes: string | null
          voice_transcript: string | null
        }
        Insert: {
          audio_file_url?: string | null
          caregiver_id?: string | null
          created_at?: string | null
          food_water_intake?: string | null
          id?: string
          medication_given?: string | null
          mood?: string | null
          physical_condition?: string | null
          resident_id?: string | null
          special_notes?: string | null
          voice_transcript?: string | null
        }
        Update: {
          audio_file_url?: string | null
          caregiver_id?: string | null
          created_at?: string | null
          food_water_intake?: string | null
          id?: string
          medication_given?: string | null
          mood?: string | null
          physical_condition?: string | null
          resident_id?: string | null
          special_notes?: string | null
          voice_transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "care_reports_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_reports_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "residents"
            referencedColumns: ["id"]
          },
        ]
      }
      drug_orders: {
        Row: {
          cost: number | null
          expected_delivery: string | null
          id: string
          medication_id: string | null
          notes: string | null
          order_date: string | null
          ordered_by: string | null
          quantity_ordered: number
          status: string | null
          supplier: string | null
        }
        Insert: {
          cost?: number | null
          expected_delivery?: string | null
          id?: string
          medication_id?: string | null
          notes?: string | null
          order_date?: string | null
          ordered_by?: string | null
          quantity_ordered: number
          status?: string | null
          supplier?: string | null
        }
        Update: {
          cost?: number | null
          expected_delivery?: string | null
          id?: string
          medication_id?: string | null
          notes?: string | null
          order_date?: string | null
          ordered_by?: string | null
          quantity_ordered?: number
          status?: string | null
          supplier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drug_orders_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drug_orders_ordered_by_fkey"
            columns: ["ordered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_logs: {
        Row: {
          actual_time: string | null
          administered_by: string | null
          completed: boolean | null
          created_at: string | null
          id: string
          medication_id: string | null
          notes: string | null
          scheduled_time: string | null
        }
        Insert: {
          actual_time?: string | null
          administered_by?: string | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          medication_id?: string | null
          notes?: string | null
          scheduled_time?: string | null
        }
        Update: {
          actual_time?: string | null
          administered_by?: string | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          medication_id?: string | null
          notes?: string | null
          scheduled_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medication_logs_administered_by_fkey"
            columns: ["administered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_logs_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string | null
          dosage: string
          drug_name: string
          end_date: string | null
          frequency: string
          id: string
          instructions: string | null
          prescribed_by: string | null
          reorder_level: number | null
          resident_id: string | null
          start_date: string | null
          stock_count: number | null
        }
        Insert: {
          created_at?: string | null
          dosage: string
          drug_name: string
          end_date?: string | null
          frequency: string
          id?: string
          instructions?: string | null
          prescribed_by?: string | null
          reorder_level?: number | null
          resident_id?: string | null
          start_date?: string | null
          stock_count?: number | null
        }
        Update: {
          created_at?: string | null
          dosage?: string
          drug_name?: string
          end_date?: string | null
          frequency?: string
          id?: string
          instructions?: string | null
          prescribed_by?: string | null
          reorder_level?: number | null
          resident_id?: string | null
          start_date?: string | null
          stock_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_prescribed_by_fkey"
            columns: ["prescribed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medications_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "residents"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          shift_end: string | null
          shift_start: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          shift_end?: string | null
          shift_start?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          shift_end?: string | null
          shift_start?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      residents: {
        Row: {
          admission_date: string | null
          advance_directive: boolean | null
          age: number | null
          aids: string[] | null
          allergies: string[] | null
          billing_carrier: string | null
          birth_date: string | null
          blood_pressure: string | null
          blood_sugar: string | null
          bmi: string | null
          care_aids: boolean | null
          care_level: string | null
          cognition: string | null
          communication: string | null
          created_at: string | null
          decubitus_risk: boolean | null
          diagnoses: string | null
          doctor: string | null
          doctor_address: string | null
          doctor_phone: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          emergency_relation: string | null
          fall_risk: boolean | null
          first_name: string | null
          gender: string | null
          guardian_contact: string | null
          guardian_scope: string | null
          height: string | null
          hobbies: string | null
          id: string
          incontinence: string[] | null
          insurance_type: string | null
          language: string | null
          last_name: string | null
          legal_guardian: string | null
          marital_status: string | null
          medical_conditions: string[] | null
          medications: string | null
          mobility: string | null
          music_preferences: string | null
          name: string
          nationality: string | null
          nutrition: string | null
          nutrition_plan: string | null
          pet_connection: string | null
          previous_address: string | null
          profession: string | null
          profile_image_url: string | null
          psychological_state: string | null
          pulse: string | null
          religion: string | null
          respiratory_rate: string | null
          rituals: string | null
          room: string | null
          room_equipment: string | null
          sleep_behavior: string | null
          temperature: string | null
          updated_at: string | null
          weight: string | null
        }
        Insert: {
          admission_date?: string | null
          advance_directive?: boolean | null
          age?: number | null
          aids?: string[] | null
          allergies?: string[] | null
          billing_carrier?: string | null
          birth_date?: string | null
          blood_pressure?: string | null
          blood_sugar?: string | null
          bmi?: string | null
          care_aids?: boolean | null
          care_level?: string | null
          cognition?: string | null
          communication?: string | null
          created_at?: string | null
          decubitus_risk?: boolean | null
          diagnoses?: string | null
          doctor?: string | null
          doctor_address?: string | null
          doctor_phone?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          emergency_relation?: string | null
          fall_risk?: boolean | null
          first_name?: string | null
          gender?: string | null
          guardian_contact?: string | null
          guardian_scope?: string | null
          height?: string | null
          hobbies?: string | null
          id?: string
          incontinence?: string[] | null
          insurance_type?: string | null
          language?: string | null
          last_name?: string | null
          legal_guardian?: string | null
          marital_status?: string | null
          medical_conditions?: string[] | null
          medications?: string | null
          mobility?: string | null
          music_preferences?: string | null
          name: string
          nationality?: string | null
          nutrition?: string | null
          nutrition_plan?: string | null
          pet_connection?: string | null
          previous_address?: string | null
          profession?: string | null
          profile_image_url?: string | null
          psychological_state?: string | null
          pulse?: string | null
          religion?: string | null
          respiratory_rate?: string | null
          rituals?: string | null
          room?: string | null
          room_equipment?: string | null
          sleep_behavior?: string | null
          temperature?: string | null
          updated_at?: string | null
          weight?: string | null
        }
        Update: {
          admission_date?: string | null
          advance_directive?: boolean | null
          age?: number | null
          aids?: string[] | null
          allergies?: string[] | null
          billing_carrier?: string | null
          birth_date?: string | null
          blood_pressure?: string | null
          blood_sugar?: string | null
          bmi?: string | null
          care_aids?: boolean | null
          care_level?: string | null
          cognition?: string | null
          communication?: string | null
          created_at?: string | null
          decubitus_risk?: boolean | null
          diagnoses?: string | null
          doctor?: string | null
          doctor_address?: string | null
          doctor_phone?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          emergency_relation?: string | null
          fall_risk?: boolean | null
          first_name?: string | null
          gender?: string | null
          guardian_contact?: string | null
          guardian_scope?: string | null
          height?: string | null
          hobbies?: string | null
          id?: string
          incontinence?: string[] | null
          insurance_type?: string | null
          language?: string | null
          last_name?: string | null
          legal_guardian?: string | null
          marital_status?: string | null
          medical_conditions?: string[] | null
          medications?: string | null
          mobility?: string | null
          music_preferences?: string | null
          name?: string
          nationality?: string | null
          nutrition?: string | null
          nutrition_plan?: string | null
          pet_connection?: string | null
          previous_address?: string | null
          profession?: string | null
          profile_image_url?: string | null
          psychological_state?: string | null
          pulse?: string | null
          religion?: string | null
          respiratory_rate?: string | null
          rituals?: string | null
          room?: string | null
          room_equipment?: string | null
          sleep_behavior?: string | null
          temperature?: string | null
          updated_at?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          assigned_staff: string | null
          color_code: string | null
          completed: boolean | null
          created_at: string | null
          description: string | null
          end_time: string | null
          event_type: string | null
          id: string
          recurring_pattern: string | null
          resident_id: string | null
          start_time: string
          title: string
        }
        Insert: {
          assigned_staff?: string | null
          color_code?: string | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          recurring_pattern?: string | null
          resident_id?: string | null
          start_time: string
          title: string
        }
        Update: {
          assigned_staff?: string | null
          color_code?: string | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          recurring_pattern?: string | null
          resident_id?: string | null
          start_time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_assigned_staff_fkey"
            columns: ["assigned_staff"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "residents"
            referencedColumns: ["id"]
          },
        ]
      }
      vital_signs: {
        Row: {
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          created_at: string | null
          heart_rate: number | null
          id: string
          oxygen_saturation: number | null
          recorded_at: string | null
          resident_id: string | null
          source: string | null
          temperature: number | null
          weight: number | null
        }
        Insert: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          created_at?: string | null
          heart_rate?: number | null
          id?: string
          oxygen_saturation?: number | null
          recorded_at?: string | null
          resident_id?: string | null
          source?: string | null
          temperature?: number | null
          weight?: number | null
        }
        Update: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          created_at?: string | null
          heart_rate?: number | null
          id?: string
          oxygen_saturation?: number | null
          recorded_at?: string | null
          resident_id?: string | null
          source?: string | null
          temperature?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vital_signs_resident_id_fkey"
            columns: ["resident_id"]
            isOneToOne: false
            referencedRelation: "residents"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          facility_name: string
          facility_size: string | null
          id: string
          name: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          facility_name: string
          facility_size?: string | null
          id?: string
          name: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          facility_name?: string
          facility_size?: string | null
          id?: string
          name?: string
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
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
