'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PostForm } from '@/components/admin/post-form'
import { createNews } from '@/lib/api/news'
import type { PostFormValues } from '@/lib/validations/post'

export default function AdminPostCreatePage() {
  const router = useRouter()

  const handleSubmit = async (values: PostFormValues) => {
    try {
      await createNews({
        title: values.title,
        description: values.description,
        content_html: values.content?.trim() ? values.content : null,
        is_trending: values.is_trending,
      })
      toast.success('게시글이 등록되었습니다.')
      router.push('/admin/posts')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '게시글 등록에 실패했습니다.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">블로그 & 뉴스 글 등록</h1>
      <PostForm onSubmit={handleSubmit} />
    </div>
  )
}
