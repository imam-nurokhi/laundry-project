import { getDashboardStats } from '@/lib/actions/analytics'
import { prisma } from '@/lib/prisma'
import AdminDashboardClient from '@/components/admin/AdminDashboardClient'

export default async function AdminDashboardPage() {
  const [stats, recentOrders] = await Promise.all([
    getDashboardStats(),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, phone: true } },
        items: { select: { id: true } },
      },
    }),
  ])

  return <AdminDashboardClient stats={stats} recentOrders={recentOrders} />
}
