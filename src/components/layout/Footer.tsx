import { Droplets, MapPin, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                WashFlow
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Sistem manajemen laundry cerdas yang membantu bisnis Anda berkembang
              dengan teknologi real-time tracking dan antarmuka modern.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Navigasi</h4>
            <ul className="space-y-2">
              {['Beranda', 'Layanan', 'Harga', 'Lacak Order', 'Masuk', 'Daftar'].map((link) => (
                <li key={link}>
                  <Link href="/" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0" />
                Jl. Laundry Bersih No. 1, Jakarta
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
                +62 812 3456 7890
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
                hello@washflow.id
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2025 WashFlow. Semua hak dilindungi.
          </p>
          <p className="text-slate-500 text-sm">
            Dibuat dengan ❤️ untuk laundry Indonesia
          </p>
        </div>
      </div>
    </footer>
  )
}
