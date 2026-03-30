import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@washflow.id' },
    update: {},
    create: {
      email: 'admin@washflow.id',
      name: 'Administrator',
      role: 'ADMIN',
      password: 'admin123',
    },
  })

  await prisma.user.upsert({
    where: { email: 'staff@washflow.id' },
    update: {},
    create: {
      email: 'staff@washflow.id',
      name: 'Staff Laundry',
      role: 'STAFF',
      password: 'staff123',
    },
  })

  const kiloan = await prisma.serviceCategory.upsert({
    where: { name: 'Kiloan' },
    update: {},
    create: {
      name: 'Kiloan',
      description: 'Layanan cuci per kilogram',
      icon: '⚖️',
    },
  })

  const satuan = await prisma.serviceCategory.upsert({
    where: { name: 'Satuan' },
    update: {},
    create: {
      name: 'Satuan',
      description: 'Layanan cuci per satuan item',
      icon: '👔',
    },
  })

  const dryCleaning = await prisma.serviceCategory.upsert({
    where: { name: 'Dry Clean' },
    update: {},
    create: {
      name: 'Dry Clean',
      description: 'Layanan dry cleaning premium',
      icon: '✨',
    },
  })

  const express = await prisma.serviceCategory.upsert({
    where: { name: 'Express' },
    update: {},
    create: {
      name: 'Express',
      description: 'Layanan kilat 24 jam',
      icon: '⚡',
    },
  })

  const kiloanItems = [
    { name: 'Cuci + Kering', price: 7000, unit: 'KG' as const, description: 'Cuci dan kering tanpa setrika' },
    { name: 'Cuci + Kering + Setrika', price: 9000, unit: 'KG' as const, description: 'Paket lengkap cuci, kering, dan setrika' },
    { name: 'Cuci Setrika', price: 10000, unit: 'KG' as const, description: 'Cuci dan setrika' },
  ]

  for (const item of kiloanItems) {
    await prisma.serviceItem.upsert({
      where: { id: `kiloan-${item.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `kiloan-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
        ...item,
        categoryId: kiloan.id,
      },
    })
  }

  const satuanItems = [
    { name: 'Kemeja', price: 8000, unit: 'PCS' as const },
    { name: 'Celana Panjang', price: 10000, unit: 'PCS' as const },
    { name: 'Jas', price: 35000, unit: 'PCS' as const },
    { name: 'Gaun', price: 25000, unit: 'PCS' as const },
    { name: 'Seprei', price: 20000, unit: 'PCS' as const },
    { name: 'Selimut', price: 30000, unit: 'PCS' as const },
    { name: 'Bed Cover', price: 50000, unit: 'PCS' as const },
    { name: 'Jaket', price: 20000, unit: 'PCS' as const },
  ]

  for (const item of satuanItems) {
    await prisma.serviceItem.upsert({
      where: { id: `satuan-${item.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `satuan-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
        ...item,
        categoryId: satuan.id,
      },
    })
  }

  const dryCleanItems = [
    { name: 'Jas Dry Clean', price: 75000, unit: 'PCS' as const },
    { name: 'Gaun Pengantin', price: 250000, unit: 'PCS' as const },
    { name: 'Sepatu Dry Clean', price: 80000, unit: 'PCS' as const },
    { name: 'Tas Dry Clean', price: 100000, unit: 'PCS' as const },
  ]

  for (const item of dryCleanItems) {
    await prisma.serviceItem.upsert({
      where: { id: `dryclean-${item.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `dryclean-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
        ...item,
        categoryId: dryCleaning.id,
      },
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
