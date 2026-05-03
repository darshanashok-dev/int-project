'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  UserPlus, 
  ArrowLeft, 
  Mail, 
  User, 
  Shield, 
  Briefcase,
  Landmark,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { createUserAction } from './actions'

export default function NewUserPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'founder'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      const result = await createUserAction(formData)
      
      if (result.success) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push('/admin/users')
          router.refresh()
        }, 2000)
      } else {
        setError(result.error || 'Failed to create user')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-[600px] mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link 
        href="/admin/users" 
        className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Users
      </Link>

      <div className="bg-card border border-border/50 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-[5rem] -mr-10 -mt-10 opacity-50" />
        
        <div className="relative z-10 mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-200">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Add New User</h1>
          <p className="text-muted-foreground mt-2 font-medium">Provision a new account with specific platform permissions.</p>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">User Created Successfully</h2>
            <p className="text-muted-foreground mt-2">The new user has been added to the system.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold animate-in fade-in zoom-in duration-300">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Alex Rivera"
                  className="w-full pl-12 pr-4 py-4 bg-secondary border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-card transition-all font-medium"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                <input 
                  required
                  type="email" 
                  placeholder="alex@company.com"
                  className="w-full pl-12 pr-4 py-4 bg-secondary border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-card transition-all font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground ml-1 text-center">Assign Platform Role</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { id: 'founder', label: 'Founder', icon: User },
                  { id: 'mentor', label: 'Mentor', icon: UserPlus },
                  { id: 'manager', label: 'Manager', icon: Briefcase },
                  { id: 'investor', label: 'Investor', icon: Landmark },
                  { id: 'admin', label: 'Admin', icon: Shield },
                ].map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.id })}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-2",
                      formData.role === role.id 
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100" 
                        : "bg-card border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-500/10/30"
                    )}
                  >
                    <role.icon className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.1em] hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Provisioning...
                  </>
                ) : (
                  'Create Platform User'
                )}
              </button>
              <p className="text-center text-[10px] text-muted-foreground mt-4 font-bold uppercase tracking-widest">
                An invitation will be sent automatically
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
