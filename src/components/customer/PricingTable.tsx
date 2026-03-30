'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Zap, Scale, Shirt, Sparkles } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const PRICING_DATA = {
  kiloan: [
    { name: 'Cuci + Kering', price: 7000, unit: 'kg', desc: 'Cuci dan kering tanpa setrika', popular: false },
    { name: 'Cuci + Setrika', price: 9000, unit: 'kg', desc: 'Paket lengkap cuci, kering, dan setrika', popular: true },
    { name: 'Cuci Setrika', price: 10000, unit: 'kg', desc: 'Cuci dan setrika premium', popular: false },
  ],
  satuan: [
    { name: 'Kemeja', price: 8000, unit: 'pcs', desc: 'Kemeja kasual/formal', popular: false },
    { name: 'Celana Panjang', price: 10000, unit: 'pcs', desc: 'Celana panjang semua jenis', popular: false },
    { name: 'Jas', price: 35000, unit: 'pcs', desc: 'Jas dan blazer', popular: false },
    { name: 'Gaun', price: 25000, unit: 'pcs', desc: 'Gaun dan dress', popular: true },
    { name: 'Seprei', price: 20000, unit: 'pcs', desc: 'Seprei dan bed cover', popular: false },
    { name: 'Selimut', price: 30000, unit: 'pcs', desc: 'Selimut dan blanket', popular: false },
  ],
  drycleaning: [
    { name: 'Jas Dry Clean', price: 75000, unit: 'pcs', desc: 'Pembersihan jas premium', popular: false },
    { name: 'Gaun Pengantin', price: 250000, unit: 'pcs', desc: 'Gaun pengantin dan formal', popular: true },
    { name: 'Sepatu Dry Clean', price: 80000, unit: 'pcs', desc: 'Sepatu kulit dan suede', popular: false },
    { name: 'Tas Dry Clean', price: 100000, unit: 'pcs', desc: 'Tas branded dan kulit', popular: false },
  ],
}

const TABS = [
  { key: 'kiloan', label: 'Kiloan', icon: Scale, color: 'teal' },
  { key: 'satuan', label: 'Satuan', icon: Shirt, color: 'cyan' },
  { key: 'drycleaning', label: 'Dry Clean', icon: Sparkles, color: 'blue' },
]

export default function PricingTable() {
  const [activeTab, setActiveTab] = useState<'kiloan' | 'satuan' | 'drycleaning'>('kiloan')

  return (
    <div className="w-full" id="pricing">
      {/* Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="glass inline-flex p-1.5 rounded-2xl gap-1 shadow-lg">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white text-teal-700 shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Pricing Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {PRICING_DATA[activeTab].map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative bg-white rounded-2xl p-6 border-2 hover:shadow-lg hover:shadow-teal-50 transition-all duration-300 cursor-pointer group ${
                item.popular
                  ? 'border-teal-400 shadow-lg shadow-teal-100'
                  : 'border-slate-100 hover:border-teal-200'
              }`}
            >
              {item.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    ⭐ Terpopuler
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xl font-extrabold text-teal-600">
                    {formatCurrency(item.price)}
                  </span>
                  <span className="text-xs text-slate-400">/{item.unit}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Check className="w-4 h-4 text-teal-500" />
                <span>Termasuk parfum laundry</span>
              </div>

              {activeTab === 'kiloan' && (
                <div className="mt-3 p-2 bg-teal-50 rounded-lg">
                  <p className="text-xs text-teal-700 font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Express +50% untuk layanan kilat
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
