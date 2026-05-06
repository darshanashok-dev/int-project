'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside ErrorBoundary:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50/30 dark:bg-slate-900/10">
          <div className="max-w-md w-full rounded-[2rem] border border-red-100 bg-white dark:bg-slate-950 p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
            {/* Top decorative gradient or animation */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 to-amber-500" />
            
            <div className="flex flex-col items-center text-center space-y-6 pt-4">
              <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-600 dark:text-red-400">
                <AlertTriangle className="w-8 h-8 animate-bounce" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Something went wrong</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  An unexpected error occurred in this module. The Polaris control center has logged this event.
                </p>
              </div>

              {this.state.error?.message && (
                <div className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-left">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Error Log</p>
                  <p className="text-xs font-mono text-red-600 dark:text-red-400 break-words">{this.state.error.message}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                <Button 
                  onClick={this.handleReset}
                  className="flex-1 rounded-xl font-bold gap-2 h-12 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <RefreshCw className="h-4 w-4" /> Try Again
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 rounded-xl font-bold gap-2 h-12 border-slate-200"
                >
                  <Home className="h-4 w-4" /> Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
