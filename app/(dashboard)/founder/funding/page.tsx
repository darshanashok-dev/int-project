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
  X,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

import { Database } from '@/types/database'

type Funding = Database['public']['Tables']['funding']['Row']
type Document = Database['public']['Tables']['documents']['Row']
type Equity = Database['public']['Tables']['equity']['Row']
type Startup = Database['public']['Tables']['startups']['Row']

export default function FundingOversightPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fundingData, setFundingData] = useState<Funding[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [equity, setEquity] = useState<Equity[]>([])
  const [startupDetails, setStartupDetails] = useState<Startup | null>(null)
  const [showSuccess, setShowSuccess] = useState<string | null>(null)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state for new investment
  const [newInvestment, setNewInvestment] = useState({
    amount: '',
    source: '',
    round: 'Seed',
    date: new Date().toISOString().split('T')[0],
    status: 'received'
  })

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
          .select('id, name, active_round_name, round_status, funding_goal')
          .eq('founder_id', user.id)
          .single()

        if (startupError) throw startupError

        const startupRow = startupData as { id: string, name: string, active_round_name: string | null, round_status: string | null, funding_goal: number | null } | null
        if (startupRow) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setStartupDetails(startupRow as any)
          
          const { data: funding, error: fundingError } = await supabase
            .from('funding')
            .select('id, amount, source, round, date, status')
            .eq('startup_id', startupRow.id)
            .order('date', { ascending: false })
          
          if (fundingError) throw fundingError
          if (funding) setFundingData(funding)

          // Fetch documents
          const { data: docs } = await supabase
            .from('documents')
            .select('id, name, updated_at')
            .eq('startup_id', startupRow.id)
            .order('updated_at', { ascending: false })
            .limit(5)
          if (docs && docs.length > 0) setDocuments(docs)
          else setDocuments([
            { id: 'd1', name: 'Series_A_Term_Sheet.pdf', updated_at: new Date().toISOString() },
            { id: 'd2', name: 'Cap_Table_v4.xlsx', updated_at: new Date(Date.now() - 86400000).toISOString() },
            { id: 'd3', name: 'Investor_Deck_Final.pdf', updated_at: new Date(Date.now() - 172800000).toISOString() }
          ] as any)

          // Fetch equity
          const { data: equityData } = await supabase
            .from('equity')
            .select('stakeholder_name, stakeholder_type, equity_percentage')
            .eq('startup_id', startupRow.id)
            .order('equity_percentage', { ascending: false })
          if (equityData && equityData.length > 0) setEquity(equityData)
          else setEquity([
            { stakeholder_name: 'Founding Team', stakeholder_type: 'founder', equity_percentage: 65 },
            { stakeholder_name: 'Lead Investor', stakeholder_type: 'investor', equity_percentage: 20 },
            { stakeholder_name: 'Employee Option Pool', stakeholder_type: 'other', equity_percentage: 15 }
          ] as any)
        } else {
          // Fallback mock data if no startup is found
          setStartupDetails({ name: 'Quantum Leap', active_round_name: 'Seed', funding_goal: 2000000, round_status: 'Active' } as any)
          setFundingData([
            { id: 'f1', amount: 500000, source: 'Sequoia Capital', round: 'Pre-Seed', date: '2023-11-15', status: 'received' },
            { id: 'f2', amount: 250000, source: 'Y Combinator', round: 'Pre-Seed', date: '2023-09-01', status: 'received' }
          ] as any)
          setDocuments([
            { id: 'd1', name: 'Incorporation_Docs.pdf', updated_at: new Date().toISOString() },
            { id: 'd2', name: 'Founder_Agreement.pdf', updated_at: new Date(Date.now() - 86400000).toISOString() }
          ] as any)
          setEquity([
            { stakeholder_name: 'Founding Team', stakeholder_type: 'founder', equity_percentage: 90 },
            { stakeholder_name: 'Advisors', stakeholder_type: 'other', equity_percentage: 10 }
          ] as any)
        }
      } catch (err) {
        console.error('Error loading funding data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [supabase])

  const handleAction = (type: string) => {
    setShowSuccess(type)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleRecordInvestment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startupDetails) return
    setIsSubmitting(true)
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from('funding') as any)
        .insert([{
          startup_id: startupDetails.id,
          amount: parseFloat(newInvestment.amount),
          source: newInvestment.source,
          round: newInvestment.round,
          date: newInvestment.date,
          status: newInvestment.status
        }])
        .select()

      if (error) throw error
      
      if (data) {
        setFundingData([data[0], ...fundingData])
        setShowRecordModal(false)
        handleAction('Investment Recorded')
        setNewInvestment({
          amount: '',
          source: '',
          round: 'Seed',
          date: new Date().toISOString().split('T')[0],
          status: 'received'
        })
      }
    } catch (err) {
      console.error('Error recording investment:', err)
      alert('Failed to record investment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const exportCapTable = () => {
    if (equity.length === 0) {
      alert('No cap table data to export.')
      return
    }

    const headers = ['Stakeholder', 'Type', 'Equity Percentage']
    const rows = equity.map(item => [
      item.stakeholder_name,
      item.stakeholder_type,
      `${item.equity_percentage}%`
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `Cap_Table_${startupDetails?.name || 'Venture'}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    handleAction('Export Complete')
  }

  const totalRaised = fundingData.reduce((acc, curr) => acc + Number(curr.amount), 0)
  const investorCount = new Set(fundingData.map(f => f.source)).size
  
  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="space-y-8 relative">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-8 right-8 z-[100] animate-in slide-in-from-top-4 duration-300">
          <div className="bg-[#202124] text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/100 rounded-full flex items-center justify-center">
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
          <h1 className="text-4xl font-extrabold text-foreground">Funding Oversight</h1>
        </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={exportCapTable}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-foreground bg-secondary hover:bg-gray-200 transition-colors"
            >
              Export Cap Table
            </button>
            <button 
              onClick={() => setShowRecordModal(true)}
              className="flex items-center gap-2 px-8 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-sm active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Record Investment
            </button>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="col-span-1 md:col-span-6 bg-card border border-border rounded-3xl p-8 shadow-sm flex flex-col justify-between">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 mb-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Cap Table Depth</p>
            <h3 className="text-3xl font-black text-foreground">{investorCount} {investorCount === 1 ? 'Investor' : 'Investors'}</h3>
          </div>
        </div>



        <div className="col-span-1 md:col-span-6 bg-card border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Round Progress</p>
              <h3 className="text-2xl font-black text-foreground">{startupDetails?.active_round_name || 'Active Round'}</h3>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg">
              {startupDetails?.round_status || 'Active Round'}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="h-4 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-black rounded-full" 
                style={{ width: `${Math.min(100, (totalRaised / (startupDetails?.funding_goal || 1)) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-muted-foreground">
                ${(totalRaised / 1000000).toFixed(1)}M / ${((startupDetails?.funding_goal || 0) / 1000000).toFixed(1)}M Goal
              </span>
              <span className="text-foreground">{Math.round((totalRaised / (startupDetails?.funding_goal || 1)) * 100)}%</span>
            </div>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground font-medium leading-relaxed">
            {totalRaised >= (startupDetails?.funding_goal || 0) 
              ? "Target milestone achieved. Consider closing the round or expanding the goal."
              : "Active funding cycle in progress. Ensure all due diligence documents are up to date."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Funding History Table */}
        <div className="col-span-1 md:col-span-8 bg-card border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-extrabold text-foreground">Funding History</h3>
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
                  <td className="py-6 font-extrabold text-foreground">{f.round}</td>
                  <td className="py-6 font-bold text-muted-foreground">${Number(f.amount).toLocaleString()}</td>
                  <td className="py-6 text-sm font-medium text-muted-foreground">{new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <Circle className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="font-bold text-sm text-foreground">{f.source}</span>
                    </div>
                  </td>
                  <td className="py-6 text-right">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm",
                      f.status === 'received' ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
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
        <div className="col-span-1 md:col-span-4 space-y-8">
          {/* Equity Breakdown */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-extrabold text-foreground">Equity Breakdown</h3>
            <div className="space-y-6">
              {equity.length > 0 ? equity.map(item => (
                <div key={item.stakeholder_name} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-foreground">{item.stakeholder_name}</span>
                    <span className="text-foreground">{item.equity_percentage}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full", 
                        item.stakeholder_type === 'founder' ? 'bg-black' : 'bg-gray-400'
                      )} 
                      style={{ width: `${item.equity_percentage}%` }}
                    ></div>
                  </div>
                </div>
              )) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-foreground">Founding Team</span>
                    <span className="text-foreground">100%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-black rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-medium mt-4">
                    Initialize your cap table in the &ldquo;My Startup&rdquo; settings to see detailed distribution.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Latest Documents */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-extrabold text-foreground">Latest Documents</h3>
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              {documents.length > 0 ? documents.map((doc, i) => (
                <div 
                  key={i} 
                  onClick={() => handleAction('Document')}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary transition-colors cursor-pointer group"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm",
                    (doc.name?.endsWith('.pdf')) ? "bg-red-50 text-red-600" : "bg-emerald-500/10 text-emerald-600"
                  )}>
                    {doc.name?.split('.').pop()?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">{doc.name}</p>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                      MODIFIED {new Date(doc.updated_at || 0).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center text-xs font-bold text-muted-foreground bg-secondary/50 rounded-2xl border border-dashed border-border/50">
                  No documents uploaded yet.
                </div>
              )}
            </div>

            <Link 
              href="/founder/funding/data-room"
              className="w-full mt-8 flex items-center justify-between py-4 border-t border-border group"
            >
              <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">View Data Room</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>
      {/* Record Investment Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowRecordModal(false)}></div>
          <div className="relative bg-card w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowRecordModal(false)}
              className="absolute top-8 right-8 p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">Record Investment</h2>
            <p className="text-muted-foreground font-medium mb-8">Add a new funding record to your venture history.</p>

            <form onSubmit={handleRecordInvestment} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">Funding Amount (USD)</label>
                <input 
                  required
                  type="number" 
                  value={newInvestment.amount}
                  onChange={e => setNewInvestment({...newInvestment, amount: e.target.value})}
                  placeholder="e.g. 500000"
                  className="w-full h-14 px-6 bg-secondary rounded-xl border-none font-bold text-foreground focus:ring-2 focus:ring-black/5"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">Investor / Source Name</label>
                <input 
                  required
                  type="text" 
                  value={newInvestment.source}
                  onChange={e => setNewInvestment({...newInvestment, source: e.target.value})}
                  placeholder="e.g. Sequoia Capital"
                  className="w-full h-14 px-6 bg-secondary rounded-xl border-none font-bold text-foreground focus:ring-2 focus:ring-black/5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">Round</label>
                  <select 
                    value={newInvestment.round}
                    onChange={e => setNewInvestment({...newInvestment, round: e.target.value})}
                    className="w-full h-14 px-6 bg-secondary rounded-xl border-none font-bold text-foreground focus:ring-2 focus:ring-black/5 appearance-none"
                  >
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">Date Received</label>
                  <input 
                    type="date" 
                    value={newInvestment.date}
                    onChange={e => setNewInvestment({...newInvestment, date: e.target.value})}
                    className="w-full h-14 px-6 bg-secondary rounded-xl border-none font-bold text-foreground focus:ring-2 focus:ring-black/5"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 bg-black text-white rounded-2xl font-black text-lg hover:shadow-xl transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Confirm Investment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Circle(props: { className?: string }) {
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
