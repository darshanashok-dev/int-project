import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconClassName?: string
}

export function Logo({ className, iconClassName }: LogoProps) {
  return (
    <div className={cn(
      "relative bg-card rounded-xl flex items-center justify-center shadow-md shrink-0 overflow-hidden border border-slate-100",
      className || "w-10 h-10"
    )}>
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black" />
      
      {/* North Star / Rocket Icon */}
      <div className="relative z-10 w-[65%] h-[65%] flex items-center justify-center">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={cn("w-full h-full text-white", iconClassName)}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 2L14.5 9H22L16 14L18.5 21L12 17L5.5 21L8 14L2 9H9.5L12 2Z" 
            fill="currentColor" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="2" fill="black" />
        </svg>
      </div>
      
      {/* Shine Effect */}
      <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-white/20 via-transparent to-transparent rotate-45 pointer-events-none" />
    </div>
  )
}
