-- Polaris Supabase Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-------------------------------------------------
-- 1. users
-------------------------------------------------
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'founder',
  onboarding_completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_all" ON public.users FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "users_update_self" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Function to check roles securely via table lookup
CREATE OR REPLACE FUNCTION public.is_role(target_roles text[])
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = ANY(target_roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-------------------------------------------------
-- 2. startups
-------------------------------------------------
CREATE TABLE public.startups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  sector text,
  stage text,
  status text DEFAULT 'pending',
  strategy_summary text,
  target_market text,
  revenue_model text,
  competitive_advantage text,
  strategy_updated_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "startups_read_all_authenticated" ON public.startups FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "founder_manage_own_startup" ON public.startups FOR ALL USING (founder_id = auth.uid());

-------------------------------------------------
-- 3. programs (cohorts)
-------------------------------------------------
CREATE TABLE public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  cohort text NOT NULL,
  start_date date,
  end_date date,
  manager_id uuid REFERENCES public.users(id),
  cohort_start date,
  cohort_end date,
  demo_day_date timestamp with time zone,
  max_startups integer DEFAULT 20,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "programs_read_all" ON public.programs FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "manager_manage_programs" ON public.programs FOR ALL USING (
  public.is_role(ARRAY['admin', 'manager'])
);

-------------------------------------------------
-- 4. applications
-------------------------------------------------
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES public.startups(id) ON DELETE CASCADE,
  program_id uuid REFERENCES public.programs(id) ON DELETE CASCADE,
  status text DEFAULT 'submitted',
  submitted_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "founder_read_own_applications" ON public.applications FOR SELECT USING (
  startup_id IN (SELECT id FROM public.startups WHERE founder_id = auth.uid())
);
CREATE POLICY "admin_manager_read_all_applications" ON public.applications FOR SELECT USING (
  public.is_role(ARRAY['admin', 'manager'])
);
CREATE POLICY "founder_insert_application" ON public.applications FOR INSERT WITH CHECK (
  startup_id IN (SELECT id FROM public.startups WHERE founder_id = auth.uid())
);

-------------------------------------------------
-- 5. mentors & 6. mentor_assignments
-------------------------------------------------
CREATE TABLE public.mentors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expertise text,
  bio text,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mentors_read_all" ON public.mentors FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "mentors_manage_own" ON public.mentors FOR ALL USING (user_id = auth.uid());

CREATE TABLE public.mentor_assignments (
  mentor_id uuid REFERENCES public.mentors(id) ON DELETE CASCADE,
  startup_id uuid REFERENCES public.startups(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES public.users(id),
  assigned_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (mentor_id, startup_id)
);
ALTER TABLE public.mentor_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assignments_read_all" ON public.mentor_assignments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "admin_manage_assignments" ON public.mentor_assignments FOR ALL USING (
  public.is_role(ARRAY['admin', 'manager'])
);

-------------------------------------------------
-- 7. sessions
-------------------------------------------------
CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES public.mentors(id) ON DELETE CASCADE,
  startup_id uuid REFERENCES public.startups(id) ON DELETE CASCADE,
  title text NOT NULL,
  scheduled_at timestamp with time zone NOT NULL,
  duration_minutes integer DEFAULT 60,
  notes text,
  feedback text,
  rating integer,
  status text DEFAULT 'scheduled',
  action_items text,
  linked_milestone_id uuid,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "session_read_participants" ON public.sessions FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM public.mentors WHERE id = sessions.mentor_id
    UNION
    SELECT founder_id FROM public.startups WHERE id = sessions.startup_id
  ) OR public.is_role(ARRAY['admin', 'manager'])
);
CREATE POLICY "mentor_manage_sessions" ON public.sessions FOR ALL USING (
  mentor_id IN (SELECT id FROM public.mentors WHERE user_id = auth.uid())
);

-------------------------------------------------
-- 8. milestones
-------------------------------------------------
CREATE TABLE public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES public.startups(id) ON DELETE CASCADE,
  title text NOT NULL,
  due_date date,
  status text DEFAULT 'pending',
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "founder_read_own_milestones" ON public.milestones FOR SELECT USING (
  startup_id IN (SELECT id FROM public.startups WHERE founder_id = auth.uid())
);
CREATE POLICY "all_read_milestones" ON public.milestones FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "founder_manage_own_milestones" ON public.milestones FOR ALL USING (
  startup_id IN (SELECT id FROM public.startups WHERE founder_id = auth.uid())
);

ALTER TABLE public.sessions ADD CONSTRAINT fk_linked_milestone FOREIGN KEY (linked_milestone_id) REFERENCES public.milestones(id) ON DELETE SET NULL;

-------------------------------------------------
-- 9. funding
-------------------------------------------------
CREATE TABLE public.funding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES public.startups(id) ON DELETE CASCADE,
  round text NOT NULL,
  amount numeric(15, 2) NOT NULL,
  source text,
  date date NOT NULL,
  status text DEFAULT 'received',
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.funding ENABLE ROW LEVEL SECURITY;
CREATE POLICY "funding_read_all" ON public.funding FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "founder_manage_funding" ON public.funding FOR ALL USING (
  startup_id IN (SELECT id FROM public.startups WHERE founder_id = auth.uid())
);

-------------------------------------------------
-- 10. events & 11. event_registrations
-------------------------------------------------
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES public.programs(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text,
  date timestamp with time zone NOT NULL,
  location text,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_read_all" ON public.events FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "manager_manage_events" ON public.events FOR ALL USING (
  public.is_role(ARRAY['admin', 'manager'])
);

CREATE TABLE public.event_registrations (
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (event_id, user_id)
);
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "registrations_read_all" ON public.event_registrations FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "register_self" ON public.event_registrations FOR INSERT WITH CHECK (user_id = auth.uid());

-------------------------------------------------
-- 12. reports
-------------------------------------------------
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES public.startups(id) ON DELETE CASCADE,
  generated_by uuid REFERENCES public.users(id),
  period text,
  data jsonb,
  milestone_completion_rate numeric(5, 2),
  funding_received_cumulative numeric(15, 2),
  session_count_period integer,
  period_start date,
  period_end date,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_read_authorized" ON public.reports FOR SELECT USING (
  startup_id IN (SELECT id FROM public.startups WHERE founder_id = auth.uid()) OR
  public.is_role(ARRAY['admin', 'manager', 'investor'])
);

-------------------------------------------------
-- 13. investor_interests
-------------------------------------------------
CREATE TABLE public.investor_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  startup_id uuid REFERENCES public.startups(id) ON DELETE CASCADE,
  signal_type text,
  note text,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.investor_interests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "investor_read_own" ON public.investor_interests FOR SELECT USING (investor_id = auth.uid());
CREATE POLICY "investor_manage_own" ON public.investor_interests FOR ALL USING (investor_id = auth.uid());

-------------------------------------------------
-- 14. application_scores
-------------------------------------------------
CREATE TABLE public.application_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES public.applications(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES public.users(id),
  team_score integer,
  market_score integer,
  traction_score integer,
  uniqueness_score integer,
  overall_comment text,
  scored_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.application_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_manager_manage_scores" ON public.application_scores FOR ALL USING (
  public.is_role(ARRAY['admin', 'manager'])
);

-------------------------------------------------
-- 15. admin_settings
-------------------------------------------------
CREATE TABLE public.admin_settings (
  key text PRIMARY KEY,
  value text,
  description text,
  updated_by uuid REFERENCES public.users(id),
  updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_read_all" ON public.admin_settings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "admin_manage_settings" ON public.admin_settings FOR ALL USING (
  public.is_role(ARRAY['admin'])
);

-------------------------------------------------
-- 16. broadcasts
-------------------------------------------------
CREATE TABLE public.broadcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES public.startups(id) ON DELETE CASCADE,
  founder_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  area text,
  content text NOT NULL,
  audience text DEFAULT 'All',
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "founder_manage_own_broadcasts" ON public.broadcasts FOR ALL USING (founder_id = auth.uid());
CREATE POLICY "all_read_broadcasts" ON public.broadcasts FOR SELECT USING (auth.uid() IS NOT NULL);

-- Additional startup fields for narrative
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS founded_date text;
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS elevator_pitch text;

-- Additional program fields for funding details
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS funding_amount text;
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS funding_type text DEFAULT 'Equity-free';

-- Additional startup fields for funding rounds
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS active_round_name text DEFAULT 'Seed Round';
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS funding_goal numeric(15, 2) DEFAULT 0;
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS round_status text DEFAULT 'active';

-------------------------------------------------
-- 17. documents
-------------------------------------------------
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES public.startups(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text,
  url text,
  size_bytes integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "founder_manage_own_documents" ON public.documents FOR ALL USING (
  startup_id IN (SELECT id FROM public.startups WHERE founder_id = auth.uid())
);
CREATE POLICY "all_read_documents" ON public.documents FOR SELECT USING (auth.uid() IS NOT NULL);

-------------------------------------------------
-- 18. equity
-------------------------------------------------
CREATE TABLE public.equity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES public.startups(id) ON DELETE CASCADE,
  stakeholder_name text NOT NULL,
  stakeholder_type text,
  equity_percentage numeric(5, 2) NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.equity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "founder_manage_own_equity" ON public.equity FOR ALL USING (
  startup_id IN (SELECT id FROM public.startups WHERE founder_id = auth.uid())
);
CREATE POLICY "all_read_equity" ON public.equity FOR SELECT USING (auth.uid() IS NOT NULL);

-------------------------------------------------
-- 19. Storage Policies for Avatars
-------------------------------------------------
-- Note: This assumes the 'avatars' bucket exists. 
-- In a real setup, you'd create it in the Supabase Dashboard.
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Ensure storage schema is available and bucket is created correctly
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public) 
  VALUES ('avatars', 'avatars', true) 
  ON CONFLICT (id) DO UPDATE SET public = true;
END $$;

-- Re-apply policies with more permissive checks for debugging if needed, 
-- but let's stick to the correct ones first.
-- Ensure the folder-based RLS is correct.
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
CREATE POLICY "Users can upload their own avatars" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
CREATE POLICY "Users can delete their own avatars" ON storage.objects FOR DELETE WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Simplify policies to use prefix matching instead of foldername
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
CREATE POLICY "Users can upload their own avatars" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND name LIKE auth.uid()::text || '%'
);

DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE WITH CHECK (
  bucket_id = 'avatars' 
  AND name LIKE auth.uid()::text || '%'
);

DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
CREATE POLICY "Users can delete their own avatars" ON storage.objects FOR DELETE WITH CHECK (
  bucket_id = 'avatars' 
  AND name LIKE auth.uid()::text || '%'
);

-- Investor read access to application_scores (Requirement 8.6)
CREATE POLICY "investor_read_scores"
ON public.application_scores FOR SELECT
USING (public.is_role(ARRAY['investor']));

-------------------------------------------------
-- 20. notifications
-------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  link text,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_notifications" ON public.notifications FOR ALL
  USING (user_id = auth.uid());

-------------------------------------------------
-- 21. Auth Trigger for Profile Creation
-------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'founder')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Additional RLS policies for programs
DROP POLICY IF EXISTS "admin_all_programs" ON public.programs;
CREATE POLICY "admin_all_programs" ON public.programs FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "manager_own_programs" ON public.programs;
CREATE POLICY "manager_own_programs" ON public.programs FOR ALL
  USING (auth.jwt() ->> 'role' = 'manager' AND manager_id = auth.uid());

DROP POLICY IF EXISTS "others_read_programs" ON public.programs;
CREATE POLICY "others_read_programs" ON public.programs FOR SELECT
  USING (true);

-- Additional RLS policies for applications
DROP POLICY IF EXISTS "admin_all_applications" ON public.applications;
CREATE POLICY "admin_all_applications" ON public.applications FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Investor read access for startups (Feature 4)
DROP POLICY IF EXISTS "investor_read_startups" ON public.startups;
CREATE POLICY "investor_read_startups" ON public.startups FOR SELECT
  USING (auth.jwt() ->> 'role' = 'investor' AND status = 'active');

-- Part of section 7 in the original file (approx line 126)
-- I will just remove the duplicate at the end and ensure the first one is correct.
