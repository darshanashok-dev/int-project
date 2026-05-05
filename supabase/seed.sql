-- Seed data for Polaris

-- Users (All passwords would be 'Password123!' in Auth)
INSERT INTO public.users (id, email, full_name, role) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@rnsit.ac.in', 'System Admin', 'admin'),
('00000000-0000-0000-0000-000000000002', 'founder1@startup.com', 'Alice Chen', 'founder'),
('00000000-0000-0000-0000-000000000003', 'founder2@startup.com', 'Bob Smith', 'founder'),
('00000000-0000-0000-0000-000000000004', 'mentor1@expert.com', 'Dr. Sarah Wilson', 'mentor'),
('00000000-0000-0000-0000-000000000005', 'mentor2@expert.com', 'John Doe', 'mentor'),
('00000000-0000-0000-0000-000000000006', 'investor@vc.com', 'Mark Venture', 'investor'),
('00000000-0000-0000-0000-000000000007', 'manager@rnsit.ac.in', 'Jane Manager', 'manager');

-- Startups
INSERT INTO public.startups (id, founder_id, name, sector, stage, strategy_summary, target_market, revenue_model, competitive_advantage) VALUES
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002', 'EcoTrack', 'Sustainability', 'mvp', 'Building a carbon footprint tracker for SMEs using IoT sensors.', 'SMEs in South Asia', 'SaaS subscription', 'Proprietary sensor data processing'),
('11111111-1111-1111-1111-111111111112', '00000000-0000-0000-0000-000000000003', 'HealthLink', 'HealthTech', 'early_traction', 'Connecting rural clinics with specialist doctors via low-bandwidth video.', 'Rural India', 'Per-consultation fee', 'Optimized video protocol for 2G/3G');

-- Programs
INSERT INTO public.programs (id, name, cohort, start_date, end_date, manager_id, funding_amount, funding_type) VALUES
('22222222-2222-2222-2222-222222222222', 'Summer Cohort 2026', '2026-A', '2026-06-01', '2026-08-31', '00000000-0000-0000-0000-000000000007', '₹10,00,000', 'Equity-free Grant');

-- Milestones (3 per startup)
INSERT INTO public.milestones (startup_id, title, due_date, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Complete IoT Prototype', '2026-06-15', 'completed'),
('11111111-1111-1111-1111-111111111111', 'Pilot with 5 SMEs', '2026-07-20', 'in_progress'),
('11111111-1111-1111-1111-111111111111', 'Seed Round Pitch Deck', '2026-08-10', 'pending'),
('11111111-1111-1111-1111-111111111112', 'V1.0 Mobile App Launch', '2026-06-10', 'completed'),
('11111111-1111-1111-1111-111111111112', 'Onboard 50 Clinics', '2026-07-15', 'in_progress'),
('11111111-1111-1111-1111-111111111112', 'HIPAA Compliance Audit', '2026-08-01', 'pending');

-- Mentors (detailed info)
INSERT INTO public.mentors (user_id, expertise, bio) VALUES
('00000000-0000-0000-0000-000000000004', 'Product Management, Sustainability', 'Former PM at Google with 10 years experience in green tech.'),
('00000000-0000-0000-0000-000000000005', 'Healthcare Compliance, Scaling', 'Successfully exited 2 HealthTech startups in the UK.');

-- Mentor Assignments
INSERT INTO public.mentor_assignments (mentor_id, startup_id, assigned_by) VALUES
((SELECT id FROM public.mentors WHERE user_id = '00000000-0000-0000-0000-000000000004'), '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000007'),
((SELECT id FROM public.mentors WHERE user_id = '00000000-0000-0000-0000-000000000005'), '11111111-1111-1111-1111-111111111112', '00000000-0000-0000-0000-000000000007');

-- Mentor Sessions (2 sessions)
INSERT INTO public.sessions (mentor_id, startup_id, scheduled_at, status, notes) VALUES
((SELECT id FROM public.mentors WHERE user_id = '00000000-0000-0000-0000-000000000004'), '11111111-1111-1111-1111-111111111111', '2026-05-10 10:00:00+00', 'completed', 'Discussed sensor accuracy and cloud costs.'),
((SELECT id FROM public.mentors WHERE user_id = '00000000-0000-0000-0000-000000000005'), '11111111-1111-1111-1111-111111111112', '2026-05-12 14:00:00+00', 'scheduled', 'Initial meeting to discuss compliance roadmap.');

-- Funding (1 entry per startup)
INSERT INTO public.funding (startup_id, round, amount, source, date, status) VALUES
('11111111-1111-1111-1111-111111111111', 'Pre-Seed', 50000.00, 'Angel Investor', '2026-01-15', 'received'),
('11111111-1111-1111-1111-111111111112', 'Seed', 250000.00, 'BlueChip VC', '2026-03-20', 'received');
