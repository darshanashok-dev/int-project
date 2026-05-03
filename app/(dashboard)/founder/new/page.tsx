'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { 
  Rocket, 
  ArrowRight, 
  ChevronLeft,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

export default function NewVenturePage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sector: 'SaaS',
    stage: 'pre-seed'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('startups') as any)
      .insert({
        founder_id: user.id,
        name: formData.name,
        sector: formData.sector,
        stage: formData.stage,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      alert(error.message)
    } else {
      router.push('/founder/startup')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Link href="/founder" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-black mb-8 transition-colors group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="bg-card border border-border rounded-[2.5rem] p-12 shadow-xl">
        <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg">
          <Rocket className="w-8 h-8 fill-current" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-foreground mb-4">Launch New Venture</h1>
        <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
          Ready to build something world-changing? Let&apos;s start with the foundations of your new venture.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 px-1">Startup Venture Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Aether Dynamics"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full h-14 px-6 bg-secondary rounded-2xl border-none font-bold text-foreground focus:ring-2 focus:ring-black/5 text-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 px-1">Core Sector</label>
              <select 
                value={formData.sector}
                onChange={e => setFormData({...formData, sector: e.target.value})}
                className="w-full h-14 px-6 bg-secondary rounded-2xl border-none font-bold text-foreground focus:ring-2 focus:ring-black/5 appearance-none"
              >
                <option value="SaaS">SaaS</option>
                <option value="Fintech">Fintech</option>
                <option value="Healthtech">Healthtech</option>
                <option value="AI">AI/ML</option>
                <option value="Energy">Energy</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 px-1">Current Stage</label>
              <select 
                value={formData.stage}
                onChange={e => setFormData({...formData, stage: e.target.value})}
                className="w-full h-14 px-6 bg-secondary rounded-2xl border-none font-bold text-foreground focus:ring-2 focus:ring-black/5 appearance-none"
              >
                <option value="pre-seed">Pre-Seed</option>
                <option value="seed">Seed</option>
                <option value="series-a">Series A</option>
                <option value="series-b">Series B+</option>
              </select>
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-black text-white rounded-3xl font-black text-lg shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Initialize Venture
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <p className="text-center mt-8 text-xs font-medium text-muted-foreground">
        By continuing, you agree to create a new organization profile on the Polaris Platform.
      </p>
    </div>
  )
}
