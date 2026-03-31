'use client'

import { useState, useTransition } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Wind, Shirt, Star, Package, GripVertical, User, Hash } from 'lucide-react'
import { updateOrderStatus } from '@/lib/actions/orders'
import { formatCurrency, getStatusLabel } from '@/lib/utils'
import { OrderStatusEnum } from '@prisma/client'

const COLUMNS: { status: OrderStatusEnum; label: string; icon: any; color: string; bg: string; border: string }[] = [
  { status: 'PENDING', label: 'Menunggu', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { status: 'PICKED_UP', label: 'Dijemput', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { status: 'WASHING', label: 'Dicuci', icon: Wind, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  { status: 'IRONING', label: 'Disetrika', icon: Shirt, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { status: 'READY', label: 'Siap Diambil', icon: Star, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
]

interface OrderCard {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  isExpress: boolean
  user: { name: string | null; phone: string | null }
  items: { serviceItem: { name: string; unit: string } }[]
  createdAt: Date
}

interface Props {
  initialOrders: OrderCard[]
}

function KanbanCard({ order, isDragging = false }: { order: OrderCard; isDragging?: boolean }) {
  return (
    <div
      className={`bg-white rounded-xl p-4 border ${isDragging ? 'border-teal-300 shadow-xl rotate-1' : 'border-slate-100 shadow-sm'} transition-all`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Hash className="w-3 h-3 text-slate-400" />
          <span className="text-xs font-bold text-slate-600">{order.orderNumber}</span>
        </div>
        {order.isExpress && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
            ⚡ Express
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
          <User className="w-3 h-3 text-teal-600" />
        </div>
        <span className="text-sm font-medium text-slate-700">{order.user.name || 'Anonymous'}</span>
      </div>
      <div className="text-xs text-slate-500 mb-3 space-y-0.5">
        {order.items.slice(0, 2).map((item, i) => (
          <div key={i}>• {item.serviceItem.name}</div>
        ))}
        {order.items.length > 2 && (
          <div className="text-teal-500">+{order.items.length - 2} item lainnya</div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400">
          {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
        </span>
        <span className="text-sm font-bold text-teal-600">{formatCurrency(order.totalAmount)}</span>
      </div>
    </div>
  )
}

function SortableCard({ order, onMoveNext, onMovePrev }: { order: OrderCard; onMoveNext?: () => void; onMovePrev?: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: order.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className="cursor-grab active:cursor-grabbing"
    >
      <div className="relative group">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1 rounded text-slate-400 hover:text-slate-600"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <KanbanCard order={order} isDragging={isDragging} />

        {/* Quick Move Buttons */}
        <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onMovePrev && (
            <button
              onClick={onMovePrev}
              className="flex-1 text-xs py-1 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors"
            >
              ← Sebelumnya
            </button>
          )}
          {onMoveNext && (
            <button
              onClick={onMoveNext}
              className="flex-1 text-xs py-1 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors font-medium"
            >
              Berikutnya →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function KanbanBoard({ initialOrders }: Props) {
  const [orders, setOrders] = useState<OrderCard[]>(initialOrders)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const columnStatuses = COLUMNS.map((c) => c.status)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const orderId = active.id as string
    const targetColumnStatus = over.id as string

    if (columnStatuses.includes(targetColumnStatus as OrderStatusEnum)) {
      const order = orders.find((o) => o.id === orderId)
      if (!order || order.status === targetColumnStatus) return

      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: targetColumnStatus } : o))
      )

      startTransition(async () => {
        await updateOrderStatus(orderId, targetColumnStatus as OrderStatusEnum)
      })
    }
  }

  const moveOrder = (orderId: string, newStatus: OrderStatusEnum) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus)
    })
  }

  const activeOrder = orders.find((o) => o.id === activeId)

  return (
    <div className="relative">
      {isPending && (
        <div className="absolute top-0 right-0 bg-teal-100 text-teal-700 text-xs px-3 py-1.5 rounded-full font-medium z-10">
          Menyimpan...
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-6 min-h-[calc(100vh-200px)]">
          {COLUMNS.map((column) => {
            const Icon = column.icon
            const columnOrders = orders.filter((o) => o.status === column.status)
            const colIndex = columnStatuses.indexOf(column.status)

            return (
              <div
                key={column.status}
                className={`flex-shrink-0 w-72 rounded-2xl ${column.bg} border ${column.border} overflow-hidden`}
                id={column.status}
              >
                {/* Column Header */}
                <div className="p-4 border-b border-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${column.color}`} />
                      </div>
                      <span className={`font-bold text-sm ${column.color}`}>{column.label}</span>
                    </div>
                    <span className={`w-6 h-6 rounded-full bg-white/70 flex items-center justify-center text-xs font-bold ${column.color}`}>
                      {columnOrders.length}
                    </span>
                  </div>
                </div>

                {/* Droppable Area */}
                <SortableContext
                  id={column.status}
                  items={columnOrders.map((o) => o.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="p-3 space-y-2 min-h-24">
                    <AnimatePresence>
                      {columnOrders.map((order) => {
                        const prevStatus = colIndex > 0 ? columnStatuses[colIndex - 1] : null
                        const nextStatus = colIndex < columnStatuses.length - 1 ? columnStatuses[colIndex + 1] : null

                        return (
                          <SortableCard
                            key={order.id}
                            order={order}
                            onMoveNext={nextStatus ? () => moveOrder(order.id, nextStatus) : undefined}
                            onMovePrev={prevStatus ? () => moveOrder(order.id, prevStatus) : undefined}
                          />
                        )
                      })}
                    </AnimatePresence>
                    {columnOrders.length === 0 && (
                      <div className="flex items-center justify-center h-20 border-2 border-dashed border-white/60 rounded-xl">
                        <p className="text-xs text-slate-400">Kosong</p>
                      </div>
                    )}
                  </div>
                </SortableContext>
              </div>
            )
          })}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeOrder && (
            <div className="w-72 rotate-2 shadow-2xl">
              <KanbanCard order={activeOrder} isDragging />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
