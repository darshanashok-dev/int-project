'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/browser'
import { Loader2, ArrowRight } from 'lucide-react'

const ROLES = ['founder', 'admin', 'mentor', 'investor', 'manager'] as const
type Role = typeof ROLES[number]

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('founder')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { role },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Check if user is created but needs email confirmation
    if (data.user && data.session === null) {
      setSuccess(true)
      setLoading(false)
      return
    }

    if (data.user) {
      router.push(`/${role}`)
      router.refresh()
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-[480px] p-12 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white text-center">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <ArrowRight className="w-10 h-10 rotate-[-45deg]" />
        </div>
        <h2 className="text-3xl font-extrabold text-[#202124] mb-4">Check your email</h2>
        <p className="text-muted-foreground font-medium leading-relaxed">
          We&apos;ve sent a confirmation link to <span className="font-bold text-[#202124]">{email}</span>. Click it to activate your account.
        </p>
        <Link 
          href="/login" 
          className="mt-10 inline-block px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-black text-sm hover:bg-black/90 transition-all"
        >
          Return to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[480px] p-12 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white relative z-10 transition-all animate-in fade-in duration-500">
      <div className="space-y-1 mb-10">
        <h2 className="text-4xl font-extrabold text-[#202124] tracking-tight text-center">Join Polaris</h2>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed text-center py-2 px-4 max-w-[320px] mx-auto">
          Scale your venture with the next generation of architectural incubation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
            Institutional Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full h-14 px-6 rounded-2xl bg-secondary border-none font-bold text-[#202124] placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 transition-all text-sm"
            placeholder="founder@venture.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
            Access Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full h-14 px-6 rounded-2xl bg-secondary border-none font-bold text-[#202124] placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 transition-all text-sm"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
            Strategic Persona
          </label>
          <select
            id="role"
            value={role}
            onChange={e => setRole(e.target.value as Role)}
            className="w-full h-14 px-6 rounded-2xl bg-secondary border-none font-bold text-[#202124] focus:ring-2 focus:ring-black/5 transition-all text-sm appearance-none"
          >
            {ROLES.map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-xs font-bold text-destructive px-1 mt-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-16 mt-6 bg-primary text-primary-foreground rounded-2xl font-black text-sm flex items-center justify-center hover:bg-black/90 transition-all shadow-xl shadow-black/10 disabled:opacity-50 active:scale-[0.98] group"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Initialize Account
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
        Already registered?{' '}
        <Link href="/login" className="text-[#202124] font-bold hover:underline">Access Console</Link>
      </p>
    </div>
  )
}
