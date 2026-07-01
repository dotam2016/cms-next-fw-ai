'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Briefcase,
  Newspaper,
  FlaskConical,
  Share2,
  UserCog,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Main Home', href: '/', icon: Home },
  { label: 'Careers', href: '/admin/careers', icon: Briefcase },
  { label: 'Blog & News', href: '/admin/posts', icon: Newspaper },
  { label: 'Research', href: '/admin/research', icon: FlaskConical },
  { label: 'SNS', href: '/admin/sns', icon: Share2 },
  { label: 'Admin User', href: '/admin/users', icon: UserCog },
  { label: 'Board', href: '/admin/board', icon: LayoutDashboard },
  { label: 'Privacy Policy', href: '/admin/privacy', icon: ShieldCheck },
]

export function AdminSidebar({ open }: { open: boolean }) {
  const pathname = usePathname()

  if (!open) return null

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 shrink-0 flex-col justify-center border-b px-6">
        <p className="text-xl font-bold leading-none tracking-tight text-violet-700">42dot</p>
        <p className="mt-1.5 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Contents Management System
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === '/'
                ? pathname === '/'
                : pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-violet-100 text-violet-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isActive ? 'text-violet-600' : 'text-gray-400'
                    )}
                  />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t px-6 py-4">
        <p className="text-[11px] text-muted-foreground">© 2026 42dot. All rights reserved.</p>
      </div>
    </aside>
  )
}
