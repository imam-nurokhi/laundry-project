'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Package, Phone, Loader2 } from 'lucide-react'
import { formatCurrency, getStatusLabel } from '@/lib/utils'
import OrderTracker from './OrderTracker'

export default function OrderSearchBar() {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<'order' | 'phone'>('order')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const params = searchType === 'order'
        ? `orderNumber=${encodeURIComponent(query)}`
        : `phone=${encodeURIComponent(query)}`

      const res = await fetch(`/api/orders/track?${params}`)
      if (!res.ok) throw new Error('Order tidak ditemukan')
      const data = await res.json()
      setResult(data)
    } catch {
      setError('Order tidak ditemukan. Periksa kembali nomor order atau nomor telepon Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="glass rounded-2xl p-6 shadow-xl">
        {/* Search Type Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setSearchType('order')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              searchType === 'order'
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            No. Order
          </button>
          <button
            type="button"
            onClick={() => setSearchType('phone')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              searchType === 'phone'
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Phone className="w-4 h-4" />
            No. Telepon
          </button>
        </div>

        {/* Search Input */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchType === 'order' ? 'Contoh: WF2501AB-XY123' : 'Contoh: 08123456789'}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-teal-200 transition-all disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cek'}
          </button>
        </div>
      </form>

      {/* Results */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
          >
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 glass rounded-2xl p-6 shadow-lg"
          >
            {Array.isArray(result) ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Ditemukan {result.length} order</h3>
                {result.map((order: any) => (
                  <OrderResultCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <OrderResultCard order={result} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function OrderResultCard({ order }: { order: any }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-slate-800 text-lg">{order.orderNumber}</p>
          <p className="text-sm text-slate-500">{order.user?.name}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-teal-600">{formatCurrency(order.totalAmount)}</p>
          <p className="text-xs text-slate-400">
            {new Date(order.createdAt).toLocaleDateString('id-ID')}
          </p>
        </div>
      </div>
      <OrderTracker currentStatus={order.status} />
    </div>
  )
}
