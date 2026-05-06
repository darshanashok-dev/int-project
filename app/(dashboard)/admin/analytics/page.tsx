'use client'

import { 
  useMilestoneStats, 
  useFundingByStartup, 
  useSessionEngagement 
} from '@/lib/hooks/use-analytics'
import { LoadingState } from '@/components/shared/loading-state'
import { ErrorState } from '@/components/shared/error-state'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Line
} from 'recharts'
import { TrendingUp, Users, Target, Landmark } from 'lucide-react'

const COLORS = ['#10b981', '#6366f1', '#f59e0b']

export default function AdminAnalyticsPage() {
  const { data: milestoneStats, isLoading: isMilestonesLoading, isError: isMilestonesError, error: milestonesError } = useMilestoneStats()
  const { data: fundingStats, isLoading: isFundingLoading, isError: isFundingError, error: fundingError } = useFundingByStartup()
  const { data: sessionStats, isLoading: isSessionsLoading, isError: isSessionsError, error: sessionsError } = useSessionEngagement()

  const isLoading = isMilestonesLoading || isFundingLoading || isSessionsLoading
  const isError = isMilestonesError || isFundingError || isSessionsError
  const errorMsg = milestonesError?.message || fundingError?.message || sessionsError?.message

  if (isLoading) return <LoadingState message="Calculating ecosystem metrics..." />
  if (isError) return <ErrorState message={errorMsg || 'Failed to load analytics'} />

  // Calculate KPIs
  const totalFunding = fundingStats?.reduce((acc, curr) => acc + curr.total_amount, 0) || 0
  const activeStartupsCount = fundingStats?.length || 0
  
  const totalSessions = sessionStats?.reduce((acc, curr) => acc + curr.session_count, 0) || 0
  const avgSessionRating = sessionStats?.length 
    ? Number((sessionStats.reduce((acc, curr) => acc + curr.avg_rating, 0) / sessionStats.length).toFixed(1))
    : 0

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
          Ecosystem Analytics
        </h1>
        <p className="text-muted-foreground mt-2 font-medium text-lg">
          Ecosystem intelligence, funding distribution, and session engagement.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Card 1: Total Funding */}
        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Total Funding Raised</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-foreground">
              {totalFunding.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            </h2>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 2: Ecosystem Ventures */}
        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Active Ventures</p>
          <div className="flex items-center justify-between">
            <h2 className="text-5xl font-black text-foreground">{activeStartupsCount}</h2>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 3: Mentor Sessions */}
        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Total Sessions Logged</p>
          <div className="flex items-center justify-between">
            <h2 className="text-5xl font-black text-foreground">{totalSessions}</h2>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 4: Avg Session Rating */}
        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Avg Session Rating</p>
          <div className="flex items-center justify-between">
            <h2 className="text-5xl font-black text-foreground">{avgSessionRating} <span className="text-sm font-medium text-muted-foreground">/ 5</span></h2>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Funding per Startup & Session Engagement */}
        <div className="lg:col-span-8 space-y-8">
          {/* Funding Raised Bar Chart */}
          <Card className="rounded-[2.5rem] p-6 shadow-sm border border-border">
            <CardHeader className="px-4 pb-4">
              <CardTitle className="text-xl font-bold">Funding Distribution</CardTitle>
              <CardDescription>Total capital raised by each incubated venture.</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fundingStats} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                  <YAxis type="category" dataKey="startup_name" stroke="#94a3b8" fontSize={11} width={80} />
                  <Tooltip formatter={(v: any) => [`₹${v.toLocaleString('en-IN')}`, 'Funding Raised']} />
                  <Bar dataKey="total_amount" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Composed Session Engagement Chart */}
          <Card className="rounded-[2.5rem] p-6 shadow-sm border border-border">
            <CardHeader className="px-4 pb-4">
              <CardTitle className="text-xl font-bold">Session Engagement & Satisfaction</CardTitle>
              <CardDescription>Correlating mentor interaction frequency with average venture rating.</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={sessionStats} margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="startup_name" stroke="#94a3b8" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#6366f1" fontSize={11} label={{ value: 'Sessions Count', angle: -90, position: 'insideLeft', style: { fill: '#6366f1', fontSize: 11 } }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} domain={[0, 5]} label={{ value: 'Avg Rating', angle: 90, position: 'insideRight', style: { fill: '#f59e0b', fontSize: 11 } }} />
                  <Tooltip formatter={(v, name) => [v, name === 'session_count' ? 'Sessions logged' : 'Avg Rating']} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="session_count" name="Sessions logged" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={36} />
                  <Line yAxisId="right" type="monotone" dataKey="avg_rating" name="Avg Rating" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right: Milestone Distribution Pie Chart */}
        <div className="lg:col-span-4">
          <Card className="h-full rounded-[2.5rem] p-6 shadow-sm border border-border flex flex-col">
            <CardHeader className="px-4 pb-2">
              <CardTitle className="text-xl font-bold">Milestone Telemetry</CardTitle>
              <CardDescription>Distribution of milestone achievements across cohorts.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center min-h-[300px]">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={milestoneStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {milestoneStats?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [v, 'Milestones']} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
