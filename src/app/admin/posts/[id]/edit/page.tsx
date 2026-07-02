'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { toast } from 'sonner'
import { PostForm } from '@/components/admin/post-form'
import { getNews, setTrending, updateNews } from '@/lib/api/news'
import type { PostFormValues } from '@/lib/validations/post'

export default function AdminPostEditPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = Number(params.id)

  const [defaultValues, setDefaultValues] = useState<PostFormValues | null>(null)
  const [createdAt, setCreatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchPost() {
      setLoading(true)
      setError(null)
      try {
        const news = await getNews(id)
        if (cancelled) return
        setDefaultValues({
          title: news.title,
          description: news.description ?? '',
          content: news.content_html ?? '',
          is_trending: news.is_trending,
        })
        setCreatedAt(news.published_at ?? news.crawled_at)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : '게시글을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPost()
    return () => {
      cancelled = true
    }
  }, [id])

  const handleSubmit = async (values: PostFormValues) => {
    try {
      await Promise.all([
        updateNews(id, {
          title: values.title,
          description: values.description,
          content_html: values.content?.trim() ? values.content : null,
        }),
        setTrending(id, values.is_trending),
      ])
      toast.success('게시글이 수정되었습니다.')
      router.push('/admin/posts')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '게시글 수정에 실패했습니다.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">블로그 & 뉴스 글 수정</h1>
        {createdAt && (
          <span className="text-sm text-muted-foreground">
            created: {format(parseISO(createdAt), 'yyyy-MM-dd HH:mm:ss')}
          </span>
        )}
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      ) : error ? (
        <div className="flex flex-col gap-3 rounded-lg bg-white p-6">
          <p className="text-sm text-red-600">{error}</p>
          <Link href="/admin/posts" className="w-fit text-sm text-[#0b1b3a] hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      ) : defaultValues ? (
        <PostForm defaultValues={defaultValues} onSubmit={handleSubmit} submitLabel="수정" />
      ) : null}
    </div>
  )
}
