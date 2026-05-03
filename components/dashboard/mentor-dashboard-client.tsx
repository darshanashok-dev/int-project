'use client'

import { 
  Users, 
  Calendar, 
  Briefcase, 
  ArrowRight, 
  Star,
  Clock,
  CheckCircle2,
  ExternalLink,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface MentorDashboardClientProps {
  mentor: {
    id: string
    expertise: string | null
    bio: string | null
  } | null
  sessions: {
    id: string
    scheduled_at: string
    status: string | null
    startups: { name: string } | null
  }[]
  assignedStartups: {
    id: string
    name: string
    sector: string | null
    stage: string | null
  }[]
  userName: string
}

export function MentorDashboardClient({ 
  mentor, 
  sessions, 
  assignedStartups,
  userName
}: MentorDashboardClientProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled' || s.status === 'pending')
  const completedSessionsCount = sessions.filter(s => s.status === 'completed').length

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Hello, {userName}
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            You have {upcomingSessions.length} sessions on your horizon.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500/100 rounded-full animate-pulse" />
            System Active
          </div>
          <Link 
            href="/mentor/sessions"
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4" />
            Schedule Session
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm group hover:border-black/5 transition-all">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Assigned Ventures</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-foreground">{assignedStartups.length}</h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-lg">Portfolio</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <Briefcase className="w-3 h-3" />
            Active Mentorships
          </div>
        </div>

        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm group hover:border-black/5 transition-all">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Upcoming Sessions</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-foreground">{upcomingSessions.length}</h2>
            <span className="text-xs font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-lg">Pending</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <Clock className="w-3 h-3" />
            Next 7 Days
          </div>
        </div>

        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm group hover:border-black/5 transition-all">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Session Velocity</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-5xl font-black text-foreground">{completedSessionsCount}</h2>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded-lg">Completed</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <CheckCircle2 className="w-3 h-3 text-indigo-500" />
            All-time impact
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upcoming Sessions */}
        <div className="col-span-1 lg:col-span-7 bg-card border border-border rounded-[2.5rem] p-6 md:p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl md:text-2xl font-black text-foreground">Session Schedule</h3>
            <Link href="/mentor/sessions" className="text-xs md:text-sm font-bold text-muted-foreground hover:text-black transition-colors flex items-center gap-1 group">
              View Calendar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingSessions.length > 0 ? upcomingSessions.map((session) => (
              <div 
                key={session.id}
                className="flex items-center gap-6 p-6 rounded-[2rem] border border-[#f1f3f4] hover:border-black/10 hover:bg-background transition-all group"
              >
                <div className="w-14 h-14 bg-card rounded-2xl border border-[#f1f3f4] flex flex-col items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                  <span className="text-[10px] font-black text-muted-foreground uppercase">
                    {new Date(session.scheduled_at).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-xl font-black text-foreground">
                    {new Date(session.scheduled_at).toLocaleDateString('en-US', { day: 'numeric' })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-foreground truncate">
                    {session.startups?.name || 'Venture Advisory'}
                  </h4>
                  <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(session.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-tighter">
                      Virtual Room
                    </span>
                  </div>
                </div>
                <button className="px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100 shadow-xl shadow-black/10">
                  Join Room
                </button>
              </div>
            )) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-secondary text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-gray-400">No sessions scheduled.</p>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio & Profile */}
        <div className="col-span-1 lg:col-span-5 space-y-8">
          
          {/* Profile Card */}
          <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div className="w-20 h-20 bg-black rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-black/20">
                {userName.charAt(0)}
              </div>
              <button className="p-3 hover:bg-secondary rounded-2xl transition-colors">
                <ExternalLink className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <h3 className="text-2xl font-black text-foreground mb-1">{userName}</h3>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Expert Mentor</p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {(mentor?.expertise?.split(',') || ['Strategic Growth', 'Technical Architecture', 'Venture Ops']).map((exp, i) => (
                <span key={i} className="px-3 py-1 bg-secondary text-[10px] font-black text-foreground rounded-lg uppercase tracking-wider">
                  {exp.trim()}
                </span>
              ))}
            </div>

            <p className="text-sm font-medium text-muted-foreground leading-relaxed italic mb-8">
              "{mentor?.bio || 'Dedicated to scaling the next generation of architectural ventures through high-fidelity mentorship and strategic guidance.'}"
            </p>

            <Link 
              href="/mentor/settings/profile"
              className="w-full py-4 bg-secondary text-foreground rounded-2xl font-black text-xs hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Update Credentials
            </Link>
          </div>

          {/* Assigned Startups */}
          <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-foreground">Active Portolio</h3>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-secondary px-2 py-1 rounded-md">
                {assignedStartups.length} Ventures
              </span>
            </div>
            
            <div className="space-y-3">
              {assignedStartups.length > 0 ? assignedStartups.slice(0, 4).map((startup) => (
                <div key={startup.id} className="flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-[#f1f3f4] hover:bg-background transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-card border border-[#f1f3f4] rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <Briefcase className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-foreground">{startup.name}</h4>
                      <p className="text-[10px] font-medium text-muted-foreground">{startup.sector}</p>
                    </div>
                  </div>
                  <button className="p-2 text-muted-foreground hover:text-black">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              )) : (
                <p className="text-xs font-bold text-gray-400 text-center py-4">No startups assigned.</p>
              )}
            </div>
            
            <Link 
              href="/mentor/startups"
              className="mt-6 w-full py-3 text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-black transition-colors"
            >
              View Full Portfolio
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
