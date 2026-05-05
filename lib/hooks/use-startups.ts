import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/browser'

export function useMyStartup() {
  return useQuery({
    queryKey: ['my-startup'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from('startups' as any)
        .select('*')
        .eq('founder_id', user.id)
        .single()
      
      if (error) throw error
      return data
    },
  })
}
