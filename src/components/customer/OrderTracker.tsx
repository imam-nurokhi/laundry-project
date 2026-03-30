'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Shirt, Wind, Star, Package } from 'lucide-react'
import { cn, getStatusLabel } from '@/lib/utils'

const STATUS_STEPS = [
  { key: 'PENDING', label: 'Menunggu', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { key: 'PICKED_UP', label: 'Dijemput', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
  { key: 'WASHING', label: 'Dicuci', icon: Wind, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { key: 'IRONING', label: 'Disetrika', icon: Shirt, color: 'text-purple-500', bg: 'bg-purple-50' },
  { key: 'READY', label: 'Siap Diambil', icon: Star, color: 'text-green-500', bg: 'bg-green-50' },
  { key: 'COMPLETED', label: 'Selesai', icon: CheckCircle2, color: 'text-teal-500', bg: 'bg-teal-50' },
]

interface OrderTrackerProps {
  currentStatus: string
  className?: string
}

export default function OrderTracker({ currentStatus, className }: OrderTrackerProps) {
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === currentStatus)

  return (
    <div className={cn('w-full', className)}>
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="absolute top-5 left-0 right-0 h-1 bg-slate-100 rounded-full" />
        <motion.div
          className="absolute top-5 left-0 h-1 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index < currentIndex
            const isCurrent = index === currentIndex
            const Icon = step.icon

            return (
              <div key={step.key} className="flex flex-col items-center gap-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                    isCompleted
                      ? 'border-teal-400 bg-teal-400 text-white shadow-lg shadow-teal-200'
                      : isCurrent
                      ? cn('border-teal-400 bg-white', step.color, 'shadow-lg shadow-teal-100')
                      : 'border-slate-200 bg-white text-slate-300'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}

                  {/* Ripple effect for current step */}
                  {isCurrent && (
                    <>
                      <span className="absolute w-10 h-10 rounded-full border-2 border-teal-400 opacity-75 ripple-animation" />
                      <span className="absolute w-10 h-10 rounded-full border-2 border-teal-300 opacity-50 ripple-animation" style={{ animationDelay: '0.5s' }} />
                    </>
                  )}
                </motion.div>

                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className={cn(
                    'text-xs font-medium text-center hidden sm:block',
                    isCompleted ? 'text-teal-600' : isCurrent ? 'text-slate-800' : 'text-slate-400'
                  )}
                >
                  {step.label}
                </motion.span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Current Status Badge */}
      <motion.div
        key={currentStatus}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        {(() => {
          const currentStep = STATUS_STEPS[currentIndex]
          if (!currentStep) return null
          const Icon = currentStep.icon
          return (
            <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-full', currentStep.bg)}>
              <Icon className={cn('w-4 h-4', currentStep.color)} />
              <span className={cn('text-sm font-semibold', currentStep.color)}>
                {currentStep.label}
              </span>
            </div>
          )
        })()}
      </motion.div>
    </div>
  )
}
