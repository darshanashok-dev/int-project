import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-background py-12 px-6 relative overflow-hidden">
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-40" 
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(26, 115, 232, 0.05) 0%, transparent 70%)' }}>
      </div>

      {/* Back Button */}
      <div className="absolute top-8 left-8 z-50">
        <Link href="/" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-indigo-600 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          Back to Home
        </Link>
      </div>

      {/* Header Branding */}
      <div className="flex flex-col items-center gap-4 relative z-10 mb-8">
        <Link href="/" className="text-center group block">
          <h1 className="text-3xl font-black text-foreground tracking-tight text-indigo-600 group-hover:opacity-80 transition-opacity">Polaris</h1>
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1 group-hover:text-indigo-600 transition-colors">Venture Incubation Systems</p>
        </Link>
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
            <p className="text-sm font-extrabold text-foreground">Polaris</p>
            <p className="text-[10px] font-medium text-muted-foreground">© 2024 Polaris Inc. Architectural Editorial Systems.</p>
          </div>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/security" className="text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors">Security Architecture</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
