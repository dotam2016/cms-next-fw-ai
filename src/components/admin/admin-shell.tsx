'use client'

import { useState } from 'react'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'
import { AdminBreadcrumb } from './admin-breadcrumb'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen">
      <AdminSidebar open={sidebarOpen} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 bg-white">
          <AdminBreadcrumb />
          <div className="px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
