'use client'

import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Editor from '@/components/ui/editor'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { postFormSchema, type PostFormValues } from '@/lib/validations/post'

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
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: { title: '', content: '', ...defaultValues },
  })

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
          className="border-gray-200 focus-visible:ring-violet-600 focus-visible:border-violet-600 rounded-md"
          {...register('title')}
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
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

      <div className="flex items-center justify-end gap-2 pt-2">
        <Link
          href="/admin/posts"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'border-gray-200 text-xs px-4 h-9 bg-white hover:bg-gray-50 text-gray-700 font-medium shadow-none'
          )}
        >
          취소
        </Link>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="bg-violet-600 hover:bg-violet-700 text-white text-xs px-4 h-9 rounded-md font-medium disabled:opacity-60"
        >
          {isSubmitting ? '저장 중...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
