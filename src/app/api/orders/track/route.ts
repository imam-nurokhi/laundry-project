import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderNumber = searchParams.get('orderNumber')
    const phone = searchParams.get('phone')

    if (!orderNumber && !phone) {
      return NextResponse.json({ error: 'Provide orderNumber or phone' }, { status: 400 })
    }

    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          user: { select: { name: true, phone: true } },
          items: { include: { serviceItem: { include: { category: true } } } },
        },
      })
      if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      return NextResponse.json(order)
    }

    const orders = await prisma.order.findMany({
      where: { user: { phone: phone! } },
      include: {
        user: { select: { name: true, phone: true } },
        items: { include: { serviceItem: { include: { category: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    return NextResponse.json(orders)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
