import { prisma } from '@/lib/prisma'
import OrdersTable from '@/components/admin/OrdersTable'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: {
        include: { serviceItem: { select: { name: true, unit: true } } },
        take: 3,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Semua Order</h1>
        <p className="text-slate-500 text-sm">{orders.length} order ditemukan</p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  )
}
