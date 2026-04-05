import Link from "next/link";
import { Rocket, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md p-10 bg-card rounded-2xl shadow-sm border border-border/50 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
          <Rocket className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
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
