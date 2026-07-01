'use client'

import { useState } from 'react'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'
import { AdminBreadcrumb } from './admin-breadcrumb'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar open={sidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto bg-white">
          <AdminBreadcrumb />
          <div className="px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
