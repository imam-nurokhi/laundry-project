'use client'

import { motion } from 'framer-motion'
import { Scale, Shirt, Sparkles, Zap, Clock, Star } from 'lucide-react'

const SERVICES = [
  {
    icon: Scale,
    title: 'Kiloan',
    desc: 'Layanan cuci per kilogram, hemat dan efisien untuk pakaian sehari-hari.',
    color: 'from-teal-400 to-cyan-500',
    bg: 'from-teal-50 to-cyan-50',
  },
  {
    icon: Shirt,
    title: 'Satuan',
    desc: 'Cuci per satuan item, cocok untuk pakaian khusus dan berlabel.',
    color: 'from-cyan-400 to-blue-500',
    bg: 'from-cyan-50 to-blue-50',
  },
  {
    icon: Sparkles,
    title: 'Dry Clean',
    desc: 'Pembersihan kering premium untuk jas, gaun pengantin, dan item mewah.',
    color: 'from-blue-400 to-indigo-500',
    bg: 'from-blue-50 to-indigo-50',
  },
  {
    icon: Zap,
    title: 'Express',
    desc: 'Layanan kilat 24 jam untuk kebutuhan mendesak Anda.',
    color: 'from-amber-400 to-orange-500',
    bg: 'from-amber-50 to-orange-50',
  },
]

const FEATURES = [
  { icon: Clock, text: 'Notifikasi Real-time' },
  { icon: Star, text: 'Deterjen Premium' },
  { icon: Zap, text: 'Pengambilan & Antar' },
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-600 text-sm font-medium mb-4 border border-teal-100">
            Layanan Kami
          </span>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Semua Kebutuhan Laundry
            <span className="block bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Dalam Satu Tempat
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Dari pakaian harian hingga busana premium, kami menyediakan solusi laundry
            yang komprehensif dengan teknologi terkini.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {SERVICES.map((service, i) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${service.bg} border border-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{service.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Features Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-8"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.text} className="flex items-center gap-2 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-teal-500" />
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
