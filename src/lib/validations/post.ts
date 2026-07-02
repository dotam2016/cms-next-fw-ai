import { z } from 'zod'

export const postFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  description: z
    .string()
    .min(1, '설명을 입력해주세요')
    .max(200, '설명은 최대 200자까지 입력할 수 있습니다'),
  content: z.string().optional(),
})

export type PostFormValues = z.infer<typeof postFormSchema>
