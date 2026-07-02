'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { listNews, type NewsListItem } from '@/lib/api/news'

const PAGE_SIZE = 7
const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i)

function formatDate(dateString: string | null) {
  if (!dateString) return '-'
  return dateString.slice(0, 10).replace(/-/g, '.')
}

function FeaturedBadge() {
  return (
    <span className="absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-[10px] font-semibold tracking-wide text-white">
      PRESS RELEASE
    </span>
  )
}

export function NewsSection() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const q = searchParams.get('q') ?? ''
  const year = searchParams.get('year') ?? ''
  const page = Number(searchParams.get('page') ?? '1')

  const [searchValue, setSearchValue] = useState(q)
  const [syncedQ, setSyncedQ] = useState(q)
  const [items, setItems] = useState<NewsListItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  if (q !== syncedQ) {
    setSyncedQ(q)
    setSearchValue(q)
  }

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '') {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    }
    router.push(`${pathname}?${next.toString()}`, { scroll: false })
  }

  useEffect(() => {
    let cancelled = false

    async function fetchNews() {
      setLoading(true)
      setError(null)
      try {
        const result = await listNews({
          q: q || undefined,
          date_from: year ? `${year}-01-01T00:00:00` : undefined,
          date_to: year ? `${year}-12-31T23:59:59` : undefined,
          page,
          page_size: PAGE_SIZE,
        })
        if (cancelled) return
        setItems(result.items)
        setTotal(result.total)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : '뉴스를 불러오지 못했습니다.')
        setItems([])
        setTotal(0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchNews()
    return () => {
      cancelled = true
    }
  }, [q, year, page])

  const featured = items[0]
  const gridItems = items.slice(1)
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <>
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
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParams({ q: searchValue || null, page: null })
            }}
            placeholder="Search news..."
            className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#1D4ED8]"
          />
        </div>
      </div>

      {/* Year filter */}
      <div className="mt-8 flex items-center justify-end">
        <div className="relative">
          <select
            value={year}
            onChange={(e) => updateParams({ year: e.target.value || null, page: null })}
            className="h-9 appearance-none rounded-md border border-gray-200 bg-white pl-4 pr-9 text-xs font-medium text-gray-600 outline-none hover:bg-gray-50"
          >
            <option value="">All Years</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                Year: {y}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <hr className="mt-6 border-gray-200" />

      {loading ? (
        <p className="mt-8 text-center text-sm text-gray-400">불러오는 중...</p>
      ) : error ? (
        <p className="mt-8 text-center text-sm text-red-600">{error}</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-center text-sm text-gray-400">검색 결과가 없습니다.</p>
      ) : (
        <>
          {featured && (
            <>
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
                  <img
                    src={`https://picsum.photos/seed/news${featured.id}/500/400`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <FeaturedBadge />
                </div>
                <div className="flex flex-col justify-center gap-2 p-6">
                  <span className="text-xs text-gray-400">{formatDate(featured.published_at)}</span>
                  <h2 className="text-lg font-bold text-gray-900">{featured.title}</h2>
                  {featured.description && <p className="text-sm text-gray-500">{featured.description}</p>}
                  <span className="mt-2 flex items-center gap-1 text-sm font-medium text-[#1D4ED8]">
                    Read More <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </>
          )}

          {gridItems.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridItems.map((item) => (
                <Link
                  key={item.id}
                  href="#"
                  className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
                >
                  <div className="relative h-44 w-full shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://picsum.photos/seed/news${item.id}/600/400`}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <span className="text-xs text-gray-400">{formatDate(item.published_at)}</span>
                    <h3 className="line-clamp-2 text-base font-bold text-gray-900">{item.title}</h3>
                    {item.description && (
                      <p className="line-clamp-2 text-sm text-gray-500">{item.description}</p>
                    )}
                    <span className="mt-auto flex items-center gap-1 pt-2 text-sm font-medium text-[#1D4ED8]">
                      Read More <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {!loading && !error && total > 0 && (
        <div className="mt-10 flex items-center justify-center gap-1">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-30"
            aria-label="Previous page"
            onClick={() => updateParams({ page: String(page - 1) })}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => updateParams({ page: String(i + 1) })}
              className={
                page - 1 === i
                  ? 'flex h-8 w-8 items-center justify-center rounded-md bg-[#0B1B3A] text-sm font-medium text-white'
                  : 'flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100'
              }
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-30"
            aria-label="Next page"
            onClick={() => updateParams({ page: String(page + 1) })}
            disabled={page >= pageCount}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </>
  )
}
