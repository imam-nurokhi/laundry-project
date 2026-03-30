'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Package, DollarSign, Clock, TrendingUp, ChevronRight } from 'lucide-react'
import { formatCurrency, getStatusLabel, getStatusColor } from '@/lib/utils'

interface Props {
  stats: {
    totalOrders: number
    todayOrders: number
    pendingOrders: number
    totalRevenue: number
  }
  recentOrders: any[]
}

export default function AdminDashboardClient({ stats, recentOrders }: Props) {
  const statCards = [
    {
      label: 'Total Order',
      value: stats.totalOrders,
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: '+12%',
    },
    {
      label: 'Order Hari Ini',
      value: stats.todayOrders,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      trend: '+5%',
    },
    {
      label: 'Sedang Proses',
      value: stats.pendingOrders,
      icon: TrendingUp,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      trend: '',
    },
    {
      label: 'Total Pendapatan',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      trend: '+8%',
    },
  ]

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm">Selamat datang di panel admin WashFlow</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                {card.trend && (
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                    {card.trend}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/admin/pos"
          className="flex items-center justify-between p-5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl text-white hover:shadow-lg hover:shadow-teal-200 transition-all"
        >
          <div>
            <p className="font-bold">Buat Order Baru</p>
            <p className="text-teal-100 text-sm">POS Kasir</p>
          </div>
          <ChevronRight className="w-5 h-5" />
        </Link>
        <Link
          href="/admin/kanban"
          className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl text-white hover:shadow-lg transition-all"
        >
          <div>
            <p className="font-bold">Kanban Board</p>
            <p className="text-blue-100 text-sm">Kelola status cucian</p>
          </div>
          <ChevronRight className="w-5 h-5" />
        </Link>
        <Link
          href="/admin/analytics"
          className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white hover:shadow-lg transition-all"
        >
          <div>
            <p className="font-bold">Analitik</p>
            <p className="text-purple-100 text-sm">Laporan pendapatan</p>
          </div>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Order Terbaru</h2>
          <Link href="/admin/orders" className="text-teal-600 text-sm font-medium hover:text-teal-700">
            Lihat semua
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Belum ada order</div>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-slate-500">{order.user?.name}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
                <p className="text-sm font-bold text-teal-600 hidden sm:block">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
