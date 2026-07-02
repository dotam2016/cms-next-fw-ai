import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown, Search } from 'lucide-react'
import { SiteHeader } from '@/components/front/site-header'

const filters = ['All', 'Press Release', 'Product News', 'Corporate', 'Events', 'IR / Financial']

const featured = {
  category: 'PRESS RELEASE',
  date: '2025.06.11',
  title: "KEL Launches Industry's Smallest 0.3mm Pitch Board-to-Board Connector for Next-Generation Mobile Devices",
  description:
    'The new KM-03 series achieves an industry-leading 0.3mm pitch with a 0.8mm stacking height, enabling ultra-compact PCB-to-PCB interconnection in the latest generation of smartphones, wearables, and AR/VR headsets.',
  image: 'https://picsum.photos/seed/kel-featured/500/400',
}

const newsItems = [
  {
    category: 'CORPORATE',
    date: '2025.05.28',
    title: 'FY2024 Financial Results: Record Net Sales of ¥38.4 Billion',
    description:
      'Operating income grew 5.1% YoY driven by strong automotive and industrial segment demand.',
    image: 'https://picsum.photos/seed/kel1/600/400',
  },
  {
    category: 'PRODUCT NEWS',
    date: '2025.04.10',
    title: 'New IATF 16949:2016 Recertification for Automotive Harness Assembly Line',
    description:
      'Nagoya facility receives IATF 16949 recertification with zero major non-conformities found.',
    image: 'https://picsum.photos/seed/kel2/600/400',
  },
  {
    category: 'CORPORATE',
    date: '2025.03.21',
    title: 'KEL Opens New Application Engineering Centre in Singapore',
    description:
      'The APAC Application Engineering Centre strengthens our technical support capabilities across the region.',
    image: 'https://picsum.photos/seed/kel3/600/400',
  },
  {
    category: 'PRODUCT NEWS',
    date: '2025.02.14',
    title: 'KHM Harness Assembly Achieves AEC-Q200 Qualification for Automotive Use',
    description: 'Full automotive qualification opens new opportunities in EV platform harness supply.',
    image: 'https://picsum.photos/seed/kel4/600/400',
  },
  {
    category: 'EVENTS',
    date: '2025.01.30',
    title: 'KEL at Electronica 2025 — Booth A4.320, Munich',
    description:
      'Join us to see the latest connectors for industrial, automotive, and medical applications live.',
    image: 'https://picsum.photos/seed/kel5/600/400',
  },
  {
    category: 'CORPORATE',
    date: '2024.12.18',
    title: 'KEL Publishes FY2024 Sustainability Report with CDP Climate B Rating',
    description: 'Our annual sustainability report outlines progress toward 2030 carbon neutrality goals.',
    image: 'https://picsum.photos/seed/kel6/600/400',
  },
]

const pageNumbers = [1, 2, 3]

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-[10px] font-semibold tracking-wide text-white">
      {category}
    </span>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-[1400px] px-6 py-3 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">&gt;</span>
          <span className="font-medium text-gray-700">News &amp; Media</span>
        </div>
      </div>

      <main className="mx-auto max-w-[1400px] px-6 py-10">
        {/* Page header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">News &amp; Media</h1>
            <p className="mt-2 text-sm text-gray-500">
              Press releases, product announcements, and corporate updates
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search news..."
              className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1D4ED8]"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter, i) => (
              <button
                key={filter}
                type="button"
                className={
                  i === 0
                    ? 'rounded-full bg-[#0B1B3A] px-4 py-2 text-xs font-medium text-white'
                    : 'rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50'
                }
              >
                {filter}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            Year: 2025
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        <hr className="mt-6 border-gray-200" />

        {/* Featured */}
        <div className="mt-8 flex items-center gap-2 text-xs font-semibold tracking-widest text-teal-600">
          <span className="h-px w-6 bg-teal-600" />
          FEATURED
        </div>

        <Link
          href="#"
          className="mt-4 flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md sm:flex-row"
        >
          <div className="relative h-56 w-full shrink-0 sm:h-auto sm:w-72">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featured.image} alt="" className="h-full w-full object-cover" />
            <CategoryBadge category={featured.category} />
          </div>
          <div className="flex flex-col justify-center gap-2 p-6">
            <span className="text-xs text-gray-400">{featured.date}</span>
            <h2 className="text-lg font-bold text-gray-900">{featured.title}</h2>
            <p className="text-sm text-gray-500">{featured.description}</p>
            <span className="mt-2 flex items-center gap-1 text-sm font-medium text-[#1D4ED8]">
              Read More <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <Link
              key={item.title}
              href="#"
              className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
            >
              <div className="relative h-44 w-full shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt="" className="h-full w-full object-cover" />
                <CategoryBadge category={item.category} />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <span className="text-xs text-gray-400">{item.date}</span>
                <h3 className="line-clamp-2 text-base font-bold text-gray-900">{item.title}</h3>
                <p className="line-clamp-2 text-sm text-gray-500">{item.description}</p>
                <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-[#1D4ED8]">
                  Read More <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-10 flex items-center justify-center gap-1">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pageNumbers.map((n) => (
            <button
              key={n}
              type="button"
              className={
                n === 1
                  ? 'flex h-8 w-8 items-center justify-center rounded-md bg-[#0B1B3A] text-sm font-medium text-white'
                  : 'flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100'
              }
            >
              {n}
            </button>
          ))}
          <span className="flex h-8 w-8 items-center justify-center text-sm text-gray-400">…</span>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            8
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  )
}
