'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/browser'
import { ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const ROLES = ['Founder', 'Admin', 'Mentor', 'Investor', 'Manager']

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('Founder')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
      // Mock login logic
      document.cookie = 'mock-auth=true; path=/'
      document.cookie = `mock-role=${selectedRole.toLowerCase()}; path=/`
      
      // Artificial delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800))
      
      router.push(`/${selectedRole.toLowerCase()}`)
      router.refresh()
      return
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder.supabase.co')) {
      setError('Connection configuration error: Supabase environment variables are missing or configured as placeholders. Please check your environment setup.')
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    const role = data.user?.user_metadata?.role || selectedRole.toLowerCase()
    router.push(`/${role}`)
    router.refresh()
  }

  const handleForgotPassword = () => {
    alert('Password reset link has been sent to your email (Demo Toast)')
  }

  return (
    <div className="w-full max-w-[480px] p-12 bg-card rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white relative z-10 transition-all">
      <div className="space-y-1 mb-10">
        <h2 className="text-4xl font-extrabold text-foreground tracking-tight">Sign In</h2>
        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
          Access your incubation metrics and project architecture.
        </p>
      </div>

      <div className="mb-10">
        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 px-1">
          Select Workspace Role
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={cn(
                "py-3 rounded-xl text-xs font-bold transition-all border",
                selectedRole === role 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-black/10" 
                  : "bg-secondary text-muted-foreground border-transparent hover:bg-gray-200"
              )}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full h-14 px-6 rounded-2xl bg-secondary border-none font-bold text-foreground placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 transition-all text-sm"
            placeholder="name@company.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label htmlFor="password" className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Password
            </label>
            <button 
              type="button" 
              onClick={handleForgotPassword}
              className="text-[10px] font-black text-foreground hover:underline uppercase tracking-widest"
            >
              Forgot password?
            </button>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full h-14 px-6 rounded-2xl bg-secondary border-none font-bold text-foreground placeholder:text-gray-400 focus:ring-2 focus:ring-black/5 transition-all text-sm"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm font-bold text-destructive px-1">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-16 bg-primary text-primary-foreground rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-black/90 transition-all shadow-xl shadow-black/10 disabled:opacity-50 group active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Sign In to Polaris
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
        <p className="text-xs font-bold text-muted-foreground">New to the platform?</p>
        <Link 
          href="/register" 
          className="w-full h-12 flex items-center justify-center rounded-2xl bg-secondary text-primary font-black text-xs hover:bg-black hover:text-white transition-all border border-transparent"
        >
          Create Account
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 space-y-3 relative z-10">
        <p className="text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
          Quick Demo Credentials
        </p>
        <div className="grid grid-cols-5 gap-2">
          {[
            { role: 'Admin',    email: 'admin@polaris.com',    pass: 'admin123',    cls: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600' },
            { role: 'Founder',  email: 'founder@polaris.com',  pass: 'founder123',  cls: 'bg-violet-50 text-violet-600 border-violet-100 hover:bg-violet-600 hover:text-white hover:border-violet-600' },
            { role: 'Mentor',   email: 'mentor@polaris.com',   pass: 'mentor123',   cls: 'bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-600 hover:text-white hover:border-sky-600' },
            { role: 'Investor', email: 'investor@polaris.com', pass: 'investor123', cls: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white hover:border-emerald-600' },
            { role: 'Manager',  email: 'manager@polaris.com',  pass: 'manager123',  cls: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-600 hover:text-white hover:border-amber-600' },
          ].map(({ role, email, pass, cls }) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                setEmail(email)
                setPassword(pass)
                setSelectedRole(role)
              }}
              className={`py-2.5 rounded-xl text-[10px] font-bold border transition-all ${cls}`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
