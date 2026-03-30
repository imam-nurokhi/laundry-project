'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Droplets, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Registrasi gagal')
      }

      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-cyan-50/50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal-100/40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-cyan-100/40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center shadow-xl mb-4">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Daftar WashFlow</h1>
            <p className="text-slate-500 text-sm mt-1">Buat akun untuk mulai menggunakan layanan kami</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm"
                placeholder="nama@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">No. Telepon</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm"
                placeholder="08123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm pr-10"
                  placeholder="Minimal 6 karakter"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-teal-200 transition-all disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Mendaftar...
                </span>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-teal-600 font-medium hover:text-teal-700">
              Masuk
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
