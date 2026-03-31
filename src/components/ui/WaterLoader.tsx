'use client'

import { motion } from 'framer-motion'

export function WaterLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { container: 'w-12 h-12', wave: 'h-6' },
    md: { container: 'w-20 h-20', wave: 'h-10' },
    lg: { container: 'w-32 h-32', wave: 'h-16' },
  }

  const s = sizes[size]

  return (
    <div className={`relative ${s.container} rounded-full overflow-hidden border-2 border-teal-200`}>
      <motion.div
        className={`absolute bottom-0 left-0 right-0 ${s.wave} bg-gradient-to-r from-teal-400 to-cyan-400 opacity-80`}
        animate={{
          y: [0, -3, 0],
          scaleX: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          borderRadius: '50% 50% 0 0',
        }}
      />
      <motion.div
        className={`absolute bottom-0 left-0 right-0 ${s.wave} bg-gradient-to-r from-cyan-300 to-teal-300 opacity-60`}
        animate={{
          y: [0, -5, 0],
          scaleX: [1, 0.95, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
        style={{
          borderRadius: '50% 50% 0 0',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-3 h-3 rounded-full bg-white/80"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </div>
  )
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <WaterLoader size="lg" />
        <p className="text-teal-600 font-medium animate-pulse">Memuat...</p>
      </div>
    </div>
  )
}
