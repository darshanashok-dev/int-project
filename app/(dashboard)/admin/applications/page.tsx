'use client'

import { useApplications } from '@/lib/hooks/use-applications'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import Link from 'next/link'
import { Eye } from 'lucide-react'

export default function AdminApplicationsPage() {
  const { data: applications, isLoading } = useApplications()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Application Review Board</h1>
        <p className="text-muted-foreground">Review and evaluate incoming startup applications.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Incoming Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Startup</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Loading applications...</TableCell>
                </TableRow>
              ) : applications?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">No applications found.</TableCell>
                </TableRow>
              ) : (
                (applications as any[])?.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-bold">{(app.startups as any)?.name}</TableCell>
                    <TableCell>{(app.startups as any)?.sector}</TableCell>
                    <TableCell>
                      {app.submitted_at && format(new Date(app.submitted_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        app.status === 'accepted' ? 'default' :
                        app.status === 'rejected' ? 'destructive' :
                        'secondary'
                      }>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/applications/${app.id}`}>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Eye className="h-4 w-4" />
                          Review
                        </Button>
                      </Link>
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
