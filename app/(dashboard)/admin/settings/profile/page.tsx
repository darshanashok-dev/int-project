'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, Save, Shield, User as UserIcon } from 'lucide-react'

interface AdminUserProfile {
  id: string
  email?: string
  app_metadata?: {
    role?: string
  }
  user_metadata?: {
    full_name?: string
    bio?: string
    phone?: string
    department?: string
  }
  created_at?: string
  last_sign_in_at?: string | null
}

export default function AdminProfilePage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [profile, setProfile] = useState<AdminUserProfile | null>(null)

  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  const [department, setDepartment] = useState('')

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      setError(null)

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError(userError?.message || 'Unable to load profile.')
        setLoading(false)
        return
      }

      setProfile(user)
      setFullName(user.user_metadata?.full_name || '')
      setBio(user.user_metadata?.bio || '')
      setPhone(user.user_metadata?.phone || '')
      setDepartment(user.user_metadata?.department || '')
      setLoading(false)
    }

    loadProfile()
  }, [supabase])

  const displayRole = useMemo(() => {
    const role = profile?.app_metadata?.role || 'admin'
    return role.charAt(0).toUpperCase() + role.slice(1)
  }, [profile])

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    const { data, error: updateError } = await supabase.auth.updateUser({
      data: {
        ...profile.user_metadata,
        full_name: fullName.trim(),
        bio: bio.trim(),
        phone: phone.trim(),
        department: department.trim()
      }
    })

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    if (data.user) {
      setProfile(data.user)
    }

    setSuccess('Profile settings saved successfully.')
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="bg-white border border-border/50 rounded-2xl p-12 text-center shadow-sm">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
          <p className="text-muted-foreground mt-3 font-medium">Loading admin profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-[#202124] tracking-tight">Admin Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal admin account settings</p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      ) : null}

      {success ? (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4">
          <p className="text-sm font-semibold text-emerald-700">{success}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-border/50 rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-[#202124]">Profile Settings</h2>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Enter full name"
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Bio</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Write a short administrative bio..."
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+91..."
                className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Department</label>
              <input
                type="text"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                placeholder="Platform Operations"
                className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-black/90 transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Profile
          </button>
        </div>

        <div className="bg-white border border-border/50 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-[#202124]">Account Snapshot</h3>

          <div className="space-y-3">
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Email</p>
              <p className="text-sm font-bold text-[#202124] mt-1 flex items-center gap-2 break-all">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                {profile?.email || 'N/A'}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Role</p>
              <p className="text-sm font-bold text-[#202124] mt-1 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                {displayRole}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Last Sign In</p>
              <p className="text-sm font-bold text-[#202124] mt-1">
                {profile?.last_sign_in_at ? new Date(profile.last_sign_in_at).toLocaleString() : 'Never'}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">User ID</p>
              <p className="text-xs font-bold text-[#202124] mt-1 break-all">{profile?.id || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
