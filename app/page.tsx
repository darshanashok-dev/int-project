import Link from 'next/link'
import React from 'react'
import {
  ShieldCheck, Rocket, TrendingUp, ArrowRight,
  LineChart, Users, CalendarDays, CheckCircle2,
  Zap, Globe, Lock, BarChart3, ChevronRight,
} from 'lucide-react'

/* ─────────────────────────────────────────────────────────── */
/*  Static data                                                */
/* ─────────────────────────────────────────────────────────── */

const ROLES = [
  {
    icon: ShieldCheck,
    color: '#4F46E5',
    bg: '#EEF2FF',
    role: 'Admin',
    tagline: 'Full operational command',
    features: ['Review & approve applications', 'Assign mentors to startups', 'Platform-wide analytics', 'Manage cohorts & batches'],
  },
  {
    icon: Rocket,
    color: '#7C3AED',
    bg: '#F5F3FF',
    role: 'Founder',
    tagline: 'Build in public, scale in private',
    features: ['Track milestones & KPIs', 'View funding rounds', 'Upload pitch decks', 'Log mentor sessions'],
  },
  {
    icon: Users,
    color: '#0EA5E9',
    bg: '#F0F9FF',
    role: 'Mentor',
    tagline: 'Guide the next generation',
    features: ['View assigned startups', 'Log sessions with feedback', 'Session ratings & reviews', 'Link action items'],
  },
  {
    icon: TrendingUp,
    color: '#059669',
    bg: '#ECFDF5',
    role: 'Investor',
    tagline: 'Transparent, curated deal flow',
    features: ['Read-only portfolio view', 'Startup progress charts', 'Funding milestone tracker', 'Cohort performance data'],
  },
  {
    icon: CalendarDays,
    color: '#D97706',
    bg: '#FFFBEB',
    role: 'Manager',
    tagline: 'Run the full program lifecycle',
    features: ['Create & manage programs', 'Event & workshop scheduling', 'Demo day coordination', 'Participant oversight'],
  },
]

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Role Switching',
    desc: 'One login, five dashboards. Navigate between Founder, Mentor, Investor views without re-authenticating.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Recharts-powered dashboards with funding trends, milestone completion, and cohort-level KPIs.',
  },
  {
    icon: Lock,
    title: 'Row-Level Security',
    desc: 'Supabase RLS ensures every user sees only what their role permits — zero data leakage.',
  },
  {
    icon: Globe,
    title: 'Fully Responsive',
    desc: 'From command-center desktops to on-the-go mobile — every view is pixel-perfect on any device.',
  },
]

const STATS = [
  { value: '5', label: 'Specialized Dashboards' },
  { value: '100%', label: 'TypeScript Strict' },
  { value: 'RLS', label: 'Row-Level Security' },
  { value: '<2s', label: 'Cold Start' },
]

const TECH = ['Next.js 14', 'Supabase', 'TypeScript', 'TanStack Query', 'Recharts', 'Vercel', 'Tailwind CSS', 'shadcn/ui']

/* ─────────────────────────────────────────────────────────── */
/*  Page                                                       */
/* ─────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ── Decorative blobs (fixed, behind everything) ── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[800px] h-[800px] rounded-full bg-indigo-200/60 blur-3xl" />
        <div className="absolute top-1/4 -right-40 w-[700px] h-[700px] rounded-full bg-violet-200/50 blur-3xl" />
        <div className="absolute top-2/3 left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-[800px] h-[800px] rounded-full bg-indigo-100/60 blur-3xl" />
      </div>

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 px-4 pt-6">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-3 py-2.5 bg-white/80 backdrop-blur-md border border-white/60 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04),0_1px_2px_rgb(0,0,0,0.02)] ring-1 ring-gray-900/5">
          <div className="flex items-center gap-2.5 pl-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-full flex items-center justify-center shadow-sm">
              <Rocket className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight text-gray-900">Polaris</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-500">
            <a href="#features" className="px-4 py-1.5 rounded-full hover:text-gray-900 hover:bg-gray-50 transition-all">Features</a>
            <a href="#roles"    className="px-4 py-1.5 rounded-full hover:text-gray-900 hover:bg-gray-50 transition-all">Roles</a>
            <a href="#stack"    className="px-4 py-1.5 rounded-full hover:text-gray-900 hover:bg-gray-50 transition-all">Stack</a>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-1 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-full hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all"
          >
            Sign In <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </nav>
      </header>

      <main className="relative z-10 flex-1">

        {/* ── Hero ── */}
        <section className="pt-24 pb-28 px-6 text-center flex flex-col items-center">


          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9] mb-7 max-w-5xl">
            The Command Center
            <br />
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-400">
                for Every Stakeholder.
              </span>
            </span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-gray-500 font-medium leading-relaxed mb-10">
            Polaris is a full-stack incubation management platform. Five specialized dashboards — Founders, Mentors, Investors, Admins, and Managers — all in one beautifully unified system.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
            <Link
              href="/login"
              className="group w-full sm:w-auto flex items-center justify-center gap-2 px-9 py-4 bg-indigo-600 text-white text-base font-bold rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-200"
            >
              Launch Platform
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#roles"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-9 py-4 bg-white text-gray-700 text-base font-bold rounded-2xl border border-gray-200 hover:border-indigo-200 hover:text-indigo-600 active:scale-95 transition-all shadow-sm"
            >
              Explore Roles
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Stats bar */}
          <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.04)] divide-x divide-y sm:divide-y-0 divide-white/30 overflow-hidden">
            {STATS.map(({ value, label }) => (
              <div key={label} className="px-6 py-6 text-center">
                <div className="text-3xl font-black text-gray-900 tracking-tight mb-1">{value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="py-28 px-6 bg-slate-50/30 backdrop-blur-[2px] border-y border-slate-100/60">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-500 mb-4">Why Polaris</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-5">
                Built different.<br />
                <span className="text-indigo-600">Engineered for scale.</span>
              </h2>
              <p className="text-gray-400 text-lg font-medium max-w-xl mx-auto">
                Not a generic project tracker. A purpose-built ecosystem for every role in your incubation program.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-7 border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.03)] hover:shadow-[0_8px_32px_0_rgba(99,102,241,0.08)] hover:border-indigo-200/60 hover:bg-white/60 transition-all duration-300 flex flex-col gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1.5">{title}</h3>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Five Roles ── */}
        <section id="roles" className="py-28 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-500 mb-4">Role-Based Access</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-5">
                Five Roles.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                  One Unified Hub.
                </span>
              </h2>
              <p className="text-gray-400 text-lg font-medium max-w-xl mx-auto">
                Every stakeholder gets a purpose-built experience — not a watered-down generic dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {ROLES.map(({ icon: Icon, color, bg, role, tagline, features }) => (
                <div
                  key={role}
                  className="group relative bg-white/50 backdrop-blur-lg border border-white/70 rounded-[2.5rem] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.04)] hover:shadow-[0_12px_40px_rgba(31,38,135,0.08)] hover:border-white hover:bg-white/60 transition-all duration-500 overflow-hidden"
                >
                  {/* Subtle tinted corner blob */}
                  <div
                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                    style={{ background: color + '33' }}
                  />

                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 border border-white/60 shadow-sm"
                      style={{ background: bg }}
                    >
                      <Icon className="w-6 h-6" style={{ color }} />
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-1">{role}</h3>
                    <p className="text-sm font-semibold mb-5" style={{ color }}>{tagline}</p>

                    <ul className="space-y-2.5">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-gray-500 font-medium">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

              {/* CTA card — fills 6th slot */}
              <div className="relative bg-indigo-600 border-0 rounded-3xl p-8 shadow-xl shadow-indigo-200 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
                />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">Ready to launch?</h3>
                  <p className="text-indigo-200 text-sm font-medium leading-relaxed mb-8">
                    Sign in and get your incubation program running in minutes.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="relative flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-700 text-sm font-black rounded-xl hover:bg-indigo-50 active:scale-95 transition-all"
                >
                  Get Access <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section id="stack" className="py-20 px-6 bg-slate-50/20 backdrop-blur-[1px] border-y border-slate-100/50">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-7">
              Powered by Modern Venture Architecture
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {TECH.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-white/50 backdrop-blur-sm border border-white/60 text-xs font-semibold text-gray-600 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:border-indigo-300 hover:text-indigo-600 hover:bg-white/80 transition-all cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="py-28 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-12 md:p-20 text-center shadow-2xl shadow-indigo-200">

              {/* Dot grid overlay */}
              <div className="absolute inset-0 opacity-[0.07]"
                style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)', backgroundSize: '28px 28px' }}
              />
              {/* Glow orbs */}
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-violet-300/20 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 bg-white/15 border border-white/20 rounded-full text-white text-xs font-bold tracking-widest uppercase">
                  <Zap className="w-3 h-3" />
                  Now Live
                </div>
                <h2 className="text-4xl md:text-5xl xl:text-6xl font-black tracking-tighter text-white mb-6 leading-tight">
                  Ready to orbit?<br />Join the cohort.
                </h2>
                <p className="text-indigo-200 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10">
                  Empower your venture with the command center designed for the modern startup lifecycle. Zero friction, total control.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-12 py-4 bg-white text-indigo-700 text-base font-black rounded-2xl hover:bg-indigo-50 active:scale-95 transition-all shadow-xl"
                >
                  Get Access Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-gray-50 border-t border-gray-100 px-6 pt-16 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Top row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-14">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 bg-indigo-600 rounded-[8px] flex items-center justify-center shadow-sm shadow-indigo-200">
                  <Rocket className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-black text-base tracking-tight text-gray-900">Polaris</span>
              </div>
              <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                The high-performance platform for venture management ecosystems. Built for college incubation cells that mean business.
              </p>
            </div>

            {[
              {
                heading: 'Product',
                links: ['Founder Suite', 'Investor Ops', 'Mentor Hub', 'Analytics'],
              },
              {
                heading: 'Platform',
                links: ['Documentation', 'Security', 'Enterprise', 'API'],
              },
              {
                heading: 'Company',
                links: ['About Polaris', 'Blog', 'Careers', 'Contact'],
              },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <h4 className="text-xs font-black uppercase tracking-[0.18em] text-gray-900 mb-5">{heading}</h4>
                <ul className="space-y-3.5 text-sm text-gray-400 font-semibold">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="hover:text-indigo-600 transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-7 border-t border-gray-200">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-300">
              © 2026 Polaris Operating System. All rights reserved.
            </p>
            <div className="flex gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-300">
              {['Privacy', 'Terms', 'Cookie Policy'].map((l) => (
                <a key={l} href="#" className="hover:text-indigo-600 transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
