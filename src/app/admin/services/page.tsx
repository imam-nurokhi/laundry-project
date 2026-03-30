import { getServiceCategories } from '@/lib/actions/services'
import ServicesManager from '@/components/admin/ServicesManager'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const categories = await getServiceCategories()
  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Layanan & Harga</h1>
        <p className="text-slate-500 text-sm">Kelola layanan dan harga laundry</p>
      </div>
      <ServicesManager categories={categories} />
    </div>
  )
}
