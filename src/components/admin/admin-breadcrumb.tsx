'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ChevronRight } from 'lucide-react'

const breadcrumbMap: Record<string, string> = {
  '/admin/posts': 'BLOG & NEWS',
  // '/admin/careers': 'CAREERS',
  // '/admin/research': 'RESEARCH',
  // '/admin/sns': 'SNS',
  // '/admin/users': 'ADMIN USER',
  // '/admin/board': 'BOARD',
  // '/admin/privacy': 'PRIVACY POLICY',
}

export function AdminBreadcrumb() {
  const pathname = usePathname()

  const crumbLabel =
    Object.entries(breadcrumbMap)
      .filter(([key]) => pathname.startsWith(key))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? ''

  return (
    <div className="border-b bg-white px-8 py-4">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Home className="h-3.5 w-3.5" />
        <Link href="/admin" className="hover:text-foreground">
          Hivelab
        </Link>
        {crumbLabel && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-[#0b1b3a]">{crumbLabel}</span>
          </>
        )}
      </nav>
    </div>
  )
}
