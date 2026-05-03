'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User as UserIcon, Mail, Shield, Save, Loader2, Camera } from 'lucide-react'
import Image from 'next/image'

interface UserProfile {
  email?: string
  user_metadata?: {
    full_name?: string
    bio?: string
    avatar_url?: string | null
  }
}

export default function ProfileIdentityPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setFullName(user.user_metadata?.full_name || '')
        setBio(user.user_metadata?.bio || '')
        setAvatarUrl(user.user_metadata?.avatar_url || null)
      }
      setLoading(false)
    }
    loadUser()
  }, [supabase])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName,
          bio: bio,
          avatar_url: avatarUrl
        }
      })
      if (error) throw error
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      console.error('Error updating profile:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return
      
      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const filePath = `${user.id}-${Math.random()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setAvatarUrl(publicUrl)
      
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error: unknown) {
      console.error('Error uploading avatar:', error)
      const message = error instanceof Error ? error.message : 'Unknown error'
      alert(`Error uploading avatar: ${message}`)
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#202124] text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/100 rounded-full flex items-center justify-center">
              <Save className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">Profile Updated</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Identity synced successfully</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Profile Identity</h1>
        <p className="text-muted-foreground mt-2 font-medium">Manage your public founder persona and platform identity.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1 opacity-70">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full h-12 pl-12 pr-4 bg-secondary rounded-xl border-none font-bold text-sm focus:ring-2 focus:ring-black/5 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1 opacity-70">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className="w-full h-12 pl-12 pr-4 bg-secondary rounded-xl border-none font-bold text-sm opacity-50 cursor-not-allowed"
                />
              </div>
              <p className="mt-2 text-[10px] font-bold text-muted-foreground flex items-center gap-1 px-1">
                <Shield className="w-3 h-3" />
                Primary authentication email cannot be changed here.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1 opacity-70">Founder Bio</label>
              <textarea 
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A brief summary of your background and vision..."
                className="w-full p-4 bg-secondary rounded-xl border-none font-bold text-sm focus:ring-2 focus:ring-black/5 resize-none transition-all"
              />
            </div>

            <div className="pt-4">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Profile Identity
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm text-center space-y-6">
            <div className="relative group">
              <div className="w-32 h-32 mx-auto bg-secondary rounded-[2.5rem] flex items-center justify-center text-foreground text-4xl font-black overflow-hidden border-4 border-white shadow-xl">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  (fullName || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <label className="absolute bottom-0 right-8 w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-lg border-2 border-white">
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{fullName || 'Profile Preview'}</h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Founder Role</p>
            </div>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
              {bio || 'Your public bio will appear here once you provide a summary of your vision.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
