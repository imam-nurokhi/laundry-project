import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/landing/HeroSection'
import ServicesSection from '@/components/landing/ServicesSection'
import PricingTable from '@/components/customer/PricingTable'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-slate-50 to-teal-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-600 text-sm font-medium mb-4 border border-teal-100">
              Harga Transparan
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
              Pilihan Layanan &{' '}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Harga
              </span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Harga transparan tanpa biaya tersembunyi. Pilih layanan yang sesuai dengan kebutuhan Anda.
            </p>
          </div>
          <PricingTable />
        </div>
      </section>

      <Footer />
    </main>
  )
}
