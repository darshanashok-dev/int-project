'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react'
import { createMentorAction } from './actions'

export default function NewMentorPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    expertise: '',
    bio: ''
  })

  const handleCreateMentor = async () => {
    setError(null)
    setIsSubmitting(true)

    const result = await createMentorAction(formData)

    if (!result.success) {
      setError(result.error || 'Failed to create mentor.')
      setIsSubmitting(false)
      return
    }

    router.push('/admin/mentors')
    router.refresh()
  }

  return (
    <div className="max-w-[760px] mx-auto py-8 space-y-6 animate-in fade-in duration-500">
      <Link
        href="/admin/mentors"
        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Mentors
      </Link>

      <div className="bg-white border border-border/50 rounded-3xl p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#202124] tracking-tight">Add Mentor</h1>
          <p className="text-muted-foreground mt-1">Create a mentor account and profile in one step.</p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>
        ) : null}

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(event) => setFormData((prev) => ({ ...prev, fullName: event.target.value }))}
            placeholder="e.g. Dr. Priya Sharma"
            className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="mentor@company.com"
            className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Expertise</label>
          <input
            type="text"
            value={formData.expertise}
            onChange={(event) => setFormData((prev) => ({ ...prev, expertise: event.target.value }))}
            placeholder="AI, B2B SaaS, Product Strategy"
            className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Bio</label>
          <textarea
            rows={4}
            value={formData.bio}
            onChange={(event) => setFormData((prev) => ({ ...prev, bio: event.target.value }))}
            placeholder="Short profile about this mentor."
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <button
          type="button"
          onClick={handleCreateMentor}
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          Create Mentor
        </button>
      </div>
    </div>
  )
}
