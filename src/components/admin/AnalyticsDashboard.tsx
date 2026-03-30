'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, DollarSign, Package, Weight } from 'lucide-react'

const COLORS = ['#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b']

interface Props {
  dailyRevenue: { date: string; revenue: number }[]
  weeklyVolume: { date: string; volume: number }[]
  popularServices: { name: string; value: number; category?: string }[]
  stats: {
    totalOrders: number
    todayOrders: number
    pendingOrders: number
    totalRevenue: number
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-3">
        <p className="text-xs text-slate-500 mb-1">{formatDate(label)}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name === 'revenue' ? formatCurrency(entry.value) : `${entry.value} kg`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsDashboard({ dailyRevenue, weeklyVolume, popularServices, stats }: Props) {
  const totalWeekRevenue = dailyRevenue.reduce((s, d) => s + d.revenue, 0)
  const totalWeekVolume = weeklyVolume.reduce((s, d) => s + d.volume, 0)

  const summaryCards = [
    {
      label: 'Total Pendapatan',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      sub: 'Semua waktu',
    },
    {
      label: 'Pendapatan Minggu Ini',
      value: formatCurrency(totalWeekRevenue),
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      sub: '7 hari terakhir',
    },
    {
      label: 'Volume Cucian',
      value: `${totalWeekVolume.toFixed(1)} kg`,
      icon: Weight,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      sub: 'Minggu ini',
    },
    {
      label: 'Total Order',
      value: stats.totalOrders,
      icon: Package,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      sub: 'Semua waktu',
    },
  ]

  // Fill missing days with zero for better chart display
  const DAYS_TO_SHOW = 7
  const last7Days = Array.from({ length: DAYS_TO_SHOW }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (DAYS_TO_SHOW - 1 - i))
    return d.toISOString().split('T')[0]
  })

  const revenueData = last7Days.map((date) => ({
    date,
    revenue: dailyRevenue.find((d) => d.date === date)?.revenue || 0,
  }))

  const volumeData = last7Days.map((date) => ({
    date,
    volume: weeklyVolume.find((d) => d.date === date)?.volume || 0,
  }))

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-xl font-bold text-slate-800">{card.value}</p>
              <p className="text-sm text-slate-600 font-medium">{card.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="font-bold text-slate-800 mb-4">Pendapatan Harian (7 Hari)</h3>
          {revenueData.some((d) => d.revenue > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              Belum ada data pendapatan
            </div>
          )}
        </motion.div>

        {/* Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="font-bold text-slate-800 mb-4">Volume Cucian (kg/hari)</h3>
          {volumeData.some((d) => d.volume > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ fill: '#06b6d4', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              Belum ada data volume
            </div>
          )}
        </motion.div>
      </div>

      {/* Popular Services Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
      >
        <h3 className="font-bold text-slate-800 mb-4">Layanan Terpopuler</h3>
        {popularServices.length > 0 ? (
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <PieChart width={220} height={220}>
                <Pie
                  data={popularServices}
                  cx={110}
                  cy={110}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {popularServices.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} order`, '']} />
              </PieChart>
            </div>
            <div className="flex-1 space-y-3">
              {popularServices.map((service, index) => (
                <div key={service.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{service.name}</span>
                      <span className="text-sm font-bold text-slate-800">{service.value}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                          width: `${(service.value / (popularServices[0]?.value || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
            Belum ada data layanan
          </div>
        )}
      </motion.div>
    </div>
  )
}
