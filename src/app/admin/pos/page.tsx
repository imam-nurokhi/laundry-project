import { prisma } from '@/lib/prisma'
import POSSystem from '@/components/admin/POSSystem'

export default async function POSPage() {
  const [serviceItems, users] = await Promise.all([
    prisma.serviceItem.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
    }),
    prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      select: { id: true, name: true, email: true, phone: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">POS Kasir</h1>
        <p className="text-slate-500 text-sm">Buat order baru dengan cepat</p>
      </div>
      <POSSystem serviceItems={serviceItems} users={users} />
    </div>
  )
}
