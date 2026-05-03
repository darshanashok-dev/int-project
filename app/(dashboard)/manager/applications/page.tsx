import { ArrowLeft, Inbox } from 'lucide-react'
import Link from 'next/link'

export default function ManagerApplicationsPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/manager" className="p-2 bg-card rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Application Pipeline</h1>
          <p className="text-muted-foreground mt-1 font-medium">Review and process incoming venture applications.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[2.5rem] p-16 text-center shadow-sm">
        <div className="w-20 h-20 bg-indigo-500/10 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Inbox className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-2">Queue is Empty</h2>
        <p className="text-muted-foreground max-w-[300px] mx-auto font-medium leading-relaxed">
          All applications have been reviewed. New submissions will appear here once ventures apply to your cohorts.
        </p>
      </div>
    </div>
  )
}
