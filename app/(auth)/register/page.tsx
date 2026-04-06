'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/browser'

const ROLES = ['founder', 'mentor', 'investor', 'manager'] as const
type Role = typeof ROLES[number]

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('founder')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(`/${role}`)
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm p-8 bg-card rounded-2xl shadow-sm border border-border/50">
      <h1 className="text-2xl font-semibold text-foreground mb-1">Create account</h1>
      <p className="text-sm text-muted-foreground mb-6">Join Polaris today</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="you@example.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="role" className="text-sm font-medium text-foreground">Role</label>
          <select
            id="role"
            value={role}
            onChange={e => setRole(e.target.value as Role)}
            className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {ROLES.map(r => (
              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-full font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
