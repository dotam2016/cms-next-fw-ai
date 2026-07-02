'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { postFormSchema, type PostFormValues } from '@/lib/validations/post'

const Editor = dynamic(() => import('@/components/ui/editor'), { ssr: false })

interface PostFormProps {
  defaultValues?: Partial<PostFormValues>
  onSubmit: (values: PostFormValues) => Promise<void> | void
  submitLabel?: string
}

export function PostForm({ defaultValues, onSubmit, submitLabel = '등록' }: PostFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: { title: '', description: '', content: '', is_trending: false, ...defaultValues },
  })

  const descriptionLength = watch('description')?.length ?? 0

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          제목 *
        </Label>
        <Input
          id="title"
          placeholder="제목을 입력해주세요"
          aria-invalid={!!errors.title}
          className="border-gray-200 focus-visible:ring-[#0b1b3a] focus-visible:border-[#0b1b3a] rounded-md"
          {...register('title')}
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
          설명 *
        </Label>
        <Textarea
          id="description"
          rows={3}
          maxLength={200}
          placeholder="설명을 입력해주세요"
          aria-invalid={!!errors.description}
          className="border-gray-200 focus-visible:ring-[#0b1b3a] focus-visible:border-[#0b1b3a] rounded-md"
          {...register('description')}
        />
        <div className="flex items-center justify-between">
          {errors.description ? (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-gray-400">{descriptionLength}/200</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="content" className="text-sm font-medium text-gray-700">
          내용
        </Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <Editor value={field.value ?? ''} onChange={field.onChange} placeholder="내용을 입력해주세요" />
          )}
        />
      </div>

      {/* <div className="flex items-center gap-2">
        <input
          id="is_trending"
          type="checkbox"
          className="h-4 w-4 cursor-pointer accent-[#0b1b3a]"
          {...register('is_trending')}
        />
        <Label htmlFor="is_trending" className="text-sm font-medium text-gray-700 cursor-pointer">
          Bài viết nổi bật
        </Label>
      </div> */}

      <div className="flex items-center justify-end gap-2 pt-2">
        <Link
          href="/admin/posts"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'border-gray-200 text-xs px-4 h-9 bg-white hover:bg-gray-50 text-gray-700 font-medium shadow-none w-30'
          )}
        >
          취소
        </Link>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="bg-[#0b1b3a] hover:bg-[#132a56] text-white text-xs px-4 h-9 rounded-md font-medium disabled:opacity-60 w-30"
        >
          {isSubmitting ? '저장 중...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
