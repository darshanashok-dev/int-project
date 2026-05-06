'use client'

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'An error occurred while loading this view.', onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-[300px] flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-[2rem] border border-red-100 bg-white dark:bg-slate-950 p-8 shadow-md text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          
          <div className="space-y-1">
            <h4 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Telemetry Error</h4>
            <p className="text-xs text-muted-foreground">We were unable to establish a secure database connection.</p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-left">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Details</p>
          <p className="text-xs font-mono text-red-600 dark:text-red-400 break-words">{message}</p>
        </div>

        {onRetry && (
          <Button 
            onClick={onRetry}
            size="sm"
            className="w-full rounded-xl font-bold gap-2 h-10 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reconnect Telemetry
          </Button>
        )}
      </div>
    </div>
  )
}
export default ErrorState
