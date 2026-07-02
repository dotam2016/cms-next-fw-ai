'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowRight, Copy } from 'lucide-react'
import { SiteHeader } from '@/components/front/site-header'
import { getNews, listNews, type NewsListItem, type NewsOut } from '@/lib/api/news'

function formatDate(dateString: string | null) {
  if (!dateString) return '-'
  return dateString.slice(0, 10).replace(/-/g, '.')
}

function formatDateTime(dateString: string | null) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return formatDate(dateString)
  const pad = (n: number) => String(n).padStart(2, '0')
  const datePart = `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`
  const timePart = `${pad(date.getHours())}:${pad(date.getMinutes())}`
  return `${datePart} ${timePart}`
}

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)

  const [article, setArticle] = useState<NewsOut | null>(null)
  const [latest, setLatest] = useState<NewsListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const [articleResult, latestResult] = await Promise.all([
          getNews(id),
          listNews({ page: 1, page_size: 3 }),
        ])
        if (cancelled) return
        setArticle(articleResult)
        setLatest(latestResult.items)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : '게시글을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => {
      cancelled = true
    }
  }, [id])

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('URL이 복사되었습니다.')
    } catch {
      toast.error('URL 복사에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-[1400px] px-6 py-3 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-700">홈</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/" className="hover:text-gray-700">뉴스 &amp; 미디어</Link>
          {article && (
            <>
              <span className="mx-2">&gt;</span>
              <span className="font-medium text-gray-700">{article.title}</span>
            </>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-[1400px] px-6 py-10 pb-30">
        {loading ? (
          <p className="text-center text-sm text-gray-400">불러오는 중...</p>
        ) : error || !article ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <p className="text-sm text-red-600">{error ?? '게시글을 찾을 수 없습니다.'}</p>
            <Link href="/" className="text-sm font-medium text-[#1D4ED8] hover:underline">
              목록으로 돌아가기
            </Link>
          </div>
        ) : (
          <>
            {/* Article */}
            <article className="mx-auto max-w-3xl">
              <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
              <div className="mt-4 flex items-center justify-between border-b border-gray-200 pb-6">
                <span className="text-sm text-gray-400">
                  게시일: {formatDateTime(article.published_at ?? article.crawled_at)}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  <Copy className="h-3.5 w-3.5" />
                  URL 복사
                </button>
              </div>
              <div
                className="mt-6 text-sm leading-relaxed text-gray-700 [&_a]:text-[#1D4ED8] [&_a]:underline [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-gray-900 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
                dangerouslySetInnerHTML={{ __html: article.content_html || '<p>내용이 없습니다.</p>' }}
              />
            </article>

            {/* Latest news */}
            <div className="mx-auto mt-16 max-w-5xl">
              <h2 className="border-b border-gray-200 pb-3 text-xl font-bold text-gray-900">
                최신 뉴스
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {latest.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
                  >
                    <div className="h-32 w-full shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://picsum.photos/id/${item.id}/600/400`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1.5 p-4">
                      <span className="text-xs text-gray-400">
                        {formatDate(item.published_at ?? item.crawled_at)}
                      </span>
                      <h3 className="line-clamp-2 text-sm font-bold text-gray-900">{item.title}</h3>
                      <span className="mt-auto flex items-center gap-1 pt-2 text-xs font-medium text-[#1D4ED8]">
                        Read More <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
