import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import UsersManagementClient from './UserTable'

export default async function UsersManagement() {
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const callerRole =
    (typeof user.app_metadata?.role === 'string' && user.app_metadata.role) ||
    (typeof user.user_metadata?.role === 'string' && user.user_metadata.role) ||
    null

  if (callerRole !== 'admin') {
    redirect('/login')
  }

  const adminClient = createAdminClient()
  const { data: authUsersData, error } = await adminClient.auth.admin.listUsers({
    page: 1,
    perPage: 1000
  })

  if (error) {
    return <UsersManagementClient initialUsers={[]} />
  }

  const users =
    authUsersData.users?.map((authUser) => ({
      id: authUser.id,
      email: authUser.email || 'unknown@example.com',
      full_name:
        typeof authUser.user_metadata?.full_name === 'string' ? authUser.user_metadata.full_name : null,
      role:
        (typeof authUser.app_metadata?.role === 'string' && authUser.app_metadata.role) ||
        (typeof authUser.user_metadata?.role === 'string' && authUser.user_metadata.role) ||
        'unknown',
      created_at: authUser.created_at || new Date().toISOString()
    })) || []

  users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return <UsersManagementClient initialUsers={users} />
}
