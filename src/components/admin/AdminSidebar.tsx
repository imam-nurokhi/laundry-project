'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  Droplets, LayoutDashboard, Package, KanbanSquare,
  Settings, BarChart3, Users, LogOut, Menu, X, ShoppingCart
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'STAFF'] },
  { href: '/admin/pos', label: 'POS / Kasir', icon: ShoppingCart, roles: ['ADMIN', 'STAFF'] },
  { href: '/admin/kanban', label: 'Kanban Board', icon: KanbanSquare, roles: ['ADMIN', 'STAFF'] },
  { href: '/admin/orders', label: 'Semua Order', icon: Package, roles: ['ADMIN', 'STAFF'] },
  { href: '/admin/analytics', label: 'Analitik', icon: BarChart3, roles: ['ADMIN'] },
  { href: '/admin/customers', label: 'Pelanggan', icon: Users, roles: ['ADMIN'] },
  { href: '/admin/services', label: 'Layanan & Harga', icon: Settings, roles: ['ADMIN'] },
]

interface Props {
  user: { name?: string; email?: string; role?: string }
}

export default function AdminSidebar({ user }: Props) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const filteredItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(user.role || '')
  )

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center shadow-lg">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">WashFlow</p>
            <p className="text-xs text-slate-400">Management System</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md shadow-teal-200'
                  : 'text-slate-600 hover:bg-teal-50 hover:text-teal-700'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-100 z-30 shadow-sm">
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 z-30 flex items-center px-4 gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-slate-600"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center">
            <Droplets className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-teal-700 text-sm">WashFlow Admin</span>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-2xl">
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
