import Link from 'next/link'
import { ChevronDown, Globe, Mail, Search } from 'lucide-react'

const navItems = [
  { label: 'Products', hasDropdown: true },
  { label: 'Solutions', hasDropdown: true },
  { label: 'Technology', hasDropdown: true },
  { label: 'About', hasDropdown: true },
  { label: 'News', hasDropdown: true, active: true },
  { label: 'Sustainability', hasDropdown: true },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200">
      {/* Utility bar */}
      <div className="bg-[#0B1B3A] text-white">
        <div className="mx-auto flex h-8 max-w-[1400px] items-center justify-end gap-5 px-6 text-[11px] text-white/70">
          <Link href="#" className="hover:text-white">Sitemap</Link>
          <Link href="#" className="hover:text-white">Accessibility</Link>
          <Globe className="h-3.5 w-3.5" />
          <span>EN / 日本語</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#0B1B3A] text-sm font-bold text-white">
              KEL
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-bold text-gray-900">KEL Corporation</span>
              <span className="text-[11px] tracking-wide text-gray-400">SINCE 1966</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href="#"
                className={
                  item.active
                    ? 'flex items-center gap-1 border-b-2 border-[#1D4ED8] pb-6 pt-6 text-sm font-medium text-[#0B1B3A]'
                    : 'flex items-center gap-1 pb-6 pt-6 text-sm font-medium text-gray-600 hover:text-[#0B1B3A]'
                }
              >
                {item.label}
                {item.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-md bg-[#0B1B3A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#132A56]"
            >
              <Mail className="h-4 w-4" />
              Contact / Inquiry
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
