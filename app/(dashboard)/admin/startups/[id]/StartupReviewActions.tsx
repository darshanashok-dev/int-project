'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  XCircle,
  Loader2,
  Save,
  Check,
  FileText,
  UserPlus,
  Trash2,
  GraduationCap,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { updateStartupStatusAction } from '../actions'
import { saveReviewScoreAction } from '@/lib/actions/review-score'
import { assignMentorAction, removeMentorAssignmentAction } from '@/lib/actions/mentors'

interface StartupReviewActionsProps {
  startup: {
    id: string
    status: string
  }
  latestReviewNote: string
  latestReviewAt: string | null
  applicationsCount: number
  latestApplicationStatus: string | null
  latestScores: {
    team_score: number | null
    market_score: number | null
    traction_score: number | null
    uniqueness_score: number | null
  } | null
  assignedMentors: { id: string, full_name: string | null, email: string }[]
  allMentors: { id: string, full_name: string | null, email: string }[]
}

export default function StartupReviewActions({
  startup,
  latestReviewNote,
  latestReviewAt,
  applicationsCount,
  latestApplicationStatus,
  latestScores,
  assignedMentors,
  allMentors,
}: StartupReviewActionsProps) {
  const router = useRouter()
  const [status, setStatus] = useState(startup.status)
  const [isProcessing, setIsProcessing] = useState(false)
  const [notes, setNotes] = useState(latestReviewNote)
  const [savedNotes, setSavedNotes] = useState(false)
  const [teamScore, setTeamScore] = useState<number | ''>(latestScores?.team_score ?? '')
  const [marketScore, setMarketScore] = useState<number | ''>(latestScores?.market_score ?? '')
  const [tractionScore, setTractionScore] = useState<number | ''>(latestScores?.traction_score ?? '')
  const [uniquenessScore, setUniquenessScore] = useState<number | ''>(latestScores?.uniqueness_score ?? '')
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleStatusUpdate = async (newStatus: string) => {
    setIsProcessing(true)
    try {
      const result = await updateStartupStatusAction(startup.id, newStatus)
      if (result.success) {
        setStatus(newStatus)
        router.refresh()
      } else {
        alert(result.error || 'Failed to update status')
      }
    } catch {
      alert('An unexpected error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveNotes = async () => {
    setValidationError(null)

    if (!notes.trim()) {
      setValidationError('Comment is required')
      return
    }
    if (teamScore === '' || marketScore === '' || tractionScore === '' || uniquenessScore === '') {
      setValidationError('All four scores are required (1–10)')
      return
    }

    setIsProcessing(true)
    try {
      const result = await saveReviewScoreAction({
        startupId:       startup.id,
        teamScore:       Number(teamScore),
        marketScore:     Number(marketScore),
        tractionScore:   Number(tractionScore),
        uniquenessScore: Number(uniquenessScore),
        overallComment:  notes,
      })

      if (!result.success) {
        setValidationError(result.error || 'Failed to save review score')
        return
      }

      setSavedNotes(true)
      setTimeout(() => setSavedNotes(false), 2000)
      router.refresh()
    } catch {
      setValidationError('An unexpected error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAssignMentor = async (mentorId: string) => {
    if (!mentorId) return
    setIsProcessing(true)
    try {
      const result = await assignMentorAction(startup.id, mentorId)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || 'Failed to assign mentor')
      }
    } catch {
      alert('An unexpected error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemoveMentor = async (mentorId: string) => {
    if (!confirm('Are you sure you want to remove this mentor?')) return
    setIsProcessing(true)
    try {
      const result = await removeMentorAssignmentAction(startup.id, mentorId)
      if (result.success) {
        router.refresh()
      } else {
        alert(result.error || 'Failed to remove mentor')
      }
    } catch {
      alert('An unexpected error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const statuses = [
    { id: 'active',     label: 'Approve & Activate',   icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-500/10 hover:bg-emerald-100', border: 'border-emerald-200' },
    { id: 'pending',    label: 'Mark Pending Review',   icon: Clock,        color: 'text-amber-600',   bg: 'bg-amber-500/10 hover:bg-amber-100',     border: 'border-amber-200'   },
    { id: 'waitlisted', label: 'Move to Waitlist',      icon: Briefcase,    color: 'text-purple-600',  bg: 'bg-purple-500/10 hover:bg-purple-100',   border: 'border-purple-200'  },
    { id: 'rejected',   label: 'Reject Venture',        icon: XCircle,      color: 'text-rose-600',    bg: 'bg-rose-500/10 hover:bg-rose-100',       border: 'border-rose-200'    },
  ]

  interface ScoreField {
    id: string
    label: string
    value: number | ''
    setter: (val: number | '') => void
  }

  const scoreFields: ScoreField[] = [
    { id: 'team-score',       label: 'Team Score',       value: teamScore,       setter: setTeamScore       },
    { id: 'market-score',     label: 'Market Score',     value: marketScore,     setter: setMarketScore     },
    { id: 'traction-score',   label: 'Traction Score',   value: tractionScore,   setter: setTractionScore   },
    { id: 'uniqueness-score', label: 'Uniqueness Score', value: uniquenessScore, setter: setUniquenessScore },
  ]

  return (
    <div className="bg-[#202124] rounded-3xl p-6 shadow-xl space-y-6 text-white relative overflow-hidden">
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/100/20 blur-[80px] rounded-full" />
      
      <div>
        <h3 className="font-bold text-lg mb-1">Evaluation & Actions</h3>
        <p className="text-sm text-gray-400 font-medium">Update venture status</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-card/5 p-4 space-y-2 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Review Context</p>
        <div className="text-sm font-semibold text-white/90 flex items-center justify-between">
          <span>Applications</span>
          <span>{applicationsCount}</span>
        </div>
        <div className="text-sm font-semibold text-white/90 flex items-center justify-between">
          <span>Latest Application</span>
          <span className="uppercase text-xs tracking-wider">{latestApplicationStatus || 'N/A'}</span>
        </div>
        <div className="text-sm font-semibold text-white/90 flex items-center justify-between">
          <span>Last Review</span>
          <span className="text-xs">
            {latestReviewAt ? new Date(latestReviewAt).toLocaleString() : 'Not reviewed'}
          </span>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        {statuses.map((s) => (
          <button
            key={s.id}
            onClick={() => handleStatusUpdate(s.id)}
            disabled={isProcessing}
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-2xl border transition-all disabled:opacity-50",
              status === s.id 
                ? cn(s.bg, s.border, "shadow-inner") 
                : "bg-card/5 border-white/10 hover:bg-card/10 text-white"
            )}
          >
            <div className="flex items-center gap-3">
              <s.icon className={cn("w-5 h-5", status === s.id ? s.color : "text-gray-400")} />
              <span className={cn(
                "font-bold text-sm",
                status === s.id ? s.color : "text-white"
              )}>
                {s.label}
              </span>
            </div>
            {status === s.id && <Check className={cn("w-5 h-5", s.color)} />}
          </button>
        ))}
      </div>

      <div className="pt-6 border-t border-white/10 relative z-10 space-y-4">
        {/* Score inputs */}
        <div className="grid grid-cols-2 gap-3">
          {scoreFields.map((field) => (
            <div key={field.id} className="space-y-1">
              <label
                htmlFor={field.id}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 block"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                type="number"
                min={1}
                max={10}
                value={field.value}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Number(e.target.value)
                  field.setter(val)
                }}
                placeholder="1–10"
                className="w-full p-2 bg-black/40 border border-white/10 rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-gray-600"
              />
            </div>
          ))}
        </div>

        {/* Comment textarea */}
        <div>
          <label
            htmlFor="overall-comment"
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block"
          >
            Internal Review Notes
          </label>
          <textarea
            id="overall-comment"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your evaluation notes for this startup..."
            className="w-full h-32 p-4 bg-black/40 border border-white/10 rounded-2xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none placeholder:text-gray-600"
          />
        </div>

        {validationError && (
          <p className="text-xs font-semibold text-rose-400">{validationError}</p>
        )}

        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <FileText className="w-3 h-3" />
          Scores and notes are stored against the most recent application.
        </div>

        <button
          onClick={handleSaveNotes}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 py-3 bg-card text-black rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : savedNotes ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Review
            </>
          )}
        </button>
      </div>

      {/* Mentor Assignment Section */}
      <div className="pt-6 border-t border-white/10 relative z-10 space-y-4">
        <div>
          <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            Mentor Assignments
          </h4>
          <p className="text-[10px] text-gray-400 font-medium">Assign architectural advisors to this venture</p>
        </div>

        <div className="flex gap-2">
          <select 
            onChange={(e) => handleAssignMentor(e.target.value)}
            disabled={isProcessing}
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            defaultValue=""
          >
            <option value="" disabled>Select a mentor to assign...</option>
            {allMentors
              .filter(m => !assignedMentors.some(am => am.id === m.id))
              .map(m => (
                <option key={m.id} value={m.id}>
                  {m.full_name || m.email}
                </option>
              ))
            }
          </select>
          <button 
            disabled={isProcessing}
            className="p-2 bg-card/10 hover:bg-card/20 rounded-xl transition-all"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {assignedMentors.length > 0 ? assignedMentors.map((mentor) => (
            <div key={mentor.id} className="flex items-center justify-between p-3 bg-card/5 rounded-xl border border-white/5 group/mentor">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/100/20 flex items-center justify-center text-[10px] font-bold text-blue-400">
                  {(mentor.full_name || mentor.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white">{mentor.full_name || 'Anonymous'}</p>
                  <p className="text-[9px] text-gray-500 truncate max-w-[120px]">{mentor.email}</p>
                </div>
              </div>
              <button 
                onClick={() => handleRemoveMentor(mentor.id)}
                className="p-1.5 hover:bg-rose-500/100/20 text-gray-500 hover:text-rose-400 rounded-lg transition-all opacity-0 group-hover/mentor:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )) : (
            <div className="py-4 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-[10px] font-medium text-gray-500">No mentors assigned yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
