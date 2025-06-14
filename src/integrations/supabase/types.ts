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
      admin_communications: {
        Row: {
          attachments: Json | null
          created_at: string
          created_by: string | null
          deadline: string | null
          id: string
          is_read_by: Json | null
          message: string
          priority: string
          requires_response: boolean | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          id?: string
          is_read_by?: Json | null
          message: string
          priority?: string
          requires_response?: boolean | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          id?: string
          is_read_by?: Json | null
          message?: string
          priority?: string
          requires_response?: boolean | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_requests: {
        Row: {
          admin_code: string | null
          admin_type: string | null
          community_id: string | null
          created_at: string
          email: string
          id: string
          justification: string
          name: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_code?: string | null
          admin_type?: string | null
          community_id?: string | null
          created_at?: string
          email: string
          id?: string
          justification: string
          name: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_code?: string | null
          admin_type?: string | null
          community_id?: string | null
          created_at?: string
          email?: string
          id?: string
          justification?: string
          name?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_requests_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_dashboard_stats"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "admin_requests_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_comments: {
        Row: {
          blog_id: string
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          blog_id: string
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          blog_id?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_likes: {
        Row: {
          blog_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_likes_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          admin_verified: boolean | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          slug: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
          view_count: number | null
        }
        Insert: {
          admin_verified?: boolean | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
          view_count?: number | null
        }
        Update: {
          admin_verified?: boolean | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      career_opportunities: {
        Row: {
          application_email: string | null
          application_url: string | null
          company_name: string
          created_at: string
          description: string
          expires_at: string | null
          id: string
          location: string | null
          posted_by: string | null
          remote: boolean | null
          requirements: string | null
          salary_range: string | null
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          application_email?: string | null
          application_url?: string | null
          company_name: string
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          location?: string | null
          posted_by?: string | null
          remote?: boolean | null
          requirements?: string | null
          salary_range?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          application_email?: string | null
          application_url?: string | null
          company_name?: string
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          location?: string | null
          posted_by?: string | null
          remote?: boolean | null
          requirements?: string | null
          salary_range?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificate_templates: {
        Row: {
          created_at: string | null
          description: string | null
          fields: Json | null
          id: string
          is_active: boolean | null
          name: string
          template_url: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fields?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          template_url: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fields?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          template_url?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          achievement_type: string | null
          certificate_type: string | null
          certificate_url: string
          created_at: string | null
          created_by: string | null
          description: string | null
          event_id: string | null
          id: string
          is_public: boolean | null
          issue_date: string | null
          metadata: Json | null
          social_share_enabled: boolean | null
          template_used: string | null
          user_id: string | null
          verification_code: string | null
        }
        Insert: {
          achievement_type?: string | null
          certificate_type?: string | null
          certificate_url: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_id?: string | null
          id?: string
          is_public?: boolean | null
          issue_date?: string | null
          metadata?: Json | null
          social_share_enabled?: boolean | null
          template_used?: string | null
          user_id?: string | null
          verification_code?: string | null
        }
        Update: {
          achievement_type?: string | null
          certificate_type?: string | null
          certificate_url?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_id?: string | null
          id?: string
          is_public?: boolean | null
          issue_date?: string | null
          metadata?: Json | null
          social_share_enabled?: boolean | null
          template_used?: string | null
          user_id?: string | null
          verification_code?: string | null
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
      chatbot_conversations: {
        Row: {
          created_at: string
          id: string
          is_user_message: boolean
          message: string
          response: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_user_message?: boolean
          message: string
          response: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_user_message?: boolean
          message?: string
          response?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      community_admin_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          community_id: string
          id: string
          is_active: boolean | null
          role: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          community_id: string
          id?: string
          is_active?: boolean | null
          role?: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          community_id?: string
          id?: string
          is_active?: boolean | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_admin_roles_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_dashboard_stats"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "community_admin_roles_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      community_admins: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          community_id: string
          id: string
          is_active: boolean | null
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          community_id: string
          id?: string
          is_active?: boolean | null
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          community_id?: string
          id?: string
          is_active?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_admins_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_dashboard_stats"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "community_admins_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      community_dashboard_permissions: {
        Row: {
          admin_user_id: string
          community_id: string
          created_at: string | null
          id: string
          permissions: Json | null
          updated_at: string | null
        }
        Insert: {
          admin_user_id: string
          community_id: string
          created_at?: string | null
          id?: string
          permissions?: Json | null
          updated_at?: string | null
        }
        Update: {
          admin_user_id?: string
          community_id?: string
          created_at?: string | null
          id?: string
          permissions?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_dashboard_permissions_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_dashboard_stats"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "community_dashboard_permissions_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      community_events: {
        Row: {
          community_id: string
          created_at: string
          event_id: string
          id: string
        }
        Insert: {
          community_id: string
          created_at?: string
          event_id: string
          id?: string
        }
        Update: {
          community_id?: string
          created_at?: string
          event_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_events_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_dashboard_stats"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "community_events_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      community_groups: {
        Row: {
          activities: string[] | null
          created_at: string
          created_by: string | null
          description: string
          focus_areas: string[] | null
          id: string
          is_active: boolean | null
          lead_id: string | null
          meeting_days: string[] | null
          meeting_location: string | null
          meeting_schedule: string
          meeting_time: string | null
          name: string
          next_meeting_date: string | null
          updated_at: string
        }
        Insert: {
          activities?: string[] | null
          created_at?: string
          created_by?: string | null
          description: string
          focus_areas?: string[] | null
          id?: string
          is_active?: boolean | null
          lead_id?: string | null
          meeting_days?: string[] | null
          meeting_location?: string | null
          meeting_schedule: string
          meeting_time?: string | null
          name: string
          next_meeting_date?: string | null
          updated_at?: string
        }
        Update: {
          activities?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string
          focus_areas?: string[] | null
          id?: string
          is_active?: boolean | null
          lead_id?: string | null
          meeting_days?: string[] | null
          meeting_location?: string | null
          meeting_schedule?: string
          meeting_time?: string | null
          name?: string
          next_meeting_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      community_meeting_attendance: {
        Row: {
          community_id: string
          created_at: string | null
          id: string
          marked_by: string
          meeting_date: string
          notes: string | null
          user_id: string
        }
        Insert: {
          community_id: string
          created_at?: string | null
          id?: string
          marked_by: string
          meeting_date: string
          notes?: string | null
          user_id: string
        }
        Update: {
          community_id?: string
          created_at?: string | null
          id?: string
          marked_by?: string
          meeting_date?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_meeting_attendance_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_dashboard_stats"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "community_meeting_attendance_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      community_memberships: {
        Row: {
          community_id: string
          id: string
          joined_at: string
          status: string | null
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string
          status?: string | null
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_memberships_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_dashboard_stats"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "community_memberships_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      community_projects: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          community_id: string
          created_at: string
          id: string
          project_id: string
          status: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          community_id: string
          created_at?: string
          id?: string
          project_id: string
          status?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          community_id?: string
          created_at?: string
          id?: string
          project_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_projects_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_dashboard_stats"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "community_projects_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "featured_projects_home"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_projects_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      community_reminders: {
        Row: {
          community_id: string
          created_at: string | null
          created_by: string
          id: string
          message: string
          reminder_type: string
          scheduled_for: string
          sent_at: string | null
          status: string | null
          title: string
        }
        Insert: {
          community_id: string
          created_at?: string | null
          created_by: string
          id?: string
          message: string
          reminder_type?: string
          scheduled_for: string
          sent_at?: string | null
          status?: string | null
          title: string
        }
        Update: {
          community_id?: string
          created_at?: string | null
          created_by?: string
          id?: string
          message?: string
          reminder_type?: string
          scheduled_for?: string
          sent_at?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_reminders_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_dashboard_stats"
            referencedColumns: ["community_id"]
          },
          {
            foreignKeyName: "community_reminders_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "community_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      election_candidates: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          election_id: string
          id: string
          manifesto: string | null
          position_type: Database["public"]["Enums"]["election_position"]
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          election_id: string
          id?: string
          manifesto?: string | null
          position_type: Database["public"]["Enums"]["election_position"]
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          election_id?: string
          id?: string
          manifesto?: string | null
          position_type?: Database["public"]["Enums"]["election_position"]
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "election_candidates_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      election_positions: {
        Row: {
          created_at: string
          election_id: string
          id: string
          max_candidates: number | null
          position_type: Database["public"]["Enums"]["election_position"]
        }
        Insert: {
          created_at?: string
          election_id: string
          id?: string
          max_candidates?: number | null
          position_type: Database["public"]["Enums"]["election_position"]
        }
        Update: {
          created_at?: string
          election_id?: string
          id?: string
          max_candidates?: number | null
          position_type?: Database["public"]["Enums"]["election_position"]
        }
        Relationships: [
          {
            foreignKeyName: "election_positions_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      election_votes: {
        Row: {
          candidate_id: string
          created_at: string
          election_id: string
          id: string
          position_type: Database["public"]["Enums"]["election_position"]
          voter_id: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          election_id: string
          id?: string
          position_type: Database["public"]["Enums"]["election_position"]
          voter_id: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          election_id?: string
          id?: string
          position_type?: Database["public"]["Enums"]["election_position"]
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "election_votes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "election_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "election_votes_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      elections: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          nomination_end_date: string
          nomination_start_date: string
          status: Database["public"]["Enums"]["election_status"]
          title: string
          updated_at: string
          voting_end_date: string
          voting_start_date: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          nomination_end_date: string
          nomination_start_date: string
          status?: Database["public"]["Enums"]["election_status"]
          title: string
          updated_at?: string
          voting_end_date: string
          voting_start_date: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          nomination_end_date?: string
          nomination_start_date?: string
          status?: Database["public"]["Enums"]["election_status"]
          title?: string
          updated_at?: string
          voting_end_date?: string
          voting_start_date?: string
        }
        Relationships: []
      }
      event_attendance: {
        Row: {
          attended_at: string
          event_id: string
          id: string
          marked_by: string
          notes: string | null
          user_id: string
        }
        Insert: {
          attended_at?: string
          event_id: string
          id?: string
          marked_by: string
          notes?: string | null
          user_id: string
        }
        Update: {
          attended_at?: string
          event_id?: string
          id?: string
          marked_by?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_event_id_fkey"
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
          is_published: boolean | null
          location: string | null
          max_attendees: number | null
          price: number | null
          registration_fields: Json | null
          requires_registration: boolean | null
          status: string | null
          title: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          max_attendees?: number | null
          price?: number | null
          registration_fields?: Json | null
          requires_registration?: boolean | null
          status?: string | null
          title: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          max_attendees?: number | null
          price?: number | null
          registration_fields?: Json | null
          requires_registration?: boolean | null
          status?: string | null
          title?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      member_badges: {
        Row: {
          badge_type: string
          category: string | null
          description: string | null
          earned_at: string
          id: string
          points: number
          user_id: string
        }
        Insert: {
          badge_type: string
          category?: string | null
          description?: string | null
          earned_at?: string
          id?: string
          points?: number
          user_id: string
        }
        Update: {
          badge_type?: string
          category?: string | null
          description?: string | null
          earned_at?: string
          id?: string
          points?: number
          user_id?: string
        }
        Relationships: []
      }
      member_points: {
        Row: {
          activity_date: string | null
          activity_type: string | null
          description: string | null
          earned_at: string
          id: string
          points: number
          source: string
          source_id: string | null
          user_id: string
        }
        Insert: {
          activity_date?: string | null
          activity_type?: string | null
          description?: string | null
          earned_at?: string
          id?: string
          points?: number
          source: string
          source_id?: string | null
          user_id: string
        }
        Update: {
          activity_date?: string | null
          activity_type?: string | null
          description?: string | null
          earned_at?: string
          id?: string
          points?: number
          source?: string
          source_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          course: string | null
          created_at: string | null
          email: string
          github_username: string | null
          id: string
          linkedin_url: string | null
          name: string
          phone: string | null
          registration_status: string | null
          skills: string[] | null
          updated_at: string | null
          user_id: string | null
          year_of_study: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          course?: string | null
          created_at?: string | null
          email: string
          github_username?: string | null
          id?: string
          linkedin_url?: string | null
          name: string
          phone?: string | null
          registration_status?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          year_of_study?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          course?: string | null
          created_at?: string | null
          email?: string
          github_username?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          phone?: string | null
          registration_status?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          year_of_study?: string | null
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
      newsletter_subscriptions: {
        Row: {
          email: string
          id: string
          status: string
          subscribed_at: string
          unsubscribed_at: string | null
          user_id: string | null
        }
        Insert: {
          email: string
          id?: string
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          user_id?: string | null
        }
        Update: {
          email?: string
          id?: string
          status?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
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
      official_communications: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          priority: string
          published: boolean
          published_at: string | null
          tags: string[] | null
          target_audience: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          priority?: string
          published?: boolean
          published_at?: string | null
          tags?: string[] | null
          target_audience?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          priority?: string
          published?: boolean
          published_at?: string | null
          tags?: string[] | null
          target_audience?: string
          title?: string
          type?: string
          updated_at?: string
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
      point_configurations: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          points_value: number
          updated_at: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          points_value?: number
          updated_at?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          points_value?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          course: string | null
          created_at: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          course?: string | null
          created_at?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          course?: string | null
          created_at?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      project_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          project_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "featured_projects_home"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      project_likes: {
        Row: {
          created_at: string
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_likes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "featured_projects_home"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_likes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_likes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      project_ratings: {
        Row: {
          created_at: string
          id: string
          project_id: string
          rating: number
          review: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          rating: number
          review?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          rating?: number
          review?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_ratings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "featured_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_ratings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_submissions: {
        Row: {
          admin_feedback: string | null
          admin_notes: string | null
          created_at: string | null
          description: string
          featured_at: string | null
          featured_by: string | null
          featured_order: number | null
          github_url: string
          id: string
          is_featured: boolean | null
          is_hidden: boolean | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          tech_tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          admin_feedback?: string | null
          admin_notes?: string | null
          created_at?: string | null
          description: string
          featured_at?: string | null
          featured_by?: string | null
          featured_order?: number | null
          github_url: string
          id?: string
          is_featured?: boolean | null
          is_hidden?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          tech_tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          admin_feedback?: string | null
          admin_notes?: string | null
          created_at?: string | null
          description?: string
          featured_at?: string | null
          featured_by?: string | null
          featured_order?: number | null
          github_url?: string
          id?: string
          is_featured?: boolean | null
          is_hidden?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          tech_tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          demo_video_url: string | null
          description: string
          featured: boolean | null
          github_url: string | null
          id: string
          image_url: string | null
          status: string | null
          tech_stack: string[] | null
          title: string
          updated_at: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          created_at?: string
          demo_video_url?: string | null
          description: string
          featured?: boolean | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          status?: string | null
          tech_stack?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          created_at?: string
          demo_video_url?: string | null
          description?: string
          featured?: boolean | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          status?: string | null
          tech_stack?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      role_hierarchy: {
        Row: {
          child_role: Database["public"]["Enums"]["comprehensive_role"]
          created_at: string | null
          id: string
          parent_role: Database["public"]["Enums"]["comprehensive_role"]
        }
        Insert: {
          child_role: Database["public"]["Enums"]["comprehensive_role"]
          created_at?: string | null
          id?: string
          parent_role: Database["public"]["Enums"]["comprehensive_role"]
        }
        Update: {
          child_role?: Database["public"]["Enums"]["comprehensive_role"]
          created_at?: string | null
          id?: string
          parent_role?: Database["public"]["Enums"]["comprehensive_role"]
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          permission_key: string
          permission_name: string
          role: Database["public"]["Enums"]["comprehensive_role"]
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          permission_key: string
          permission_name: string
          role: Database["public"]["Enums"]["comprehensive_role"]
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          permission_key?: string
          permission_name?: string
          role?: Database["public"]["Enums"]["comprehensive_role"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["comprehensive_role"]
          user_id: string | null
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["comprehensive_role"]
          user_id?: string | null
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["comprehensive_role"]
          user_id?: string | null
        }
        Relationships: []
      }
      user_website_visits: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          visit_count: number | null
          visit_date: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          visit_count?: number | null
          visit_date?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          visit_count?: number | null
          visit_date?: string
        }
        Relationships: []
      }
      weekly_meetings: {
        Row: {
          created_at: string
          created_by: string | null
          day_of_week: string
          description: string | null
          id: string
          is_active: boolean | null
          location: string | null
          time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          day_of_week: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          day_of_week?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          time?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      community_dashboard_stats: {
        Row: {
          attended_last_meeting: number | null
          community_id: string | null
          community_name: string | null
          total_events: number | null
          total_members: number | null
          total_projects: number | null
        }
        Relationships: []
      }
      enhanced_member_leaderboard: {
        Row: {
          avatar_url: string | null
          blog_points: number | null
          blogs_written: number | null
          email: string | null
          event_points: number | null
          events_attended: number | null
          name: string | null
          project_points: number | null
          projects_created: number | null
          rank: number | null
          subscription_points: number | null
          subscriptions_made: number | null
          total_points: number | null
          user_id: string | null
          visit_days: number | null
          visit_points: number | null
        }
        Relationships: []
      }
      featured_projects: {
        Row: {
          author_name: string | null
          avg_rating: number | null
          created_at: string | null
          demo_video_url: string | null
          description: string | null
          featured: boolean | null
          github_url: string | null
          id: string | null
          image_url: string | null
          rating_count: number | null
          status: string | null
          tech_stack: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          view_count: number | null
        }
        Relationships: []
      }
      featured_projects_home: {
        Row: {
          admin_feedback: string | null
          admin_notes: string | null
          author_name: string | null
          created_at: string | null
          description: string | null
          featured_at: string | null
          featured_by: string | null
          featured_order: number | null
          github_url: string | null
          id: string | null
          is_featured: boolean | null
          is_hidden: boolean | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          tech_tags: string[] | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
      member_leaderboard: {
        Row: {
          avg_project_rating: number | null
          badges_earned: number | null
          email: string | null
          events_attended: number | null
          name: string | null
          projects_created: number | null
          total_points: number | null
          user_id: string | null
        }
        Relationships: []
      }
      member_management_view: {
        Row: {
          avatar_url: string | null
          bio: string | null
          certificates_earned: number | null
          course: string | null
          created_at: string | null
          email: string | null
          events_attended: number | null
          github_username: string | null
          id: string | null
          linkedin_url: string | null
          name: string | null
          phone: string | null
          projects_submitted: number | null
          registration_status: string | null
          roles: Database["public"]["Enums"]["comprehensive_role"][] | null
          skills: string[] | null
          total_points: number | null
          updated_at: string | null
          user_id: string | null
          year_of_study: string | null
        }
        Relationships: []
      }
      project_leaderboard: {
        Row: {
          admin_notes: string | null
          author_name: string | null
          comments_count: number | null
          created_at: string | null
          description: string | null
          engagement_score: number | null
          github_url: string | null
          id: string | null
          likes_count: number | null
          status: string | null
          tech_tags: string[] | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
      user_roles_with_hierarchy: {
        Row: {
          assigned_role:
            | Database["public"]["Enums"]["comprehensive_role"]
            | null
          inherited_roles:
            | Database["public"]["Enums"]["comprehensive_role"][]
            | null
          permissions: string[] | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_activity_points: {
        Args: {
          user_id_param: string
          activity_type_param: string
          source_id_param?: string
          description_param?: string
        }
        Returns: undefined
      }
      award_points: {
        Args: {
          user_id_param: string
          points_param: number
          source_param: string
          source_id_param?: string
          description_param?: string
        }
        Returns: undefined
      }
      calculate_detailed_member_ranking: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          name: string
          email: string
          total_points: number
          events_attended: number
          badges_earned: number
          projects_created: number
          avg_project_rating: number
          rank: number
        }[]
      }
      calculate_member_ranking: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          total_points: number
          rank: number
          badges_count: number
        }[]
      }
      can_user_vote: {
        Args: { election_id_param: string; user_id_param: string }
        Returns: boolean
      }
      get_election_results: {
        Args: { election_id_param: string }
        Returns: {
          position_type: Database["public"]["Enums"]["election_position"]
          candidate_id: string
          candidate_name: string
          vote_count: number
        }[]
      }
      handle_admin_request: {
        Args: {
          request_id: string
          action: string
          reviewer_id: string
          user_id: string
          community_id: string
          admin_type: string
        }
        Returns: undefined
      }
      has_permission: {
        Args: { _user_id: string; _permission_key: string }
        Returns: boolean
      }
      has_role: {
        Args:
          | {
              _user_id: string
              _role: Database["public"]["Enums"]["comprehensive_role"]
            }
          | {
              _user_id: string
              _role: Database["public"]["Enums"]["user_role"]
            }
        Returns: boolean
      }
      has_role_or_higher: {
        Args: {
          _user_id: string
          _required_role: Database["public"]["Enums"]["comprehensive_role"]
        }
        Returns: boolean
      }
      is_admin_or_patron: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_community_admin: {
        Args: { _user_id: string; _community_id: string }
        Returns: boolean
      }
      is_patron: {
        Args: { _user_id: string }
        Returns: boolean
      }
      manage_featured_project: {
        Args: { project_id: string; make_featured: boolean; admin_id: string }
        Returns: undefined
      }
      track_website_visit: {
        Args: { user_id_param: string }
        Returns: boolean
      }
    }
    Enums: {
      comprehensive_role:
        | "member"
        | "super_admin"
        | "general_admin"
        | "community_admin"
        | "events_admin"
        | "projects_admin"
        | "finance_admin"
        | "content_admin"
        | "technical_admin"
        | "marketing_admin"
      election_position:
        | "chairman"
        | "vice_chairman"
        | "treasurer"
        | "secretary"
        | "vice_secretary"
        | "organizing_secretary"
        | "auditor"
      election_status:
        | "draft"
        | "nomination_open"
        | "voting_open"
        | "completed"
        | "cancelled"
      user_role: "admin" | "member" | "patron"
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
      comprehensive_role: [
        "member",
        "super_admin",
        "general_admin",
        "community_admin",
        "events_admin",
        "projects_admin",
        "finance_admin",
        "content_admin",
        "technical_admin",
        "marketing_admin",
      ],
      election_position: [
        "chairman",
        "vice_chairman",
        "treasurer",
        "secretary",
        "vice_secretary",
        "organizing_secretary",
        "auditor",
      ],
      election_status: [
        "draft",
        "nomination_open",
        "voting_open",
        "completed",
        "cancelled",
      ],
      user_role: ["admin", "member", "patron"],
    },
  },
} as const
