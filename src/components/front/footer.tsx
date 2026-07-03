import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-.98 1.83-2.02 3.76-2.02 4.02 0 4.76 2.55 4.76 5.86V21h-4v-5.9c0-1.4-.03-3.2-1.98-3.2-1.98 0-2.28 1.5-2.28 3.1V21h-4V9Z" />
    </svg>
  )
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 2H22l-7.6 8.7L23.3 22H16.9l-5-6.6L6.1 22H3l8.1-9.3L2.7 2h6.5l4.5 6.1L18.9 2Zm-1.2 18h1.7L7.4 3.9H5.6L17.7 20Z" />
    </svg>
  )
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22.5 6.5a2.8 2.8 0 0 0-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 5.5 2.8 2.8 0 0 0 2 2C5.3 20 12 20 12 20s6.7 0 8.5-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-5.5ZM9.8 15.5v-7L15.8 12l-6 3.5Z" />
    </svg>
  )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46h1.6V4.28C16.3 4.2 15.4 4 14.4 4c-2.1 0-3.6 1.28-3.6 3.64v2.86H8.3v3h2.5V21h2.7Z" />
    </svg>
  )
}

const footerColumns = [
  {
    title: 'Company',
    links: ['About', 'Vision & Mission', 'Corporate History', 'Management Team', 'Awards & Certs'],
  },
  {
    title: 'Products',
    links: ['Connectors', 'Harness Assemblies', 'Rack Systems', 'Electronic Components', 'Download Center'],
  },
  {
    title: 'Solutions',
    links: ['Industrial Automation', 'Automotive', 'Medical Devices', 'Imaging Systems', 'IoT & Robotics'],
  },
  {
    title: 'Corporate',
    links: ['News & Media', 'Careers', 'Sustainability', 'Investor Relations', 'Global Network'],
  },
]

const socialLinks = [
  { icon: LinkedinIcon, label: 'LinkedIn' },
  { icon: TwitterIcon, label: 'Twitter' },
  { icon: YoutubeIcon, label: 'YouTube' },
  { icon: FacebookIcon, label: 'Facebook' },
]

const legalLinks = ['Privacy Policy', 'Terms of Use', 'Cookie Settings', 'Sitemap']

export function Footer() {
  return (
    <footer className="bg-[#0B1B3A] text-white">
      {/* Newsletter band */}
      <div className=" bg-[#12234f]">
        <div className="mx-auto max-w-[1400px] px-6 py-16 text-center">
          <div className="flex items-center justify-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-blue-300">
            <span className="h-px w-6 bg-blue-300" />
            Stay Informed
          </div>
          <h2 className="mt-4 text-3xl font-bold">뉴스 구독하기</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
            제품 소식, 업계 인사이트, 기업 뉴스를 이메일로 받아보세요.
          </p>

          <div className="mx-auto mt-8 flex max-w-md items-center rounded-full border border-[#2f3a65]! bg-white/5 p-1">
            <input
              type="email"
              placeholder="업무용 이메일을 입력하세요..."
              className="w-full flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-white/40 outline-none"
            />
            <button
              type="button"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#1D4ED8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1E40AF]"
            >
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-4 text-xs font-mono text-white/40">스팸 없음. 언제든지 구독을 취소할 수 있습니다.</p>
        </div>
      </div>

      {/* Links grid */}
      <div className="mx-auto max-w-[1400px] px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <img src="/logo_2.png" alt="Logo" className="h-10 w-auto" />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Email: info@company.com
            </p>
            <p className="mt-1 max-w-xs text-sm leading-relaxed text-white/50">
              Phone: +1 (555) 123-4567
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">
                {column.title}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-white/70 hover:text-white">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#17264d]! pt-6 text-xs text-white/40 sm:flex-row">
          <p>© 2026 React Corporation. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            {legalLinks.map((link) => (
              <Link key={link} href="#" className="hover:text-white/70">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
