-- Polaris Supabase Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Roles Enum (though we get role from auth.users() metadata, we can type cast if needed)
-- We'll store role in user_metadata, but we fetch it via auth constraints.

-------------------------------------------------
-- 1. users
-------------------------------------------------
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_all" ON public.users FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "users_update_self" ON public.users FOR UPDATE USING (auth.uid() = id);

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
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'role')) IN ('admin', 'manager')
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
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'role')) IN ('admin', 'manager')
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
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'role')) IN ('admin', 'manager')
);

-------------------------------------------------
-- 7. sessions
-------------------------------------------------
CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES public.mentors(id) ON DELETE CASCADE,
  startup_id uuid REFERENCES public.startups(id) ON DELETE CASCADE,
  scheduled_at timestamp with time zone NOT NULL,
  notes text,
  feedback text,
  rating integer,
  status text DEFAULT 'scheduled',
  action_items text,
  linked_milestone_id uuid, -- Reference defined later
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "session_read_participants" ON public.sessions FOR SELECT USING (
  auth.uid() IN (
    SELECT user_id FROM public.mentors WHERE id = sessions.mentor_id
    UNION
    SELECT founder_id FROM public.startups WHERE id = sessions.startup_id
  ) OR (SELECT (auth.jwt() -> 'user_metadata' ->> 'role')) IN ('admin', 'manager')
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
  type text NOT NULL,
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
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'role')) IN ('admin', 'manager')
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
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'role')) IN ('admin', 'manager', 'investor')
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
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'role')) IN ('admin', 'manager')
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
  (SELECT (auth.jwt() -> 'user_metadata' ->> 'role')) = 'admin'
);
