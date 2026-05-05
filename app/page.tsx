import Link from "next/link";
import {
  Rocket,
  ShieldCheck,
  LineChart,
  ArrowRight,
  User
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Glass Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl tracking-tighter uppercase text-indigo-600">Polaris</span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {['Ecosystem', 'Founders', 'Investors', 'Team', 'Security', 'Pricing'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-all hover:translate-y-[-1px]"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-indigo-600 px-4 py-2 transition-all">
              Log In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-black rounded-xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-200"
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

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
              BUILD. SCALE.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">COMMAND.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
              Polaris is the high-performance backbone for startup ecosystems. A centralized monolith for founders, mentors, and investors to orbit success.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
              <Link
                href="/register"
                className="group relative px-10 py-5 bg-indigo-600 text-white text-lg font-black rounded-[2rem] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-200"
              >
                <div className="relative z-10 flex items-center gap-3">
                  Initialize Venture <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link
                href="/admin"
                className="px-10 py-5 bg-white border border-slate-200 text-slate-600 text-lg font-black rounded-[2rem] hover:bg-slate-50 transition-all hover:border-slate-300 active:scale-95 shadow-sm"
              >
                Platform Overview
              </Link>
            </div>

          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-32 px-6 bg-slate-50 relative border-y border-slate-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-16">
                One platform.<br />
                <span className="text-indigo-600">Infinite control.</span>
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

        {/* Ecosystem Section */}
        <section id="ecosystem" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">
                  The Venture<br />
                  <span className="text-indigo-600">Ecosystem Engine.</span>
                </h2>
                <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">
                  Polaris connects every node in your incubation network. From initial application to final exit, every interaction is tracked, analyzed, and optimized for success.
                </p>
                <div className="space-y-4">
                  {['Centralized Data Monolith', 'Real-time Analytics Orbit', 'Secure Asset Vault'].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                      </div>
                      <span className="font-bold text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 rounded-[3rem] p-8 border border-slate-200 shadow-inner aspect-square flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 rounded-full animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-slate-100">
                    <Rocket className="w-12 h-12 text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founders & Investors Section */}
        <section id="founders" className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Dual-Core Architecture</h2>
              <p className="text-slate-500 font-medium">Specialized interfaces for both ends of the capital spectrum.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div id="founders" className="p-12 bg-slate-50 rounded-[3rem] border border-slate-200 hover:border-indigo-300 transition-all group">
                <h3 className="text-2xl font-black mb-4">For Founders</h3>
                <p className="text-slate-500 font-medium mb-8">Streamline your operations, manage your cap table, and automate investor reporting.</p>
                <Link href="/register" className="inline-flex items-center gap-2 font-black text-indigo-600 group-hover:gap-4 transition-all">
                  Launch Suite <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div id="investors" className="p-12 bg-slate-50 rounded-[3rem] border border-slate-200 hover:border-emerald-300 transition-all group">
                <h3 className="text-2xl font-black mb-4">For Investors</h3>
                <p className="text-slate-500 font-medium mb-8">Deploy capital with intelligence. Track portfolio health and manage due diligence rooms.</p>
                <Link href="/register" className="inline-flex items-center gap-2 font-black text-emerald-600 group-hover:gap-4 transition-all">
                  Intel Suite <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Command Leadership</h2>
              <p className="text-slate-500 font-medium">The architects behind the Polaris venture operating system.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Darshan A', role: 'Team Leader', id: '1IB25CS052', email: 'darshana25cs@rnsit.ac.in', branch: 'CSE-B' },
                { name: 'Amit Nagendra Bhat', role: 'Member', id: '1RX25CS023', email: 'amitnagendrabhat25cs@rnsit.ac.in', branch: 'CSE-H' },
                { name: 'Abhishek', role: 'Member', id: '1RN25EC005', email: 'abhisheka25ec@rnsit.ac.in', branch: 'ECE-A' },
                { name: 'Amit A Sharma', role: 'Member', id: '1RN25ME004', email: 'amitasharma25me@rnsit.ac.in', branch: 'ME-A' },
                { name: 'Devang', role: 'Member', id: '1RX25CS058', email: 'devang25cs@rnsit.ac.in', branch: 'CSE-C' },
                { name: 'Aman Ishwar Naik', role: 'Member', id: '1RX25CS021', email: 'amanishwarnaik25cs@rnsit.ac.in', branch: 'CSE-H' }
              ].map(member => (
                <div key={member.name} className="group p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 hover:border-indigo-300 transition-all">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    <User className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="font-black text-lg mb-1">{member.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">{member.role}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-slate-400 text-[10px] font-bold">{member.id}</span>
                  </div>
                  <p className="text-slate-500 text-xs font-bold mb-2">{member.branch}</p>
                  <p className="text-slate-400 text-[10px] font-medium break-all">{member.email}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="py-32 px-6 bg-slate-50 border-y border-slate-200">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
              <ShieldCheck className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8">Enterprise-Grade Security</h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12">
              Your IP is your most valuable asset. Polaris employs military-grade encryption and decentralized data protocols to ensure your venture remains yours.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['AES-256', 'SOC2 Type II', 'GDPR Ready', '2FA Enabled'].map(s => (
                <div key={s} className="font-black text-[10px] uppercase tracking-widest text-slate-400">{s}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Scalable Pricing</h2>
              <p className="text-slate-500 font-medium">From first-check to IPO, Polaris grows with your venture.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Seed', price: '0', desc: 'For early stage founders' },
                { name: 'Growth', price: '499', desc: 'For scaling ecosystems' },
                { name: 'Enterprise', price: 'Custom', desc: 'For global accelerators' }
              ].map(plan => (
                <div key={plan.name} className="p-10 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all">
                  <h3 className="font-black text-xl mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-black">${plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-slate-400 font-bold">/mo</span>}
                  </div>
                  <p className="text-slate-500 text-sm font-medium mb-8">{plan.desc}</p>
                  <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all">
                    Initialize {plan.name}
                  </button>
                </div>
              ))}
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
                <Link href="/register" className="w-full sm:w-auto px-12 py-5 bg-white text-indigo-600 text-lg font-black rounded-2xl hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/5">
                  Get Access Now
                </Link>
                <Link href="/login" className="w-full sm:w-auto px-12 py-5 bg-indigo-500/10 border border-white/20 text-white text-lg font-black rounded-2xl hover:bg-indigo-500/20 transition-all">
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
              <span className="font-black text-xl tracking-tighter uppercase text-indigo-600">Polaris</span>
            </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              The high-performance monolith for venture management ecosystems. Built for scale.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-bold">
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">Founder Suite</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">Investor Ops</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">Mentor Hub</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">Data Rooms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-bold">
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">Enterprise</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-bold">
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">About Polaris</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <p>© 2024 Polaris Operating System. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="#" className="hover:text-indigo-600 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ValueProp({ icon: Icon, title, desc }: { icon: React.ElementType, title: string, desc: string }) {
  return (
    <div className="group flex items-start gap-6">
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200 group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-all shrink-0 shadow-sm shadow-indigo-500/0 group-hover:shadow-indigo-500/10">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{title}</h3>
        <p className="text-slate-500 font-medium text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}
