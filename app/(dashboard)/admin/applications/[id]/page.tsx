'use client'

import { useParams, useRouter } from 'next/navigation'
import { useApplication, useScoreApplication, useUpdateApplicationStatus } from '@/lib/hooks/use-applications'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { scoreSchema, type ScoreFormData } from '@/lib/validations/application'
import { toast } from 'sonner'
import { ArrowLeft, CheckCircle, XCircle, UserPlus } from 'lucide-react'
import { useMentors, useAssignMentor } from '@/lib/hooks/use-mentors'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { LoadingState } from '@/components/shared/loading-state'
import { ErrorState } from '@/components/shared/error-state'


export default function ApplicationReviewPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: applicationData, isLoading, isError, error, refetch } = useApplication(id as string)
  const application = applicationData as any
  const { mutate: submitScore, isPending: isScoring } = useScoreApplication(id as string)
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateApplicationStatus(id as string)
  const { data: mentors } = useMentors()
  const { mutate: assignMentor, isPending: isAssigning } = useAssignMentor()
  const [selectedMentor, setSelectedMentor] = useState<string>('')

  const { control, handleSubmit, formState: { errors } } = useForm<ScoreFormData>({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      team_score: 5,
      market_score: 5,
      traction_score: 5,
      uniqueness_score: 5,
      overall_comment: ''
    }
  })

  const onScoreSubmit = (data: ScoreFormData) => {
    submitScore(data, {
      onSuccess: () => toast.success('Application scored successfully'),
      onError: () => toast.error('Failed to score application')
    })
  }

  const handleStatusUpdate = (status: 'accepted' | 'rejected') => {
    updateStatus(status, {
      onSuccess: () => {
        toast.success(`Application ${status}`)
        if (status === 'accepted' && selectedMentor && application?.startups) {
          assignMentor({ 
            mentorId: selectedMentor, 
            startupId: application.startups.id 
          })
        }
        router.push('/admin/applications')
      },
      onError: () => toast.error('Failed to update status')
    })
  }

  if (isLoading) return <LoadingState message="Loading application details..." />
  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />
  if (!application) return <ErrorState message="Application not found." />

  const startup = application.startups

  return (
    <div className="space-y-8 pb-20">
      <Button variant="ghost" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to List
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-black">{startup.name}</CardTitle>
                  <CardDescription>{startup.sector} • {startup.stage}</CardDescription>
                </div>
                <Badge>{application.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-bold mb-2">Strategy Summary</h4>
                <p className="text-sm text-muted-foreground">{startup.strategy_summary}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold mb-2">Target Market</h4>
                  <p className="text-sm text-muted-foreground">{startup.target_market}</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Revenue Model</h4>
                  <p className="text-sm text-muted-foreground">{startup.revenue_model}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score Application</CardTitle>
              <CardDescription>Evaluate based on 4 key pillars (1-10)</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onScoreSubmit)}>
              <CardContent className="space-y-8">
                <ScoreSlider name="team_score" label="Team Capability" control={control} />
                <ScoreSlider name="market_score" label="Market Opportunity" control={control} />
                <ScoreSlider name="traction_score" label="Traction & Velocity" control={control} />
                <ScoreSlider name="uniqueness_score" label="Product Differentiation" control={control} />
                
                <div className="space-y-2">
                  <Label>Overall Feedback</Label>
                  <Controller
                    name="overall_comment"
                    control={control}
                    render={({ field }) => (
                      <Textarea {...field} placeholder="Detailed notes for the founder..." className="min-h-[100px]" />
                    )}
                  />
                  {errors.overall_comment && <p className="text-xs text-red-500">{errors.overall_comment.message}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isScoring}>
                  {isScoring ? 'Submitting...' : 'Save Evaluation'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-indigo-100 bg-indigo-50/50">
            <CardHeader>
              <CardTitle>Final Decision</CardTitle>
              <CardDescription>Admit or decline this startup for the cohort.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 mb-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Assign Lead Mentor (Optional)</Label>
                <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                  <SelectTrigger className="bg-white rounded-xl">
                    <SelectValue placeholder="Select a mentor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(mentors as any[])?.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{(m.users as any).full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => handleStatusUpdate('accepted')} 
                className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2"
                disabled={isUpdating || isAssigning}
              >
                <CheckCircle className="h-4 w-4" /> Accept Application
              </Button>
              <Button 
                onClick={() => handleStatusUpdate('rejected')} 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50 gap-2"
                disabled={isUpdating}
              >
                <XCircle className="h-4 w-4" /> Decline Application
              </Button>
            </CardContent>
          </Card>

          {application.application_scores && (application.application_scores as any[]).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Current Evaluation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(application.application_scores as any[]).map((score) => (
                    <div key={score.id} className="text-sm border-b pb-4 last:border-0">
                      <div className="flex justify-between font-bold mb-2">
                        <span>Avg Score:</span>
                        <span className="text-indigo-600">
                          {((score.team_score + score.market_score + score.traction_score + score.uniqueness_score) / 4).toFixed(1)}/10
                        </span>
                      </div>
                      <p className="text-xs italic text-muted-foreground">"{score.overall_comment}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function ScoreSlider({ name, label, control }: { name: keyof ScoreFormData, label: string, control: any }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Label className="text-sm font-bold">{label}</Label>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <span className="text-sm font-black text-indigo-600">{field.value}</span>
          )}
        />
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <Slider
            min={1}
            max={10}
            step={1}
            value={[value]}
            onValueChange={(vals) => onChange(vals[0])}
          />
        )}
      />
    </div>
  )
}
