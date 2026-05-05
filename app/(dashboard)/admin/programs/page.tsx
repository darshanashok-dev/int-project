'use client'

import { usePrograms } from '@/lib/hooks/use-programs'
import { CreateCohortDialog } from '@/components/admin/CreateCohortDialog'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Layers, PlayCircle, Users } from 'lucide-react'

export default function AdminProgramsPage() {
  const { data: programsData, isLoading } = usePrograms()
  const programs = programsData as any[]

  const activePrograms = programs?.filter(p => {
    const end = p.end_date ? new Date(p.end_date) : null
    return !end || end > new Date()
  }).length || 0

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Accelerator Programs</h1>
          <p className="text-muted-foreground">Monitor and manage all incubation cohorts.</p>
        </div>
        <CreateCohortDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-3xl border-border/50">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total</p>
              <CardTitle className="text-2xl font-black">{programs?.length || 0}</CardTitle>
            </div>
          </CardHeader>
        </Card>
        <Card className="rounded-3xl border-border/50">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <PlayCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Active</p>
              <CardTitle className="text-2xl font-black">{activePrograms}</CardTitle>
            </div>
          </CardHeader>
        </Card>
        <Card className="rounded-3xl border-border/50">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Target</p>
              <CardTitle className="text-2xl font-black">
                {programs?.reduce((acc, p) => acc + (p.max_startups || 0), 0) || 0}
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card className="rounded-[2rem]">
        <CardHeader>
          <CardTitle>Cohort Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program Name</TableHead>
                <TableHead>Cohort</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Loading cohorts...</TableCell>
                </TableRow>
              ) : programs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">No cohorts found.</TableCell>
                </TableRow>
              ) : (
                programs?.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-bold">{program.name}</TableCell>
                    <TableCell>{program.cohort}</TableCell>
                    <TableCell>
                      {program.start_date && format(new Date(program.start_date), 'MMM yyyy')} - {program.end_date && format(new Date(program.end_date), 'MMM yyyy')}
                    </TableCell>
                    <TableCell>{program.max_startups} startups</TableCell>
                    <TableCell>
                      <Badge variant={new Date(program.end_date!) < new Date() ? 'secondary' : 'default'}>
                        {new Date(program.end_date!) < new Date() ? 'Completed' : 'Active'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
