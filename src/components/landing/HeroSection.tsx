'use client'

import { motion } from 'framer-motion'
import { Droplets, Star, Clock, Shield } from 'lucide-react'
import OrderSearchBar from '../customer/OrderSearchBar'

const STATS = [
  { icon: Star, label: 'Rating', value: '4.9/5' },
  { icon: Clock, label: 'Pengiriman', value: '< 24 Jam' },
  { icon: Shield, label: 'Cucian Aman', value: '100%' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-teal-200/30 to-cyan-200/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-200/30 to-teal-200/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-teal-100/20 to-cyan-100/20 blur-3xl" />

        {/* Floating bubbles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-teal-200/40 bg-teal-50/30"
            style={{
              width: `${20 + i * 15}px`,
              height: `${20 + i * 15}px`,
              left: `${15 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 mb-6"
            >
              <Droplets className="w-4 h-4 text-teal-500" />
              <span className="text-sm font-medium text-teal-700">Layanan Laundry Premium</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6"
            >
              Bersih,{' '}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Segar,
              </span>{' '}
              &{' '}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Efisien
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-slate-600 mb-8 leading-relaxed"
            >
              Percayakan cucian Anda kepada WashFlow — platform manajemen laundry cerdas
              dengan teknologi real-time tracking terdepan.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex gap-8 mb-10"
            >
              {STATS.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-teal-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                  </div>
                )
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="/register"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-teal-200 transition-all hover:-translate-y-0.5"
              >
                Mulai Sekarang
              </a>
              <a
                href="#pricing"
                className="px-6 py-3 rounded-xl border-2 border-teal-200 text-teal-700 font-semibold hover:bg-teal-50 transition-all"
              >
                Lihat Harga
              </a>
            </motion.div>
          </div>

          {/* Right - Order Tracker */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            id="track"
          >
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Cek Status Cucian</h2>
              <p className="text-slate-500 text-sm">
                Masukkan nomor order atau nomor telepon untuk melihat status cucian Anda secara real-time.
              </p>
            </div>
            <OrderSearchBar />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
