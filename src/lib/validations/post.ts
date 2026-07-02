import { z } from 'zod'

export const postFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().optional(),
})

export type PostFormValues = z.infer<typeof postFormSchema>
