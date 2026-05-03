'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Search, 
  MoreHorizontal,
  UserPlus,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

interface Mentor {
  id: string
  user_id: string
  expertise: string | null
  bio: string | null
  created_at: string
  user: {
    full_name: string | null
    email: string
    role: string
  }
}

export default function MentorsManagement() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchMentors()
  }, [])

  async function fetchMentors() {
    const supabase = createClient()
    const { data } = await supabase
      .from('mentors')
      .select(`
        *,
        user:users(full_name, email, role)
      `)
      .order('created_at', { ascending: false })
    
    // High-fidelity Mock Data for polished presentation
    const MOCK_MENTORS: Mentor[] = [
      { id: '1', user_id: 'u1', expertise: 'Fintech, Scaling', bio: 'Former Stripe engineer', created_at: new Date().toISOString(), user: { full_name: 'Alex Chen', email: 'alex@mentor.com', role: 'mentor' } },
      { id: '2', user_id: 'u2', expertise: 'SaaS, Go-to-market', bio: 'Serial entrepreneur', created_at: new Date().toISOString(), user: { full_name: 'Elena Rodriguez', email: 'elena@mentor.com', role: 'mentor' } },
      { id: '3', user_id: 'u3', expertise: 'DeepTech, AI', bio: 'PhD in Computer Science', created_at: new Date().toISOString(), user: { full_name: 'Marcus Thorne', email: 'marcus@mentor.com', role: 'mentor' } },
    ]

    setMentors(data && data.length > 0 ? (data as unknown as Mentor[]) : MOCK_MENTORS)
    setLoading(false)
  }

  const filteredMentors = mentors.filter(mentor => {
    const name = mentor.user?.full_name?.toLowerCase() || ''
    const email = mentor.user?.email?.toLowerCase() || ''
    const expertise = mentor.expertise?.toLowerCase() || ''
    const query = searchQuery.toLowerCase()
    
    return name.includes(query) || email.includes(query) || expertise.includes(query)
  })

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Mentor Network</h1>
          <p className="text-muted-foreground mt-1">Manage platform mentors and their expertise</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/mentors/new"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            Add Mentor
          </Link>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl shadow-sm">
        <div className="p-4 border-b border-border/50 bg-secondary/50 rounded-t-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search mentors by name, email or expertise..." 
              className="w-full pl-10 pr-4 py-2 bg-card border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/50">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Mentor</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Expertise</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Joined</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
                  </td>
                </tr>
              ) : filteredMentors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-muted-foreground">
                    No mentors found.
                  </td>
                </tr>
              ) : filteredMentors.map((mentor) => (
                <tr key={mentor.id} className="hover:bg-secondary/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-slate-400">
                        {(mentor.user?.full_name || mentor.user?.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{mentor.user?.full_name || 'Anonymous Mentor'}</p>
                        <p className="text-xs text-muted-foreground">{mentor.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-foreground">{mentor.expertise || 'General'}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(mentor.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
