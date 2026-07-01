export type Post = {
  id: string
  title: string
  thumbnailUrl: string
  uploadedAt: string // ISO 8601
  status: 'published' | 'draft'
}

export const mockPosts: Post[] = [
  {
    id: '1',
    title: '"해도 너무하다, 창피해"...엔스 모친, 홍명보 감독 선임 때 남긴 글 재조명',
    thumbnailUrl: 'https://picsum.photos/seed/post1/120/80',
    uploadedAt: '2026-06-30T12:38:07',
    status: 'published',
  },
  {
    id: '2',
    title: 'Next.js 16 App Router Deep Dive: What Changed and What Stayed',
    thumbnailUrl: 'https://picsum.photos/seed/post2/120/80',
    uploadedAt: '2026-06-28T09:15:00',
    status: 'published',
  },
  {
    id: '3',
    title: 'Tailwind CSS v4 Migration Guide for Enterprise Projects',
    thumbnailUrl: 'https://picsum.photos/seed/post3/120/80',
    uploadedAt: '2026-06-25T14:22:33',
    status: 'draft',
  },
  {
    id: '4',
    title: 'Understanding TanStack Table v8: A Practical Guide',
    thumbnailUrl: 'https://picsum.photos/seed/post4/120/80',
    uploadedAt: '2026-06-20T10:00:00',
    status: 'published',
  },
  {
    id: '5',
    title: 'CKEditor 5 Integration with React 19 and Next.js App Router',
    thumbnailUrl: 'https://picsum.photos/seed/post5/120/80',
    uploadedAt: '2026-06-18T16:45:00',
    status: 'draft',
  },
  {
    id: '6',
    title: 'shadcn/ui v4: New Components and Patterns You Need to Know',
    thumbnailUrl: 'https://picsum.photos/seed/post6/120/80',
    uploadedAt: '2026-06-15T11:30:00',
    status: 'published',
  },
  {
    id: '7',
    title: 'Zod v4 Breaking Changes and Migration Tips for TypeScript Projects',
    thumbnailUrl: 'https://picsum.photos/seed/post7/120/80',
    uploadedAt: '2026-06-10T08:00:00',
    status: 'draft',
  },
  {
    id: '8',
    title: 'React Hook Form v8: New Features and Performance Improvements',
    thumbnailUrl: 'https://picsum.photos/seed/post8/120/80',
    uploadedAt: '2026-06-08T13:20:00',
    status: 'published',
  },
  {
    id: '9',
    title: 'Deploying Next.js on Vercel with pnpm: Complete Guide 2026',
    thumbnailUrl: 'https://picsum.photos/seed/post9/120/80',
    uploadedAt: '2026-06-05T10:10:00',
    status: 'published',
  },
  {
    id: '10',
    title: 'TypeScript 5.8 New Features: Better Inference and Stricter Types',
    thumbnailUrl: 'https://picsum.photos/seed/post10/120/80',
    uploadedAt: '2026-06-01T09:00:00',
    status: 'draft',
  },
  {
    id: '11',
    title: 'Building a CMS with Next.js and a Headless Backend API',
    thumbnailUrl: 'https://picsum.photos/seed/post11/120/80',
    uploadedAt: '2026-05-28T14:00:00',
    status: 'published',
  },
  {
    id: '12',
    title: 'State Management in 2026: TanStack Query vs SWR vs Zustand',
    thumbnailUrl: 'https://picsum.photos/seed/post12/120/80',
    uploadedAt: '2026-05-25T11:00:00',
    status: 'published',
  },
  {
    id: '13',
    title: 'CSS Grid vs Flexbox: When to Use Which in Tailwind CSS',
    thumbnailUrl: 'https://picsum.photos/seed/post13/120/80',
    uploadedAt: '2026-05-20T16:30:00',
    status: 'draft',
  },
  {
    id: '14',
    title: 'Web Performance Optimization Tips for Next.js Applications in 2026',
    thumbnailUrl: 'https://picsum.photos/seed/post14/120/80',
    uploadedAt: '2026-05-15T10:45:00',
    status: 'published',
  },
]
