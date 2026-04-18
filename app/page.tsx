import { Logo } from "@/components/shared/logo";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md p-10 bg-card rounded-[2.5rem] shadow-sm border border-border/50 text-center flex flex-col items-center">
        <Logo className="w-20 h-20 mb-8" iconClassName="w-12 h-12" />
        
        <h1 className="text-3xl font-black tracking-tight text-[#202124] mb-2">
          Polaris
        </h1>
        <p className="text-muted-foreground mb-8 text-sm">
          Next-generation Startup Incubation Platform
        </p>
        
        <div className="flex flex-col w-full gap-3">
          <Link 
            href="/login" 
            className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium hover:bg-primary/90 hover:shadow-md transition-all"
          >
            Sign in
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/register" 
            className="flex items-center justify-center gap-2 w-full bg-secondary text-secondary-foreground px-6 py-2.5 rounded-full font-medium hover:bg-secondary/80 transition-all border border-border/50 hover:shadow-sm"
          >
            Create account
          </Link>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-muted-foreground flex gap-4">
        <span className="hover:underline cursor-pointer">Privacy</span>
        <span className="hover:underline cursor-pointer">Terms</span>
        <span className="hover:underline cursor-pointer">Help</span>
      </div>
    </div>
  );
}
