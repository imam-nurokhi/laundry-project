'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Minus, Trash2, Zap, Check, User, Loader2, Receipt } from 'lucide-react'
import { createOrder } from '@/lib/actions/orders'
import { formatCurrency } from '@/lib/utils'

interface ServiceItem {
  id: string
  name: string
  price: number
  unit: string
  category: { name: string }
}

interface CartItem extends ServiceItem {
  quantity: number
  weight?: number
}

interface Customer {
  id: string
  name: string | null
  email: string | null
  phone: string | null
}

interface Props {
  serviceItems: ServiceItem[]
  users: Customer[]
}

export default function POSSystem({ serviceItems, users }: Props) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null)
  const [userSearch, setUserSearch] = useState('')
  const [serviceSearch, setServiceSearch] = useState('')
  const [isExpress, setIsExpress] = useState(false)
  const [deliveryType, setDeliveryType] = useState<'DROP_OFF' | 'PICKUP'>('DROP_OFF')
  const [notes, setNotes] = useState('')
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone?.includes(userSearch) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
  )

  const filteredServices = serviceItems.filter(
    (s) =>
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.category.name.toLowerCase().includes(serviceSearch.toLowerCase())
  )

  const addToCart = (item: ServiceItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + (item.unit === 'KG' ? 0.5 : 1) } : c
        )
      }
      return [...prev, { ...item, quantity: item.unit === 'KG' ? 1 : 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.id !== itemId))
  }

  const updateQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.id !== itemId) return c
          const step = c.unit === 'KG' ? 0.5 : 1
          const newQty = Math.max(step, c.quantity + delta * step)
          return { ...c, quantity: newQty }
        })
        .filter((c) => c.quantity > 0)
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const expressSurcharge = isExpress ? subtotal * 0.5 : 0
  const total = subtotal + expressSurcharge

  // Group services by category
  const categories = [...new Set(filteredServices.map((s) => s.category.name))]

  const handleSubmit = () => {
    if (!selectedUser) {
      setError('Pilih pelanggan terlebih dahulu')
      return
    }
    if (cart.length === 0) {
      setError('Tambahkan item ke keranjang')
      return
    }

    setError(null)
    startTransition(async () => {
      const result = await createOrder({
        userId: selectedUser.id,
        deliveryType,
        isExpress,
        notes,
        items: cart.map((item) => ({
          serviceItemId: item.id,
          quantity: item.unit === 'KG' ? 1 : item.quantity,
          weight: item.unit === 'KG' ? item.quantity : undefined,
        })),
      })

      if (result.success) {
        setSuccess(`Order ${result.order?.orderNumber} berhasil dibuat!`)
        setCart([])
        setSelectedUser(null)
        setNotes('')
        setIsExpress(false)
        setTimeout(() => setSuccess(null), 5000)
      } else {
        setError(result.error || 'Gagal membuat order')
      }
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Service Selection */}
      <div className="lg:col-span-2 space-y-4">
        {/* Success / Error */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Customer Selection */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-teal-500" />
            Pilih Pelanggan
          </h3>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Cari nama, telepon, atau email..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          {userSearch && (
            <div className="max-h-40 overflow-y-auto space-y-1 border border-slate-100 rounded-xl p-1">
              {filteredUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => { setSelectedUser(u); setUserSearch('') }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  <p className="text-sm font-medium text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-400">{u.phone || u.email}</p>
                </button>
              ))}
              {filteredUsers.length === 0 && (
                <p className="text-xs text-slate-400 p-3">Tidak ditemukan</p>
              )}
            </div>
          )}
          {selectedUser && (
            <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-teal-200 flex items-center justify-center text-teal-700 font-bold text-sm">
                {selectedUser.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-teal-800">{selectedUser.name}</p>
                <p className="text-xs text-teal-600">{selectedUser.phone || selectedUser.email}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Service Items */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-3">Pilih Layanan</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
              placeholder="Cari layanan..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat}>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{cat}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filteredServices
                    .filter((s) => s.category.name === cat)
                    .map((item) => {
                      const inCart = cart.find((c) => c.id === item.id)
                      return (
                        <button
                          key={item.id}
                          onClick={() => addToCart(item)}
                          className={`p-3 rounded-xl border text-left transition-all hover:shadow-md ${
                            inCart ? 'border-teal-400 bg-teal-50' : 'border-slate-100 bg-white hover:border-teal-200'
                          }`}
                        >
                          <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                          <p className="text-xs text-teal-600 font-bold">
                            {formatCurrency(item.price)}/{item.unit.toLowerCase()}
                          </p>
                          {inCart && (
                            <span className="text-xs text-teal-500">
                              ✓ {inCart.quantity}{item.unit === 'KG' ? 'kg' : 'pcs'}
                            </span>
                          )}
                        </button>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Cart & Checkout */}
      <div className="space-y-4">
        {/* Express Toggle */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <button
            onClick={() => setIsExpress(!isExpress)}
            className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
              isExpress ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className={`w-5 h-5 ${isExpress ? 'text-amber-500' : 'text-slate-400'}`} />
              <div className="text-left">
                <p className={`text-sm font-bold ${isExpress ? 'text-amber-700' : 'text-slate-600'}`}>
                  Layanan Express
                </p>
                <p className="text-xs text-slate-400">+50% surcharge, selesai 24 jam</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-all ${isExpress ? 'bg-amber-400' : 'bg-slate-200'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-all mt-0.5 ${isExpress ? 'ml-[1.625rem]' : 'ml-0.5'}`} />
            </div>
          </button>

          {/* Delivery Type */}
          <div className="flex gap-2 mt-3">
            {(['DROP_OFF', 'PICKUP'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setDeliveryType(type)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                  deliveryType === type ? 'bg-teal-500 text-white border-teal-500' : 'border-slate-200 text-slate-600 hover:border-teal-200'
                }`}
              >
                {type === 'DROP_OFF' ? '🚶 Drop-off' : '🚗 Pickup'}
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-500" />
            Keranjang ({cart.length})
          </h3>

          {cart.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              Belum ada item
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs text-teal-600">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-red-300 hover:text-red-500"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-700">
                      {item.quantity}{item.unit === 'KG' ? 'kg' : ''}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-teal-300 hover:text-teal-500"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          {cart.length > 0 && (
            <div className="border-t border-slate-100 pt-3 space-y-1.5 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {isExpress && (
                <div className="flex justify-between text-sm">
                  <span className="text-amber-500">Express (+50%)</span>
                  <span className="font-medium text-amber-600">{formatCurrency(expressSurcharge)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span className="text-slate-800">Total</span>
                <span className="text-teal-600 text-lg">{formatCurrency(total)}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Catatan tambahan..."
            className="w-full p-3 rounded-xl border border-slate-200 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-teal-400 mb-4"
          />

          <button
            onClick={handleSubmit}
            disabled={isPending || cart.length === 0 || !selectedUser}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-teal-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Membuat Order...
              </span>
            ) : (
              `Buat Order • ${formatCurrency(total)}`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
