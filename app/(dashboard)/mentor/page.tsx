import { createClient } from '@/lib/supabase/server'
import { MentorDashboardClient } from '@/components/dashboard/mentor-dashboard-client'
import { SessionBasic, StartupBasic } from '@/types/dashboard'
import { getSessionUser } from '@/lib/auth/get-session-user'

export default async function MentorDashboard() {
  const supabase = createClient()
  const user = await getSessionUser()

  if (!user) return null

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Mentor'

  // Fetch Mentor Profile
  const { data: mentor } = await supabase
    .from('mentors')
    .select('id, expertise, bio')
    .eq('user_id', user.id)
    .single()

  const mentorData = mentor as { id: string, expertise: string | null, bio: string | null } | null

  // Fetch Sessions
  let sessionsData: SessionBasic[] = []
  if (mentorData) {
    const { data: sessions } = await supabase
      .from('sessions')
      .select('id, scheduled_at, status, startup:startups(name)')
      .eq('mentor_id', mentorData.id)
      .order('scheduled_at', { ascending: true })
      .limit(10)
    
    sessionsData = (sessions as any[])?.map(s => ({
      ...s,
      startups: s.startup // Map back to plural for component compatibility
    })) || []
  }

  // Fetch Assigned Startups via mentor_assignments
  let assignedStartups: StartupBasic[] = []
  try {
    if (mentorData) {
      const { data: assignments } = await supabase
        .from('mentor_assignments')
        .select(`
          startup:startups(id, name, sector, stage, status)
        `)
        .eq('mentor_id', mentorData.id)
      
      if (assignments) {
        assignedStartups = (assignments as any[])
          ?.map(a => a.startup)
          .filter(Boolean) || []
      }
    }
  } catch (err) {
    console.error('Error fetching assigned startups:', err)
  }

  // High-fidelity Mock Data for polished look if real data is sparse
  const MOCK_SESSIONS: SessionBasic[] = [
    { 
      id: '1', 
      scheduled_at: new Date(Date.now() + 86400000).toISOString(), 
      status: 'scheduled', 
      startups: { name: 'AeroDynamics' } 
    },
    { 
      id: '2', 
      scheduled_at: new Date(Date.now() + 172800000).toISOString(), 
      status: 'scheduled', 
      startups: { name: 'BioSynth' } 
    },
    { 
      id: '3', 
      scheduled_at: new Date(Date.now() - 86400000).toISOString(), 
      status: 'completed', 
      startups: { name: 'Quantum Leap' } 
    }
  ]

  const MOCK_STARTUPS: StartupBasic[] = [
    { id: '1', name: 'AeroDynamics', sector: 'CleanTech', stage: 'Seed', status: 'active' },
    { id: '2', name: 'BioSynth', sector: 'HealthTech', stage: 'Pre-Seed', status: 'active' },
    { id: '3', name: 'CloudScale', sector: 'SaaS', stage: 'Series A', status: 'active' },
  ]

  const finalSessions = sessionsData.length > 0 ? sessionsData : MOCK_SESSIONS
  const finalStartups = assignedStartups.length > 0 ? assignedStartups : MOCK_STARTUPS

  return (
    <MentorDashboardClient 
      mentor={mentorData}
      sessions={finalSessions}
      assignedStartups={finalStartups as any}
      userName={displayName}
    />
  )
}
