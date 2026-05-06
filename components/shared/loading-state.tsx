'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Synchronizing with ecosystem...' }: LoadingStateProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4 text-center">
        {/* Double-layered premium loading spinner */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-600 animate-spin" />
          <Loader2 className="w-6 h-6 text-indigo-600 animate-pulse" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">{message}</p>
          <p className="text-xs text-muted-foreground">Please keep this window open while we fetch live telemetry.</p>
        </div>
      </div>
    </div>
  )
}
export default LoadingState
