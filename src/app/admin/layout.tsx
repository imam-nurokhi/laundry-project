import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const role = (session.user as any)?.role
  if (role !== 'ADMIN' && role !== 'STAFF') redirect('/')

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar user={session.user as any} />
      <main className="flex-1 ml-0 lg:ml-64">
        {children}
      </main>
    </div>
  )
}
