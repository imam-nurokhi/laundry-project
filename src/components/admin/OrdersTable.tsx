'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import { updateOrderStatus } from '@/lib/actions/orders'
import { formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils'
import { OrderStatusEnum } from '@prisma/client'

const STATUS_OPTIONS: OrderStatusEnum[] = ['PENDING', 'PICKED_UP', 'WASHING', 'IRONING', 'READY', 'COMPLETED']

interface Props {
  orders: any[]
}

export default function OrdersTable({ orders: initialOrders }: Props) {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [isPending, startTransition] = useTransition()

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.phone?.includes(search)
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleStatusChange = (orderId: string, newStatus: OrderStatusEnum) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus)
    })
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari order atau pelanggan..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
        >
          <option value="ALL">Semua Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{getStatusLabel(s)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Order</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Pelanggan</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Item</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-right p-4 text-xs font-semibold text-slate-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="p-4">
                    <p className="font-medium text-slate-800 text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {order.isExpress && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">⚡ Express</span>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-slate-800">{order.user?.name || '-'}</p>
                    <p className="text-xs text-slate-400">{order.user?.phone || order.user?.email || '-'}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <p className="text-sm text-slate-600">
                      {order.items.slice(0, 2).map((i: any) => i.serviceItem.name).join(', ')}
                      {order.items.length > 2 && ` +${order.items.length - 2}`}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatusEnum)}
                        disabled={isPending}
                        className={`text-xs font-medium px-2.5 py-1.5 rounded-full appearance-none pr-6 cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-teal-400 ${getStatusColor(order.status)}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{getStatusLabel(s)}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <p className="font-bold text-teal-600 text-sm">{formatCurrency(order.totalAmount)}</p>
                    <p className={`text-xs ${order.paymentStatus === 'PAID' ? 'text-green-500' : 'text-amber-500'}`}>
                      {order.paymentStatus === 'PAID' ? '✓ Lunas' : 'Belum Lunas'}
                    </p>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">Tidak ada order yang sesuai</div>
          )}
        </div>
      </div>
    </div>
  )
}
