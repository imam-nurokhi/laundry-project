'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Package, Clock, CheckCircle2, DollarSign, LogOut, Droplets } from 'lucide-react'
import { signOut } from 'next-auth/react'
import OrderTracker from './OrderTracker'
import { formatCurrency, getStatusLabel } from '@/lib/utils'

interface Props {
  orders: any[]
  user: { name?: string; email?: string }
}

export default function CustomerDashboard({ orders, user }: Props) {
  const activeOrders = orders.filter((o) => !['COMPLETED'].includes(o.status))
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED')
  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  const stats = [
    { label: 'Total Order', value: orders.length, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Sedang Proses', value: activeOrders.length, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Selesai', value: completedOrders.length, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Total Belanja', value: formatCurrency(totalSpent), icon: DollarSign, color: 'text-teal-500', bg: 'bg-teal-50' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30">
      {/* Header */}
      <header className="glass border-b border-white/30 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-teal-700">WashFlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="p-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-slate-800">
            Halo, {user.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 text-sm">Pantau cucian Anda secara real-time</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
              >
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Pesanan Aktif</h2>
            <div className="space-y-4">
              {activeOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-slate-800">{order.orderNumber}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-teal-600">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  <OrderTracker currentStatus={order.status} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Order History */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Riwayat Pesanan</h2>
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Belum ada pesanan</p>
              <Link
                href="/"
                className="inline-block mt-4 px-6 py-2 rounded-xl bg-teal-50 text-teal-600 text-sm font-medium hover:bg-teal-100 transition-colors"
              >
                Buat Pesanan
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-slate-100 hover:border-teal-200 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-teal-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-slate-500">
                      {order.items.length} item • {new Date(order.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-teal-600 text-sm">{formatCurrency(order.totalAmount)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      order.status === 'READY' ? 'bg-teal-100 text-teal-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
