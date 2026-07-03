'use client'

import Link from 'next/link'
import { Menu, Home, Moon, Crown, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AdminHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between bg-white px-4">
      {/* Left */}
      <div className="flex items-center gap-1">
        <Button className="cursor-pointer" variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" render={<Link href="/" target="_blank" />} nativeButton={false}>
          <Home className="h-4 w-4" />
        </Button>
        <Button  variant="ghost" size="sm" className="hidden cursor-pointer gap-1.5 text-xs text-muted-foreground">
          <Moon className="h-3.5 w-3.5" />
          Dark
        </Button>
      </div>

      {/* Right */}
      <div className="hidden items-center gap-2 text-sm">
        <Crown className="h-4 w-4 text-amber-400" />
        <span className="text-muted-foreground">(하이브랩)정민수</span>
        <Button variant="ghost" size="icon">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
