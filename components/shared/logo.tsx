import { Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconClassName?: string
}

export function Logo({ className, iconClassName }: LogoProps) {
  return (
    <div className={cn(
      "bg-gradient-to-br from-[#202124] to-black rounded-2xl flex items-center justify-center text-white shadow-[0_8px_16px_rgba(0,0,0,0.15)] shrink-0",
      className || "w-10 h-10"
    )}>
      <Rocket className={cn("fill-current transform -rotate-12", iconClassName || "w-6 h-6")} />
    </div>
  )
}
