'use client'

import { useState, useMemo } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  Shield,
  UserPlus,
  Trash2,
  Check,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { deleteUserAction, updateUserRoleAction } from './new/actions'

interface User {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
}

export default function UsersManagementClient({ initialUsers }: { initialUsers: User[] }) {
  // High-fidelity Mock Data for polished presentation
  const MOCK_USERS: User[] = [
    { id: '1', email: 'alex.chen@polaris.vc', full_name: 'Alex Chen', role: 'admin', created_at: new Date().toISOString() },
    { id: '2', email: 'sarah.founder@innovate.co', full_name: 'Sarah Miller', role: 'founder', created_at: new Date().toISOString() },
    { id: '3', email: 'david.invest@venture.com', full_name: 'David Wilson', role: 'investor', created_at: new Date().toISOString() },
    { id: '4', email: 'elena.mentor@expert.org', full_name: 'Elena Rodriguez', role: 'mentor', created_at: new Date().toISOString() },
    { id: '5', email: 'marcus.manage@polaris.vc', full_name: 'Marcus Thorne', role: 'manager', created_at: new Date().toISOString() },
    { id: '6', email: 'james.bond@startup.io', full_name: 'James Bond', role: 'founder', created_at: new Date().toISOString() },
  ]

  const [users, setUsers] = useState<User[]>(initialUsers.length > 0 ? initialUsers : MOCK_USERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const normalizeRole = (role: string | null | undefined) => (role || '').trim().toLowerCase()
  const formatRoleLabel = (role: string) => `${role.charAt(0).toUpperCase()}${role.slice(1)}s`

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        (user.full_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesRole = roleFilter === 'all' || normalizeRole(user.role) === roleFilter
      
      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, roleFilter])

  const availableRoleFilters = useMemo(() => {
    const roleSet = new Set(users.map((user) => normalizeRole(user.role)).filter(Boolean))
    return ['all', ...Array.from(roleSet).sort()]
  }, [users])

  const stats = useMemo(() => {
    const roleCounts = users.reduce<Record<string, number>>((acc, user) => {
      const role = normalizeRole(user.role) || 'unassigned'
      acc[role] = (acc[role] || 0) + 1
      return acc
    }, {})

    const roleOrder = ['admin', 'founder', 'mentor', 'manager', 'investor']
    const sortedRoleKeys = [
      ...roleOrder.filter((role) => roleCounts[role]),
      ...Object.keys(roleCounts).filter((role) => !roleOrder.includes(role)).sort()
    ]

    const roleColorMap: Record<string, string> = {
      admin: 'text-indigo-600',
      founder: 'text-emerald-600',
      mentor: 'text-purple-600',
      manager: 'text-amber-600',
      investor: 'text-rose-600',
      unassigned: 'text-slate-600'
    }

    return [
      { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600' },
      ...sortedRoleKeys.map((role) => ({
        label: role === 'unassigned' ? 'Unassigned Roles' : formatRoleLabel(role),
        value: roleCounts[role],
        icon: role === 'admin' ? Shield : Users,
        color: roleColorMap[role] || 'text-slate-600'
      }))
    ]
  }, [users])

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    
    setIsProcessing(userId)
    setActionError(null)
    try {
      const result = await deleteUserAction(userId)
      if (result.success) {
        setUsers((previous) => previous.filter((u) => u.id !== userId))
      } else {
        setActionError(result.error || 'Failed to delete user')
      }
    } catch {
      setActionError('An unexpected error occurred while deleting.')
    } finally {
      setIsProcessing(null)
      setActiveMenu(null)
    }
  }

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    setIsProcessing(userId)
    setActionError(null)
    try {
      const result = await updateUserRoleAction(userId, newRole)
      if (result.success) {
        setUsers((previous) => previous.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
      } else {
        setActionError(result.error || 'Failed to update role')
      }
    } catch {
      setActionError('An unexpected error occurred while updating role.')
    } finally {
      setIsProcessing(null)
      setActiveMenu(null)
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage platform access, roles, and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/users/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            Add New User
          </Link>
          <div className="relative">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none flex items-center gap-2 px-10 py-2.5 bg-card border border-border/50 rounded-xl font-bold text-sm hover:bg-secondary transition-all focus:outline-none focus:ring-2 focus:ring-black/5"
            >
              {availableRoleFilters.map((role) => (
                <option key={role} value={role}>
                  {role === 'all' ? 'All Roles' : formatRoleLabel(role)}
                </option>
              ))}
            </select>
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
          </div>
        ))}
      </div>

      {actionError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 animate-in fade-in duration-300 shadow-sm">
          {actionError}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-card border border-border/50 rounded-2xl shadow-sm">
        <div className="p-4 border-b border-border/50 bg-secondary/50 rounded-t-2xl flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="w-full pl-10 pr-4 py-2 bg-card border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-secondary/50">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">User</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground">Joined</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/50 transition-colors group relative">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-slate-400">
                        {(user.full_name || user.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{user.full_name || 'Anonymous User'}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider",
                      normalizeRole(user.role) === 'admin' ? "bg-indigo-500/10 text-indigo-700" :
                      normalizeRole(user.role) === 'founder' ? "bg-emerald-500/10 text-emerald-700" :
                      normalizeRole(user.role) === 'mentor' ? "bg-purple-500/10 text-purple-700" :
                      "bg-secondary text-slate-700"
                    )}>
                      <Shield className="w-3 h-3" />
                      {normalizeRole(user.role) || 'unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                    {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    {isProcessing === user.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600 ml-auto" />
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                        </button>
                        
                        {activeMenu === user.id && (
                          <div className="absolute right-6 top-14 w-48 bg-card border border-border/50 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in zoom-in duration-200">
                            <div className="px-4 py-2 border-b border-border/50 mb-1">
                              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Change Role</p>
                            </div>
                            {['admin', 'founder', 'mentor', 'manager', 'investor'].map((role) => (
                              <button
                                key={role}
                                onClick={() => handleRoleUpdate(user.id, role)}
                                className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold hover:bg-secondary transition-colors"
                              >
                                <span className="capitalize">{role}</span>
                                {normalizeRole(user.role) === role && <Check className="w-3 h-3 text-blue-600" />}
                              </button>
                            ))}
                            <div className="h-px bg-border/50 my-1" />
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-muted-foreground">No users matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
