'use client'

import { useParams, useRouter } from 'next/navigation'
import { useStartupDetail } from '@/lib/hooks/use-startup-discovery'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Globe, 
  Mail, 
  Share2, 
  Link as LinkIcon, 
  CheckCircle2, 
  Circle, 
  MapPin 
} from 'lucide-react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { signalInterest } from '../../actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function InvestorStartupDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: startupData, isLoading } = useStartupDetail(id as string)
  const startup = startupData as any
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSignal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    formData.set('startup_id', id as string)
    
    const res = await signalInterest(formData)
    setSubmitting(false)
    
    if (res.success) {
      toast.success('Interest signaled successfully')
      setOpen(false)
    } else {
      toast.error('Failed to signal interest')
    }
  }

  if (isLoading) return <div className="p-8 text-center">Loading startup details...</div>
  if (!startup) return <div className="p-8 text-center">Startup not found.</div>

  const startupName = startup.name || 'Startup'

  return (
    <div className="space-y-8 pb-20">
      <Button variant="ghost" onClick={() => router.back()} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Discovery
      </Button>
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black tracking-tight">{startupName}</h1>
            <Badge className="bg-indigo-600">{startup.sector}</Badge>
          </div>
          <p className="text-xl text-muted-foreground">{startup.stage} Stage Startup</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 border rounded-xl hover:bg-slate-50 transition-colors"><Globe className="h-4 w-4" /></button>
          <button className="p-2 border rounded-xl hover:bg-slate-50 transition-colors"><Share2 className="h-4 w-4" /></button>
          <button className="p-2 border rounded-xl hover:bg-slate-50 transition-colors"><LinkIcon className="h-4 w-4" /></button>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl font-bold px-8">Express Interest</Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSignal} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Express Interest in {startupName}</DialogTitle>
                  <DialogDescription>Let the founders know you're interested in their venture.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Signal Type</Label>
                    <Select name="signal_type" defaultValue="watching">
                      <SelectTrigger>
                        <SelectValue placeholder="Select interest level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="watching">Watching (Soft Signal)</SelectItem>
                        <SelectItem value="interested">Interested (Diligent Review)</SelectItem>
                        <SelectItem value="committed">Committed (Lead/Active)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Investment Note</Label>
                    <Textarea name="note" placeholder="Add a private note about your investment thesis..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? 'Saving...' : 'Confirm Signal'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-2xl">
          <TabsTrigger value="overview" className="rounded-xl px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="milestones" className="rounded-xl px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">Milestones</TabsTrigger>
          <TabsTrigger value="funding" className="rounded-xl px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm">Funding</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="rounded-[2rem]">
                <CardHeader>
                  <CardTitle>Strategy & Vision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-2">The Mission</h4>
                    <p className="text-lg leading-relaxed">{startup.strategy_summary}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-2">Target Market</h4>
                      <p className="font-medium">{startup.target_market}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-2">Revenue Model</h4>
                      <p className="font-medium">{startup.revenue_model}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-2">Competitive Advantage</h4>
                    <p className="font-medium">{startup.competitive_advantage}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="rounded-[2rem]">
                <CardHeader>
                  <CardTitle>Contact Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium">contact@{startupName.toLowerCase().replace(/\s+/g, '')}.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium">Bengaluru, India</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="milestones">
          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>Product Roadmap</CardTitle>
              <CardDescription>Key development and business milestones.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(startup.milestones as any[])?.map((m) => (
                  <div key={m.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      m.status === 'completed' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                    )}>
                      {m.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{m.title}</p>
                      <p className="text-xs text-muted-foreground">Due {m.due_date ? format(new Date(m.due_date), 'MMM dd, yyyy') : 'TBD'}</p>
                    </div>
                    <Badge variant={m.status === 'completed' ? 'default' : 'secondary'}>{m.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funding">
          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>Funding History</CardTitle>
              <CardDescription>Previous investment rounds and capital raised.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(startup.funding as any[])?.map((f) => (
                  <div key={f.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
                    <div>
                      <p className="font-bold">{f.round}</p>
                      <p className="text-xs text-muted-foreground">{f.date ? format(new Date(f.date), 'MMMM dd, yyyy') : 'TBD'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-indigo-600">${Number(f.amount).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{f.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
