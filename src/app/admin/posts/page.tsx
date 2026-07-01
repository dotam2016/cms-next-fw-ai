import { mockPosts } from '@/lib/mock-data'
import { PostTable } from '@/components/admin/post-table'

export default function AdminPostsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">블로그 & 뉴스 글 목록</h1>
      <PostTable data={mockPosts} />
    </div>
  )
}
