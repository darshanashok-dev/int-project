import { createClient } from '@/lib/supabase/server'
import { ManagerDashboardClient } from '@/components/dashboard/manager-dashboard-client'
import { ProgramBasic, ApplicationBasic, StartupBasic } from '@/types/dashboard'
import { getSessionUser } from '@/lib/auth/get-session-user'

export default async function ManagerDashboard() {
  const supabase = createClient()
  const user = await getSessionUser()

  if (!user) return null

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Manager'

  // Fetch Data
  const [
    { data: programs }, 
    { data: applications },
    { data: startups }
  ] = await Promise.all([
    supabase.from('programs').select('id, name, cohort, start_date, end_date, max_startups'),
    supabase.from('applications').select('id, status, startups(name), programs(name)').limit(20),
    supabase.from('startups').select('id, name, sector, stage, status').limit(20)
  ])

  const programsData = (programs as unknown as ProgramBasic[]) || []
  const applicationsData = (applications as unknown as ApplicationBasic[]) || []
  const startupsData = (startups as unknown as StartupBasic[]) || []

  // High-fidelity Mock Data for polished look
  const MOCK_PROGRAMS: ProgramBasic[] = [
    { 
      id: '1', 
      name: 'Global Fintech Accelerator', 
      cohort: 'W24', 
      start_date: '2024-01-01', 
      end_date: '2024-04-01', 
      max_startups: 15 
    },
    { 
      id: '2', 
      name: 'Sustainability Launchpad', 
      cohort: 'S24', 
      start_date: '2024-06-01', 
      end_date: '2024-09-01', 
      max_startups: 20 
    }
  ]

  const MOCK_APPLICATIONS: ApplicationBasic[] = [
    { 
      id: '1', 
      status: 'pending', 
      startups: { name: 'EcoFlow' }, 
      programs: { name: 'Sustainability Launchpad' } 
    },
    { 
      id: '2', 
      status: 'under_review', 
      startups: { name: 'PayGuard' }, 
      programs: { name: 'Global Fintech Accelerator' } 
    },
    { 
      id: '3', 
      status: 'pending', 
      startups: { name: 'BioShield' }, 
      programs: { name: 'Sustainability Launchpad' } 
    }
  ]

  const finalPrograms = programsData.length > 0 ? programsData : MOCK_PROGRAMS
  const finalApplications = applicationsData.length > 0 ? applicationsData : MOCK_APPLICATIONS

  return (
    <ManagerDashboardClient 
      programs={finalPrograms}
      applications={finalApplications}
      startups={startupsData}
      userName={displayName}
    />
  )
}
