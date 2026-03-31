'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Scale, Shirt, Sparkles, Zap } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const CATEGORY_ICONS: Record<string, any> = {
  Kiloan: Scale,
  Satuan: Shirt,
  'Dry Clean': Sparkles,
  Express: Zap,
}

interface Props {
  categories: any[]
}

export default function ServicesManager({ categories }: Props) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '')

  const currentCategory = categories.find((c) => c.id === activeCategory)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Category List */}
      <div className="space-y-2">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.name] || Scale
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                activeCategory === cat.id
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-teal-50 border border-slate-100'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{cat.name}</span>
              <span className={`text-xs ${activeCategory === cat.id ? 'text-teal-100' : 'text-slate-400'}`}>
                {cat.items.length}
              </span>
            </button>
          )
        })}
      </div>

      {/* Items List */}
      <div className="md:col-span-3">
        {currentCategory && (
          <motion.div
            key={currentCategory.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800">{currentCategory.name}</h3>
                <p className="text-sm text-slate-400">{currentCategory.description}</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 text-teal-600 text-sm font-medium hover:bg-teal-100 transition-colors">
                <Plus className="w-4 h-4" />
                Tambah
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase">Nama</th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase">Unit</th>
                  <th className="text-right p-4 text-xs font-semibold text-slate-400 uppercase">Harga</th>
                  <th className="text-center p-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentCategory.items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <p className="text-sm font-medium text-slate-800">{item.name}</p>
                      {item.description && (
                        <p className="text-xs text-slate-400">{item.description}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {item.unit}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-teal-600">{formatCurrency(item.price)}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {item.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  )
}
