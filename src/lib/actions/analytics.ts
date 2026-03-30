'use server'

import { prisma } from '@/lib/prisma'

export async function getDailyRevenue(days: number = 7) {
  const safeDays = Math.min(Math.max(Math.floor(days), 1), 365)
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - safeDays)

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
      paymentStatus: 'PAID',
    },
    select: {
      totalAmount: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  const revenueByDay: Record<string, number> = {}
  
  orders.forEach((order) => {
    const date = order.createdAt.toISOString().split('T')[0]
    revenueByDay[date] = (revenueByDay[date] || 0) + order.totalAmount
  })

  return Object.entries(revenueByDay).map(([date, revenue]) => ({
    date,
    revenue,
  }))
}

export async function getWeeklyVolume() {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 7)

  const items = await prisma.orderItem.findMany({
    where: {
      createdAt: { gte: startDate },
      serviceItem: { unit: 'KG' },
    },
    select: {
      weight: true,
      quantity: true,
      createdAt: true,
    },
  })

  const volumeByDay: Record<string, number> = {}
  
  items.forEach((item) => {
    const date = item.createdAt.toISOString().split('T')[0]
    volumeByDay[date] = (volumeByDay[date] || 0) + (item.weight || item.quantity)
  })

  return Object.entries(volumeByDay).map(([date, volume]) => ({
    date,
    volume,
  }))
}

export async function getPopularServices() {
  const items = await prisma.orderItem.groupBy({
    by: ['serviceItemId'],
    _count: { serviceItemId: true },
    orderBy: { _count: { serviceItemId: 'desc' } },
    take: 5,
  })

  const serviceIds = items.map((i) => i.serviceItemId)
  const services = await prisma.serviceItem.findMany({
    where: { id: { in: serviceIds } },
    include: { category: true },
  })

  return items.map((item) => {
    const service = services.find((s) => s.id === item.serviceItemId)
    return {
      name: service?.name || 'Unknown',
      value: item._count.serviceItemId,
      category: service?.category.name,
    }
  })
}

export async function getDashboardStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [totalOrders, todayOrders, pendingOrders, totalRevenue] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({ where: { status: { in: ['PENDING', 'WASHING', 'IRONING'] } } }),
    prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { totalAmount: true },
    }),
  ])

  return {
    totalOrders,
    todayOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
  }
}
