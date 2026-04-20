import { Logo } from "@/components/shared/logo";
import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#f8f9fa]">
      <div className="w-full max-w-md p-10 bg-white rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-white text-center flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 mb-10 bg-black rounded-[2rem] flex items-center justify-center shadow-2xl shadow-black/20">
          <Logo className="w-14 h-14" iconClassName="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-4xl font-black tracking-tighter text-[#202124] mb-3">
          Polaris
        </h1>
        <p className="text-muted-foreground mb-10 text-sm font-medium leading-relaxed max-w-[280px]">
          The high-fidelity architecture for startup incubation and venture scaling.
        </p>
        
        <div className="flex flex-col w-full gap-4">
          <Link 
            href="/login" 
            className="group flex items-center justify-center gap-3 w-full h-16 bg-primary text-primary-foreground px-6 rounded-2xl font-black text-sm hover:bg-black/90 hover:shadow-2xl hover:shadow-black/10 transition-all active:scale-[0.98]"
          >
            Sign in to Platform
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link 
            href="/register" 
            className="group flex items-center justify-center gap-3 w-full h-16 bg-secondary text-secondary-foreground px-6 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all border border-border/10 hover:shadow-md active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            Register Venture
          </Link>
        </div>
      </div>
      
      <div className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 flex gap-6">
        <span className="hover:text-black cursor-pointer transition-colors">Privacy</span>
        <span className="hover:text-black cursor-pointer transition-colors">Terms</span>
        <span className="hover:text-black cursor-pointer transition-colors">Help</span>
      </div>
    </div>
  );
}
