import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SuperAdminLayoutClient from './layout-client'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if user is authenticated and is a super admin
  if (!session) {
    // Show login page
    return <SuperAdminLayoutClient showLogin={true} />
  }

  try {
    const { data: superAdminRecord } = await supabase
      .from('super_admin_users')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (!superAdminRecord) {
      // User is authenticated but not a super admin
      redirect('/')
    }
  } catch (error) {
    // User is not a super admin or there was an error
    redirect('/')
  }

  // User is authenticated and is a super admin
  return <SuperAdminLayoutClient showLogin={false}>{children}</SuperAdminLayoutClient>
}
