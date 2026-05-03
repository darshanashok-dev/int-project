import { Logo } from "@/components/shared/logo";
import Link from "next/link";
import { 
  Rocket, 
  ShieldCheck, 
  LineChart, 
  Zap,
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050608] text-white selection:bg-indigo-500/100/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Glass Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 bg-card/5 backdrop-blur-xl border border-white/10 rounded-2xl">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10 shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
            <span className="font-black text-xl tracking-tighter uppercase">Polaris</span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {['Ecosystem', 'Founders', 'Investors', 'Security', 'Pricing'].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-bold text-gray-400 hover:text-white transition-all hover:translate-y-[-1px]"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white px-4 py-2 transition-all">
              Log In
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2.5 bg-card text-black text-sm font-black rounded-xl hover:bg-indigo-500/10 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1">
        <section className="pt-20 pb-32 px-6">
          <div className="max-w-7xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/100/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Zap className="w-3 h-3 fill-current" />
              Next-Gen Venture Operating System
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
              BUILD. SCALE.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">COMMAND.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
              Polaris is the high-performance backbone for startup ecosystems. A centralized monolith for founders, mentors, and investors to orbit success.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
              <Link 
                href="/register" 
                className="group relative px-10 py-5 bg-card text-black text-lg font-black rounded-[2rem] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-500/10"
              >
                <div className="relative z-10 flex items-center gap-3">
                  Initialize Venture <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-indigo-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link 
                href="/admin" 
                className="px-10 py-5 bg-card/5 border border-white/10 text-white text-lg font-black rounded-[2rem] hover:bg-card/10 transition-all hover:border-white/20 active:scale-95"
              >
                Platform Overview
              </Link>
            </div>

          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-32 px-6 bg-[#0a0c10]/50 relative border-y border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16">
                One platform.<br />
                <span className="text-indigo-400">Infinite control.</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                <ValueProp 
                  icon={Rocket}
                  title="Founder Launchpad"
                  desc="Manage milestones, funding rounds, and legal docs in a single, high-fidelity workspace."
                />
                <ValueProp 
                  icon={LineChart}
                  title="Investor Intelligence"
                  desc="Track portfolio performance with real-time analytics and secure deal-flow rooms."
                />
                <ValueProp 
                  icon={ShieldCheck}
                  title="Mentor Ecosystem"
                  desc="Structured feedback loops and session management for scaled human capital."
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/20">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-8">
                Ready to orbit?<br />Join the cohort.
              </h2>
              <p className="text-white/70 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
                Empower your venture with the command center designed for the modern startup lifecycle. Zero friction, total control.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register" className="w-full sm:w-auto px-12 py-5 bg-card text-indigo-900 text-lg font-black rounded-2xl hover:bg-indigo-500/10 transition-all hover:scale-105 active:scale-95 shadow-xl">
                  Get Access Now
                </Link>
                <Link href="/login" className="w-full sm:w-auto px-12 py-5 bg-indigo-500/100/20 border border-white/20 text-white text-lg font-black rounded-2xl hover:bg-indigo-500/100/30 transition-all">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Logo className="w-8 h-8 shadow-sm" />
              <span className="font-black text-xl tracking-tighter uppercase">Polaris</span>
            </div>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              The high-performance monolith for venture management ecosystems. Built for scale.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-bold">
              <li><Link href="#" className="hover:text-white transition-colors">Founder Suite</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Investor Ops</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Mentor Hub</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Data Rooms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-bold">
              <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Enterprise</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-bold">
              <li><Link href="#" className="hover:text-white transition-colors">About Polaris</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-[10px] font-black text-gray-600 uppercase tracking-widest">
          <p>© 2024 Polaris Operating System. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ValueProp({ icon: Icon, title, desc }: { icon: React.ElementType, title: string, desc: string }) {
  return (
    <div className="group flex items-start gap-6">
      <div className="w-14 h-14 bg-card/5 rounded-2xl flex items-center justify-center text-white border border-white/10 group-hover:bg-indigo-500/100/10 group-hover:border-indigo-500/20 group-hover:text-indigo-400 transition-all shrink-0 shadow-2xl shadow-indigo-500/0 group-hover:shadow-indigo-500/10">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{title}</h3>
        <p className="text-gray-500 font-medium text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
