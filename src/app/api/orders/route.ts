import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const orderNumber = searchParams.get('orderNumber')
    const phone = searchParams.get('phone')

    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          user: { select: { name: true, email: true, phone: true } },
          items: { include: { serviceItem: { include: { category: true } } } },
        },
      })
      return NextResponse.json(order)
    }

    if (phone) {
      const orders = await prisma.order.findMany({
        where: { user: { phone } },
        include: {
          user: { select: { name: true, email: true, phone: true } },
          items: { include: { serviceItem: { include: { category: true } } } },
        },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(orders)
    }

    const userId = session.user?.id || ''
    const userRole = (session.user as unknown as { role?: string })?.role

    const orders = await prisma.order.findMany({
      where: userRole === 'CUSTOMER' ? { userId } : undefined,
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: { include: { serviceItem: { include: { category: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
