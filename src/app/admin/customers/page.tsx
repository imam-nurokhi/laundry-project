import { prisma } from '@/lib/prisma'
import { Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    include: {
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Pelanggan</h1>
        <p className="text-slate-500 text-sm">{customers.length} pelanggan terdaftar</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">Belum ada pelanggan terdaftar</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Nama</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Telepon</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Email</th>
                <th className="text-center p-4 text-xs font-semibold text-slate-500 uppercase">Total Order</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase hidden lg:table-cell">Bergabung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        {c.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{c.name || '-'}</span>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="text-sm text-slate-600">{c.phone || '-'}</span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="text-sm text-slate-600">{c.email || '-'}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold text-sm items-center justify-center">
                      {c._count.orders}
                    </span>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className="text-sm text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
