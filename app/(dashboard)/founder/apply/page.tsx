'use client'

import { useMyStartup } from '@/lib/hooks/use-startups'
import { usePrograms } from '@/lib/hooks/use-programs'
import { useCreateApplication } from '@/lib/hooks/use-applications'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, Rocket, Calendar, Users } from 'lucide-react'
import { format } from 'date-fns'
import { LoadingState } from '@/components/shared/loading-state'
import { ErrorState } from '@/components/shared/error-state'


export default function FounderApplyPage() {
  const { data: startupData, isLoading: startupLoading, isError: startupError, error: sError, refetch: refetchStartup } = useMyStartup()
  const { data: programsData, isLoading: programsLoading, isError: programsError, error: pError, refetch: refetchPrograms } = usePrograms()
  const startup = startupData as any
  const programs = programsData as any[]
  const { mutate: createApplication, isPending: isSubmitting } = useCreateApplication()

  const handleApply = (programId: string) => {
    if (!startup) {
      toast.error('You need to create a startup profile first.')
      return
    }

    createApplication({ program_id: programId, startup_id: startup.id }, {
      onSuccess: () => toast.success('Application submitted successfully!'),
      onError: () => toast.error('Failed to submit application.')
    })
  }

  if (startupLoading || programsLoading) return <LoadingState message="Loading application details..." />
  if (startupError || programsError) {
    return (
      <ErrorState 
        message={sError?.message || pError?.message} 
        onRetry={() => {
          refetchStartup()
          refetchPrograms()
        }} 
      />
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Apply to Cohorts</h1>
        <p className="text-muted-foreground">Select an open program to take your startup to the next level.</p>
      </div>

      {!startup && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800">No Startup Profile Found</CardTitle>
            <CardDescription className="text-amber-700">
              You must complete your startup profile before you can apply to any programs.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs?.map((program) => (
          <Card key={program.id} className="rounded-[2rem] overflow-hidden border-slate-200 flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-indigo-200 text-indigo-600">
                  {program.cohort} Batch
                </Badge>
              </div>
              <CardTitle className="text-2xl font-black">{program.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-center gap-3 text-sm font-medium">
                <Calendar className="h-4 w-4 text-slate-400" />
                Starts {program.start_date && format(new Date(program.start_date), 'MMMM yyyy')}
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <Users className="h-4 w-4 text-slate-400" />
                Limit: {program.max_startups} Startups
              </div>
              <p className="text-sm text-muted-foreground pt-2">
                Get access to world-class mentors, seed funding, and a network of investors through the {program.name} {program.cohort} program.
              </p>
            </CardContent>
            <CardFooter className="bg-slate-50/50 p-6 border-t border-slate-100">
              <Button 
                onClick={() => handleApply(program.id)}
                disabled={isSubmitting || !startup}
                className="w-full rounded-xl font-bold h-12"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Rocket className="mr-2 h-4 w-4" />}
                Apply Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
