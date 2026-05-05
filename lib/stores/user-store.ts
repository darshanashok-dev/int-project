import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'

type Role = 'admin' | 'founder' | 'mentor' | 'investor' | 'manager'

interface UserStore {
  user: User | null
  role: Role | null
  setUser: (user: User | null) => void
  clear: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  role: null,
  setUser: (user) =>
    set({
      user,
      role: (user?.user_metadata?.role as Role) ?? null,
    }),
  clear: () => set({ user: null, role: null }),
}))
