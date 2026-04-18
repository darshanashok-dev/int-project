'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Plus, 
  Download,
  FileText,
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FundingOversightPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fundingData, setFundingData] = useState<any[]>([])
  const [startup, setStartup] = useState<any>(null)
  const [showSuccess, setShowSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        const { data: startupData, error: startupError } = await supabase
          .from('startups')
          .select('*')
          .eq('founder_id', user.id)
          .single()

        if (startupError) throw startupError

        if (startupData) {
          setStartup(startupData)
          const { data: funding, error: fundingError } = await supabase
            .from('funding')
            .select('*')
            .eq('startup_id', startupData.id)
            .order('date', { ascending: false })
          
          if (fundingError) throw fundingError
          if (funding) setFundingData(funding)
        }
      } catch (err) {
        console.error('Error loading funding data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleAction = (type: string) => {
    setShowSuccess(type)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const totalRaised = fundingData.reduce((acc, curr) => acc + Number(curr.amount), 0)

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="space-y-8 relative">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#202124] text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              {showSuccess === 'Export' ? <Download className="w-5 h-5 text-white" /> : 
               showSuccess === 'Record' ? <ArrowUpRight className="w-5 h-5 text-white" /> : 
               <FileText className="w-5 h-5 text-white" />}
            </div>
            <div>
              <p className="font-bold text-sm">
                {showSuccess === 'Export' ? 'Cap Table Exported' : 
                 showSuccess === 'Record' ? 'Investment Recorded' :
                 showSuccess === 'Document' ? 'Download Started' :
                 'Access Granted'}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {showSuccess === 'Export' ? 'Excel format generated' : 
                 showSuccess === 'Record' ? 'Synced to aggregate data' :
                 showSuccess === 'Document' ? 'Checking for latest version' :
                 'Secure data room opened'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="w-1 h-3 bg-black rounded-full"></span>
            Capital Management
          </p>
          <h1 className="text-4xl font-extrabold text-[#202124]">Funding Oversight</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => handleAction('Export')}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#e8eaed] text-foreground hover:bg-gray-200 transition-colors"
          >
            Export Cap Table
          </button>
          <button 
            onClick={() => handleAction('Record')}
            className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Record Investment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-4 bg-[#202124] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-400 mb-2">Total Capital Raised</p>
            <h2 className="text-5xl font-black mb-6">${totalRaised.toLocaleString()}</h2>
            <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full mb-8">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">+12.5% vs Last Quarter</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Runway</p>
                <p className="text-xl font-bold">18 Months</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cash Burn Rate</p>
                <p className="text-xl font-bold">$142k/mo</p>
              </div>
            </div>
          </div>
          <ArrowUpRight className="absolute top-8 right-8 w-8 h-8 opacity-20 group-hover:scale-125 transition-transform" />
        </div>

        <div className="col-span-3 bg-white border border-border rounded-3xl p-8 shadow-sm flex flex-col justify-between">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Cap Table Depth</p>
            <h3 className="text-3xl font-black text-[#202124]">14 Investors</h3>
          </div>
          <div className="flex -space-x-3 mt-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative">
                <div className="w-full h-full bg-black flex items-center justify-center text-[10px] text-white font-bold">
                  {i}
                </div>
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-[#f1f3f4] flex items-center justify-center text-xs font-bold text-muted-foreground">
              +10
            </div>
          </div>
        </div>

        <div className="col-span-5 bg-white border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Round Progress</p>
              <h3 className="text-2xl font-black text-[#202124]">Series A Alpha</h3>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg">
              Active Round
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="h-4 bg-[#f1f3f4] rounded-full overflow-hidden">
              <div className="h-full bg-black w-[80%] rounded-full"></div>
            </div>
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-muted-foreground">$3.2M / $4.0M Goal</span>
              <span className="text-[#202124]">80%</span>
            </div>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground font-medium leading-relaxed">
            Lead investor confirmed for $1.5M. Currently in due diligence for 3 follow-on tickets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Funding History Table */}
        <div className="col-span-8 bg-white border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-extrabold text-[#202124]">Funding History</h3>
            <button 
              onClick={() => handleAction('Export')}
              className="p-2 hover:bg-black/5 rounded-lg transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Round</th>
                <th className="pb-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Amount</th>
                <th className="pb-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date</th>
                <th className="pb-4 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Lead Investor</th>
                <th className="pb-4 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fundingData.length > 0 ? fundingData.map((f, i) => (
                <tr key={i} className="group transition-colors hover:bg-gray-50/50">
                  <td className="py-6 font-extrabold text-[#202124]">{f.type}</td>
                  <td className="py-6 font-bold text-muted-foreground">${Number(f.amount).toLocaleString()}</td>
                  <td className="py-6 text-sm font-medium text-muted-foreground">{new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f1f3f4] flex items-center justify-center shrink-0">
                        <Circle className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="font-bold text-sm text-[#202124]">{f.source}</span>
                    </div>
                  </td>
                  <td className="py-6 text-right">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm",
                      f.status === 'received' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {f.status === 'received' ? 'Completed' : 'Processing'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground font-medium">No funding history available yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-8">
          {/* Equity Breakdown */}
          <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-extrabold text-[#202124]">Equity Breakdown</h3>
            <div className="space-y-6">
              {[
                { label: 'Founding Team', value: 64.2, color: 'bg-black' },
                { label: 'Seed Investors', value: 22.5, color: 'bg-gray-400' },
                { label: 'ESOP Pool', value: 10.0, color: 'bg-gray-200' },
                { label: 'Advisors', value: 3.3, color: 'bg-gray-100' },
              ].map(item => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-[#202124]">{item.label}</span>
                    <span className="text-[#202124]">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-[#f1f3f4] rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Documents */}
          <div className="bg-white border border-border rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-extrabold text-[#202124]">Latest Documents</h3>
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Series_A_Termsheet_Draft.pdf', time: 'MODIFIED 2H AGO', icon: 'PDF' },
                { name: 'Q3_Financial_Projections.xlsx', time: 'MODIFIED YESTERDAY', icon: 'XL' },
              ].map((doc, i) => (
                <div 
                  key={i} 
                  onClick={() => handleAction('Document')}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#f1f3f4] transition-colors cursor-pointer group"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm",
                    doc.icon === 'PDF' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                  )}>
                    {doc.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#202124] truncate">{doc.name}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{doc.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleAction('DataRoom')}
              className="w-full mt-8 flex items-center justify-between py-4 border-t border-border group"
            >
              <span className="text-sm font-bold text-muted-foreground group-hover:text-[#202124] transition-colors">View Data Room</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Circle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}
