import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import CustomerDashboard from '@/components/customer/CustomerDashboard'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const userId = (session.user as any).id
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: { include: { serviceItem: { include: { category: true } } } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return <CustomerDashboard orders={orders} user={session.user as any} />
}
