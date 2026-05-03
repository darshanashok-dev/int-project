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
          created_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: string
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          created_at?: string | null
        }
      }
      startups: {
        Row: {
          id: string
          founder_id: string
          name: string
          sector: string | null
          stage: string | null
          status: string | null
          strategy_summary: string | null
          target_market: string | null
          revenue_model: string | null
          competitive_advantage: string | null
          strategy_updated_at: string | null
          created_at: string | null
          founded_date: string | null
          elevator_pitch: string | null
          active_round_name: string | null
          funding_goal: number | null
          round_status: string | null
        }
        Insert: {
          id?: string
          founder_id: string
          name: string
          sector?: string | null
          stage?: string | null
          status?: string | null
          strategy_summary?: string | null
          target_market?: string | null
          revenue_model?: string | null
          competitive_advantage?: string | null
          strategy_updated_at?: string | null
          created_at?: string | null
          founded_date?: string | null
          elevator_pitch?: string | null
          active_round_name?: string | null
          funding_goal?: number | null
          round_status?: string | null
        }
        Update: {
          id?: string
          founder_id?: string
          name?: string
          sector?: string | null
          stage?: string | null
          status?: string | null
          strategy_summary?: string | null
          target_market?: string | null
          revenue_model?: string | null
          competitive_advantage?: string | null
          strategy_updated_at?: string | null
          created_at?: string | null
          founded_date?: string | null
          elevator_pitch?: string | null
          active_round_name?: string | null
          funding_goal?: number | null
          round_status?: string | null
        }
      }
      funding: {
        Row: {
          id: string
          startup_id: string | null
          round: string
          amount: number
          source: string | null
          date: string
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          startup_id?: string | null
          round: string
          amount: number
          source?: string | null
          date: string
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          startup_id?: string | null
          round?: string
          amount?: number
          source?: string | null
          date?: string
          status?: string | null
          created_at?: string | null
        }
      }
      milestones: {
        Row: {
          id: string
          startup_id: string | null
          title: string
          due_date: string | null
          status: string | null
          completed_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          startup_id?: string | null
          title: string
          due_date?: string | null
          status?: string | null
          completed_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          startup_id?: string | null
          title?: string
          due_date?: string | null
          status?: string | null
          completed_at?: string | null
          created_at?: string | null
        }
      }
      applications: {
        Row: {
          id: string
          startup_id: string | null
          program_id: string | null
          status: string | null
          submitted_at: string | null
        }
        Insert: {
          id?: string
          startup_id?: string | null
          program_id?: string | null
          status?: string | null
          submitted_at?: string | null
        }
        Update: {
          id?: string
          startup_id?: string | null
          program_id?: string | null
          status?: string | null
          submitted_at?: string | null
        }
      }
      programs: {
        Row: {
          id: string
          name: string
          cohort: string
          start_date: string | null
          end_date: string | null
          manager_id: string | null
          cohort_start: string | null
          cohort_end: string | null
          demo_day_date: string | null
          max_startups: number | null
          created_at: string | null
          funding_amount: string | null
          funding_type: string | null
        }
        Insert: {
          id?: string
          name: string
          cohort: string
          start_date?: string | null
          end_date?: string | null
          manager_id?: string | null
          cohort_start?: string | null
          cohort_end?: string | null
          demo_day_date?: string | null
          max_startups?: number | null
          created_at?: string | null
          funding_amount?: string | null
          funding_type?: string | null
        }
        Update: {
          id?: string
          name?: string
          cohort?: string
          start_date?: string | null
          end_date?: string | null
          manager_id?: string | null
          cohort_start?: string | null
          cohort_end?: string | null
          demo_day_date?: string | null
          max_startups?: number | null
          created_at?: string | null
          funding_amount?: string | null
          funding_type?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          startup_id: string | null
          name: string
          type: string | null
          url: string | null
          size_bytes: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          startup_id?: string | null
          name: string
          type?: string | null
          url?: string | null
          size_bytes?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          startup_id?: string | null
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
          startup_id: string | null
          stakeholder_name: string
          stakeholder_type: string | null
          equity_percentage: number
          created_at: string | null
        }
        Insert: {
          id?: string
          startup_id?: string | null
          stakeholder_name: string
          stakeholder_type?: string | null
          equity_percentage: number
          created_at?: string | null
        }
        Update: {
          id?: string
          startup_id?: string | null
          stakeholder_name?: string
          stakeholder_type?: string | null
          equity_percentage?: number
          created_at?: string | null
        }
      }
      application_scores: {
        Row: {
          id: string
          application_id: string | null
          reviewer_id: string | null
          team_score: number | null
          market_score: number | null
          traction_score: number | null
          uniqueness_score: number | null
          overall_comment: string | null
          scored_at: string | null
        }
        Insert: {
          id?: string
          application_id?: string | null
          reviewer_id?: string | null
          team_score?: number | null
          market_score?: number | null
          traction_score?: number | null
          uniqueness_score?: number | null
          overall_comment?: string | null
          scored_at?: string | null
        }
        Update: {
          id?: string
          application_id?: string | null
          reviewer_id?: string | null
          team_score?: number | null
          market_score?: number | null
          traction_score?: number | null
          uniqueness_score?: number | null
          overall_comment?: string | null
          scored_at?: string | null
        }
      }
      mentors: {
        Row: {
          id: string
          user_id: string
          expertise: string | null
          bio: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          expertise?: string | null
          bio?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          expertise?: string | null
          bio?: string | null
          created_at?: string | null
        }
      }
      mentor_assignments: {
        Row: {
          mentor_id: string
          startup_id: string
          assigned_by: string | null
          assigned_at: string | null
        }
        Insert: {
          mentor_id: string
          startup_id: string
          assigned_by?: string | null
          assigned_at?: string | null
        }
        Update: {
          mentor_id?: string
          startup_id?: string
          assigned_by?: string | null
          assigned_at?: string | null
        }
      }
      sessions: {
        Row: {
          id: string
          mentor_id: string | null
          startup_id: string | null
          scheduled_at: string
          notes: string | null
          feedback: string | null
          rating: number | null
          status: string | null
          action_items: string | null
          linked_milestone_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          mentor_id?: string | null
          startup_id?: string | null
          scheduled_at: string
          notes?: string | null
          feedback?: string | null
          rating?: number | null
          status?: string | null
          action_items?: string | null
          linked_milestone_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          mentor_id?: string | null
          startup_id?: string | null
          scheduled_at?: string
          notes?: string | null
          feedback?: string | null
          rating?: number | null
          status?: string | null
          action_items?: string | null
          linked_milestone_id?: string | null
          created_at?: string | null
        }
      }
      events: {
        Row: {
          id: string
          program_id: string | null
          title: string
          type: string | null
          date: string
          location: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          program_id?: string | null
          title: string
          type?: string | null
          date: string
          location?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          program_id?: string | null
          title?: string
          type?: string | null
          date?: string
          location?: string | null
          created_at?: string | null
        }
      }
      event_registrations: {
        Row: {
          event_id: string
          user_id: string
          created_at: string | null
        }
        Insert: {
          event_id: string
          user_id: string
          created_at?: string | null
        }
        Update: {
          event_id?: string
          user_id?: string
          created_at?: string | null
        }
      }
      reports: {
        Row: {
          id: string
          startup_id: string | null
          generated_by: string | null
          period: string | null
          data: Json | null
          milestone_completion_rate: number | null
          funding_received_cumulative: number | null
          session_count_period: number | null
          period_start: string | null
          period_end: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          startup_id?: string | null
          generated_by?: string | null
          period?: string | null
          data?: Json | null
          milestone_completion_rate?: number | null
          funding_received_cumulative?: number | null
          session_count_period?: number | null
          period_start?: string | null
          period_end?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          startup_id?: string | null
          generated_by?: string | null
          period?: string | null
          data?: Json | null
          milestone_completion_rate?: number | null
          funding_received_cumulative?: number | null
          session_count_period?: number | null
          period_start?: string | null
          period_end?: string | null
          created_at?: string | null
        }
      }
      investor_interests: {
        Row: {
          id: string
          investor_id: string | null
          startup_id: string | null
          signal_type: string | null
          note: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          investor_id?: string | null
          startup_id?: string | null
          signal_type?: string | null
          note?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          investor_id?: string | null
          startup_id?: string | null
          signal_type?: string | null
          note?: string | null
          created_at?: string | null
        }
      }
      admin_settings: {
        Row: {
          key: string
          value: string | null
          description: string | null
          updated_by: string | null
          updated_at: string | null
        }
        Insert: {
          key: string
          value?: string | null
          description?: string | null
          updated_by?: string | null
          updated_at?: string | null
        }
        Update: {
          key?: string
          value?: string | null
          description?: string | null
          updated_by?: string | null
          updated_at?: string | null
        }
      }
      broadcasts: {
        Row: {
          id: string
          startup_id: string | null
          founder_id: string | null
          title: string
          area: string | null
          content: string
          audience: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          startup_id?: string | null
          founder_id?: string | null
          title: string
          area?: string | null
          content: string
          audience?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          startup_id?: string | null
          founder_id?: string | null
          title?: string
          area?: string | null
          content?: string
          audience?: string | null
          created_at?: string | null
        }
      }
    }
  }
}

