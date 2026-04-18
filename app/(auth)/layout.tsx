import { Logo } from '@/components/shared/logo'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-[#f8f9fa] py-12 px-6 relative overflow-hidden">
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-40" 
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(26, 115, 232, 0.05) 0%, transparent 70%)' }}>
      </div>

      {/* Header Branding */}
      <div className="flex flex-col items-center gap-4 relative z-10 mb-8">
        <Logo className="w-14 h-14" iconClassName="w-8 h-8" />
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#202124] tracking-tight">Polaris</h1>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Venture Incubation Systems</p>
        </div>
      </div>

      {/* Main Content (Card) */}
      <div className="relative z-10 w-full flex justify-center items-center py-8">
        {children}
      </div>

      {/* Footer Section */}
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-12 relative z-10 pt-12">
        <p className="max-w-md text-center italic text-sm text-muted-foreground font-medium animate-in fade-in slide-in-from-bottom-2 duration-700">
        &ldquo;Precision in architecture leads to clarity in execution.&rdquo;
        </p>
        <div className="w-full pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-sm font-extrabold text-[#202124]">Polaris</p>
            <p className="text-[10px] font-medium text-muted-foreground">© 2024 Polaris Inc. Architectural Editorial Systems.</p>
          </div>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[11px] font-bold text-muted-foreground hover:text-[#202124] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[11px] font-bold text-muted-foreground hover:text-[#202124] transition-colors">Terms of Service</Link>
            <Link href="/security" className="text-[11px] font-bold text-muted-foreground hover:text-[#202124] transition-colors">Security Architecture</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
