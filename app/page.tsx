import Link from 'next/link'
import { 
  ShieldCheck, 
  Rocket, 
  Users, 
  TrendingUp, 
  CalendarDays,
  ArrowRight
} from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden relative selection:bg-indigo-150 selection:text-indigo-900">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2.5">
            <Rocket className="w-5 h-5 text-indigo-600 animate-pulse" />
            <span className="font-extrabold text-lg tracking-tight">Polaris</span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-black rounded-xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-6">
        <section className="pt-24 pb-20 text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-8">
            Startup Incubation,<br />
            <span className="text-indigo-600">Streamlined.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-medium leading-relaxed mb-12">
            Polaris is the all-in-one platform for managing cohorts, mentors, founders, investors, and program managers — built for college incubation cells.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white text-base font-black rounded-2xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              Sign In <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground text-base font-black rounded-2xl hover:bg-secondary/80 transition-all active:scale-95 text-center"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Five Role Cards Section */}
        <section id="features" className="py-24 w-full max-w-6xl mx-auto border-t border-slate-200 dark:border-white/10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Five Roles, One Unified Hub</h2>
            <p className="text-muted-foreground max-w-xl mx-auto font-medium">A unified operational control center specialized for every member of your network.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Admin */}
            <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Admin</h3>
              <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                <li className="flex items-center gap-2">⏱ Review applications</li>
                <li className="flex items-center gap-2">👥 Assign mentors</li>
                <li className="flex items-center gap-2">📊 Full analytics</li>
                <li className="flex items-center gap-2">🗂 Manage cohorts</li>
              </ul>
            </div>

            {/* Card 2: Founder */}
            <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Founder</h3>
              <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                <li className="flex items-center gap-2">🎯 Track milestones</li>
                <li className="flex items-center gap-2">💰 View funding</li>
                <li className="flex items-center gap-2">📁 Upload pitch decks</li>
                <li className="flex items-center gap-2">🗓 Log sessions</li>
              </ul>
            </div>

            {/* Card 3: Mentor */}
            <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Mentor</h3>
              <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                <li className="flex items-center gap-2">🤝 View assigned startups</li>
                <li className="flex items-center gap-2">📝 Log sessions with feedback</li>
                <li className="flex items-center gap-2">⭐ Session ratings</li>
                <li className="flex items-center gap-2">🔗 Link action items</li>
              </ul>
            </div>

            {/* Card 4: Investor */}
            <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Investor</h3>
              <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                <li className="flex items-center gap-2">🛡 Read-only dashboard</li>
                <li className="flex items-center gap-2">📈 Startup progress charts</li>
                <li className="flex items-center gap-2">💎 Funding milestones</li>
              </ul>
            </div>

            {/* Card 5: Manager */}
            <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Manager</h3>
              <ul className="space-y-2 text-sm text-muted-foreground font-medium">
                <li className="flex items-center gap-2">🌱 Create programs</li>
                <li className="flex items-center gap-2">📅 Manage events & workshops</li>
                <li className="flex items-center gap-2">🎪 Demo day scheduling</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tech Stack Row */}
        <section className="py-12 w-full max-w-4xl mx-auto text-center border-t border-slate-200 dark:border-white/10 flex flex-col items-center gap-4">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">POWERED BY MODERN VENTURE ARCHITECTURE</p>
          <div className="flex flex-wrap justify-center items-center gap-2.5">
            {['Next.js 14', 'Supabase', 'TypeScript Strict', 'TanStack Query', 'Recharts', 'Vercel'].map((tech) => (
              <span key={tech} className="px-4 py-1.5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full border border-border/50">
                {tech}
              </span>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-muted-foreground border-t border-slate-200 dark:border-white/10">
        <p>© 2026 Polaris Incubation System. Engineered for exponential scale.</p>
      </footer>
    </div>
  )
}
