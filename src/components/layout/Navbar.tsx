'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Droplets, LogOut, User, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const userRole = (session?.user as any)?.role

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass shadow-lg py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center shadow-lg">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              WashFlow
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#services" className="text-slate-600 hover:text-teal-600 transition-colors text-sm font-medium">
              Layanan
            </Link>
            <Link href="/#pricing" className="text-slate-600 hover:text-teal-600 transition-colors text-sm font-medium">
              Harga
            </Link>
            <Link href="/#track" className="text-slate-600 hover:text-teal-600 transition-colors text-sm font-medium">
              Lacak Order
            </Link>

            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href={userRole === 'ADMIN' || userRole === 'STAFF' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-slate-600 hover:text-teal-600 font-medium">
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-teal-200 transition-all"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-white/30"
            >
              <div className="flex flex-col gap-4 pt-4">
                <Link href="/#services" className="text-slate-600 text-sm font-medium" onClick={() => setIsOpen(false)}>
                  Layanan
                </Link>
                <Link href="/#pricing" className="text-slate-600 text-sm font-medium" onClick={() => setIsOpen(false)}>
                  Harga
                </Link>
                <Link href="/#track" className="text-slate-600 text-sm font-medium" onClick={() => setIsOpen(false)}>
                  Lacak Order
                </Link>
                {session ? (
                  <>
                    <Link href="/dashboard" className="text-slate-600 text-sm font-medium" onClick={() => setIsOpen(false)}>
                      Dashboard
                    </Link>
                    <button onClick={() => signOut()} className="text-left text-red-600 text-sm font-medium">
                      Keluar
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-slate-600 text-sm font-medium" onClick={() => setIsOpen(false)}>
                      Masuk
                    </Link>
                    <Link href="/register" className="text-teal-600 text-sm font-medium" onClick={() => setIsOpen(false)}>
                      Daftar
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
