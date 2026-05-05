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
          id: string
          email: string
          full_name: string | null
          role: string
          onboarding_completed: boolean
          created_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: string
          onboarding_completed?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          onboarding_completed?: boolean
          created_at?: string | null
        }
      }
      startups: {
        Row: {
          id: string
          founder_id: string
          name: string
          sector: string
          stage: string
          status: string
          strategy_summary: string | null
          target_market: string | null
          revenue_model: string | null
          competitive_advantage: string | null
          founded_date: string | null
          elevator_pitch: string | null
          active_round_name: string | null
          funding_goal: number | null
          round_status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          founder_id: string
          name: string
          sector: string
          stage: string
          status?: string
          strategy_summary?: string | null
          target_market?: string | null
          revenue_model?: string | null
          competitive_advantage?: string | null
          founded_date?: string | null
          elevator_pitch?: string | null
          active_round_name?: string | null
          funding_goal?: number | null
          round_status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          founder_id?: string
          name?: string
          sector?: string
          stage?: string
          status?: string
          strategy_summary?: string | null
          target_market?: string | null
          revenue_model?: string | null
          competitive_advantage?: string | null
          founded_date?: string | null
          elevator_pitch?: string | null
          active_round_name?: string | null
          funding_goal?: number | null
          round_status?: string | null
          created_at?: string | null
        }
      }
      programs: {
        Row: {
          id: string
          manager_id: string | null
          name: string
          cohort: string
          description: string | null
          start_date: string | null
          end_date: string | null
          cohort_start: string | null
          cohort_end: string | null
          demo_day_date: string | null
          max_startups: number | null
          funding_amount: string | null
          funding_type: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          manager_id?: string | null
          name: string
          cohort: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          cohort_start?: string | null
          cohort_end?: string | null
          demo_day_date?: string | null
          max_startups?: number | null
          funding_amount?: string | null
          funding_type?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          manager_id?: string | null
          name?: string
          cohort?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          cohort_start?: string | null
          cohort_end?: string | null
          demo_day_date?: string | null
          max_startups?: number | null
          funding_amount?: string | null
          funding_type?: string | null
          created_at?: string | null
        }
      }
      applications: {
        Row: {
          id: string
          program_id: string
          startup_id: string
          status: string
          submitted_at: string | null
        }
        Insert: {
          id?: string
          program_id: string
          startup_id: string
          status?: string
          submitted_at?: string | null
        }
        Update: {
          id?: string
          program_id?: string
          startup_id?: string
          status?: string
          submitted_at?: string | null
        }
      }
      milestones: {
        Row: {
          id: string
          startup_id: string
          title: string
          due_date: string | null
          status: string
          completed_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          startup_id: string
          title: string
          due_date?: string | null
          status?: string
          completed_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          startup_id?: string
          title?: string
          due_date?: string | null
          status?: string
          completed_at?: string | null
          created_at?: string | null
        }
      }
      funding: {
        Row: {
          id: string
          startup_id: string
          round: string
          amount: number
          source: string | null
          date: string
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          startup_id: string
          round: string
          amount: number
          source?: string | null
          date: string
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          startup_id?: string
          round?: string
          amount?: number
          source?: string | null
          date?: string
          status?: string | null
          created_at?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          startup_id: string
          name: string
          type: string | null
          url: string | null
          size_bytes: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          startup_id: string
          name: string
          type?: string | null
          url?: string | null
          size_bytes?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          startup_id?: string
          name?: string
          type?: string | null
          url?: string | null
          size_bytes?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      equity: {
        Row: {
          id: string
          startup_id: string
          stakeholder_name: string
          stakeholder_type: string | null
          equity_percentage: number
          created_at: string | null
        }
        Insert: {
          id?: string
          startup_id: string
          stakeholder_name: string
          stakeholder_type?: string | null
          equity_percentage: number
          created_at?: string | null
        }
        Update: {
          id?: string
          startup_id?: string
          stakeholder_name?: string
          stakeholder_type?: string | null
          equity_percentage?: number
          created_at?: string | null
        }
      },
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string
          link: string | null
          read: boolean
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          body: string
          link?: string | null
          read?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          body?: string
          link?: string | null
          read?: boolean
          created_at?: string | null
        }
      }
      investor_interests: {
        Row: {
          id: string
          investor_id: string
          startup_id: string
          signal_type: string
          note: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          investor_id: string
          startup_id: string
          signal_type: string
          note?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          investor_id?: string
          startup_id?: string
          signal_type?: string
          note?: string | null
          created_at?: string | null
        }
      }
      mentor_assignments: {
        Row: {
          id: string
          mentor_id: string
          startup_id: string
          assigned_by: string
          created_at: string | null
        }
        Insert: {
          id?: string
          mentor_id: string
          startup_id: string
          assigned_by: string
          created_at?: string | null
        }
        Update: {
          id?: string
          mentor_id?: string
          startup_id?: string
          assigned_by?: string
          created_at?: string | null
        }
      },
      sessions: {
        Row: {
          id: string
          mentor_id: string
          startup_id: string
          title: string
          scheduled_at: string
          duration_minutes: number
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          mentor_id: string
          startup_id: string
          title: string
          scheduled_at: string
          duration_minutes: number
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          mentor_id?: string
          startup_id?: string
          title?: string
          scheduled_at?: string
          duration_minutes?: number
          notes?: string | null
          created_at?: string | null
        }
      }
      events: {
        Row: {
          id: string
          program_id: string
          title: string
          type: string | null
          date: string
          location: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          program_id: string
          title: string
          type?: string | null
          date: string
          location?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          program_id?: string
          title?: string
          type?: string | null
          date?: string
          location?: string | null
          created_at?: string | null
        }
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
  }
}
