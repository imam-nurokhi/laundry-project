'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getServiceCategories() {
  return prisma.serviceCategory.findMany({
    include: {
      items: {
        where: { isActive: true },
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  })
}

export async function getServiceItems() {
  return prisma.serviceItem.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { name: 'asc' },
  })
}

export async function createServiceCategory(data: { name: string; description?: string; icon?: string }) {
  const category = await prisma.serviceCategory.create({ data })
  revalidatePath('/admin/services')
  return category
}

export async function createServiceItem(data: {
  name: string
  price: number
  unit: 'KG' | 'PCS'
  description?: string
  categoryId: string
}) {
  const item = await prisma.serviceItem.create({ data })
  revalidatePath('/admin/services')
  return item
}
