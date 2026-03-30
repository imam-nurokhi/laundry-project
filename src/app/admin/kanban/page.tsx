import { prisma } from '@/lib/prisma'
import KanbanBoard from '@/components/admin/KanbanBoard'

export const dynamic = 'force-dynamic'

export default async function KanbanPage() {
  const orders = await prisma.order.findMany({
    where: {
      status: { in: ['PENDING', 'PICKED_UP', 'WASHING', 'IRONING', 'READY'] },
    },
    include: {
      user: { select: { name: true, phone: true } },
      items: { include: { serviceItem: { select: { name: true, unit: true } } } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Kanban Board</h1>
        <p className="text-slate-500 text-sm">Kelola status cucian dengan mudah</p>
      </div>
      <KanbanBoard initialOrders={orders} />
    </div>
  )
}
