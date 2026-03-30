'use server'

import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { OrderStatusEnum } from '@prisma/client'

export interface CreateOrderData {
  userId: string
  deliveryType: 'DROP_OFF' | 'PICKUP'
  isExpress: boolean
  notes?: string
  items: {
    serviceItemId: string
    quantity: number
    weight?: number
  }[]
}

export async function createOrder(data: CreateOrderData) {
  try {
    const serviceItemIds = data.items.map((i) => i.serviceItemId)
    const serviceItems = await prisma.serviceItem.findMany({
      where: { id: { in: serviceItemIds } },
    })

    const itemsWithPrices = data.items.map((item) => {
      const serviceItem = serviceItems.find((si) => si.id === item.serviceItemId)
      if (!serviceItem) throw new Error(`Service item ${item.serviceItemId} not found`)
      
      const qty = serviceItem.unit === 'KG' ? (item.weight || item.quantity) : item.quantity
      const subtotal = serviceItem.price * qty
      
      return {
        serviceItemId: item.serviceItemId,
        quantity: qty,
        weight: item.weight,
        unitPrice: serviceItem.price,
        subtotal,
      }
    })

    const subtotal = itemsWithPrices.reduce((sum, item) => sum + item.subtotal, 0)
    const expressSurcharge = data.isExpress ? subtotal * 0.5 : 0
    const totalAmount = subtotal + expressSurcharge

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: data.userId,
        deliveryType: data.deliveryType,
        isExpress: data.isExpress,
        expressSurcharge,
        totalAmount,
        notes: data.notes,
        estimatedDone: new Date(Date.now() + (data.isExpress ? 24 : 72) * 60 * 60 * 1000),
        items: {
          create: itemsWithPrices,
        },
      },
      include: {
        items: { include: { serviceItem: true } },
        user: true,
      },
    })

    revalidatePath('/admin/orders')
    revalidatePath('/dashboard')
    return { success: true, order }
  } catch (error) {
    console.error('Create order error:', error)
    return { success: false, error: 'Gagal membuat pesanan' }
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatusEnum) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        completedAt: status === 'COMPLETED' ? new Date() : undefined,
      },
      include: { user: true },
    })

    if (status === 'READY') {
      await sendWhatsAppNotification(order.user.phone, order.user.name, order.orderNumber)
    }

    revalidatePath('/admin/kanban')
    revalidatePath('/admin/orders')
    revalidatePath('/dashboard')
    return { success: true, order }
  } catch (error) {
    console.error('Update order status error:', error)
    return { success: false, error: 'Gagal memperbarui status' }
  }
}

async function sendWhatsAppNotification(
  phone: string | null,
  name: string | null,
  orderNumber: string
) {
  // TODO: Integrate with WhatsApp Business API
  console.log(`[WhatsApp Placeholder] Sending notification to ${phone}: Halo ${name}, cucian Anda (${orderNumber}) sudah siap diambil!`)
}

export async function getOrders(status?: OrderStatusEnum) {
  return prisma.order.findMany({
    where: status ? { status } : undefined,
    include: {
      user: true,
      items: { include: { serviceItem: { include: { category: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      user: true,
      items: { include: { serviceItem: { include: { category: true } } } },
    },
  })
}

export async function getOrdersByUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: { include: { serviceItem: { include: { category: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
}
