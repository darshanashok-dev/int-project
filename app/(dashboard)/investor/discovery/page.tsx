'use client'

import { useState } from 'react'
import { useStartupDiscovery } from '@/lib/hooks/use-startup-discovery'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, MapPin, TrendingUp, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { ErrorState } from '@/components/shared/error-state'


export default function InvestorDiscoveryPage() {
  const [filters, setFilters] = useState({
    sector: 'all',
    stage: 'all',
    search: ''
  })

  const { data: startups, isLoading, isError, error, refetch } = useStartupDiscovery(filters)

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Startup Discovery</h1>
        <p className="text-muted-foreground">Find and track the next unicorn in our ecosystem.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search startups..." 
            className="pl-10 rounded-xl"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <Select value={filters.sector} onValueChange={(v) => setFilters({ ...filters, sector: v })}>
          <SelectTrigger className="w-[180px] rounded-xl">
            <SelectValue placeholder="Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            <SelectItem value="SaaS">SaaS</SelectItem>
            <SelectItem value="Fintech">Fintech</SelectItem>
            <SelectItem value="Healthtech">Healthtech</SelectItem>
            <SelectItem value="AI/ML">AI/ML</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.stage} onValueChange={(v) => setFilters({ ...filters, stage: v })}>
          <SelectTrigger className="w-[180px] rounded-xl">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="Ideation">Ideation</SelectItem>
            <SelectItem value="MVP">MVP</SelectItem>
            <SelectItem value="Early Traction">Early Traction</SelectItem>
            <SelectItem value="Scaling">Scaling</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-[2rem]" />
          ))
        ) : (startups as any[])?.map((startup) => (
          <Card key={startup.id} className="rounded-[2rem] overflow-hidden hover:shadow-xl transition-shadow border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-indigo-200 text-indigo-600">
                  {startup.sector}
                </Badge>
                <span className="text-[10px] font-bold text-muted-foreground">{startup.stage}</span>
              </div>
              <CardTitle className="text-xl font-black">{startup.name}</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                {startup.strategy_summary || 'Innovative solution tackling industry challenges with modern technology.'}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <MapPin className="h-3 w-3" /> Bengaluru
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <TrendingUp className="h-3 w-3" /> {startup.stage}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href={`/investor/startups/${startup.id}`} className="w-full">
                <Button className="w-full rounded-xl font-bold">View Profile</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
