'use client'

export function TopBar() {
  return (
    <header className="h-16 border-b border-border/50 bg-white/80 backdrop-blur-md flex items-center px-8 justify-between sticky top-0 z-10">
      <div className="flex-1">
      </div>

      <div className="flex items-center gap-6">
        {/* Profile info removed as per user request, but keeping container stable */}
      </div>
    </header>
  )
}
