# Admin Blog List Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/admin/posts` — an admin blog post list page with sidebar, header, and TanStack Table + shadcn Table, using static mock data.

**Architecture:** Next.js App Router — server layout wraps a `'use client'` shell that manages sidebar toggle state. The PostTable is a self-contained client component handling search, date range, pagination, and row selection. Mock data lives in `src/lib/mock-data.ts`.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS, shadcn/ui (Base UI), `@tanstack/react-table`, `date-fns`, `lucide-react`

## Global Constraints

- Button renders polymorphically via Base UI `render` prop — NOT Radix `asChild`. Use `<Button render={<Link href="...">}>text</Button>` to render as Link.
- All admin components that use hooks (`useState`, `usePathname`) must have `'use client'` at the top.
- No `asChild` prop anywhere — this project uses `@base-ui/react`, not Radix UI.
- Tailwind CSS v4 — use `bg-violet-600` / `text-violet-700` for active/primary purple.
- `date-fns` v4 is installed — use named imports: `import { format, parseISO } from 'date-fns'`.
- No test framework in project — use `pnpm tsc --noEmit` for type verification after each task.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/mock-data.ts` | Create | Post type + 14 mock posts |
| `src/components/admin/admin-sidebar.tsx` | Create | Left sidebar with nav links, active state |
| `src/components/admin/admin-header.tsx` | Create | Top bar: toggle, home, dark, breadcrumb, user |
| `src/components/admin/admin-shell.tsx` | Create | Client wrapper — owns sidebar open state |
| `src/app/admin/layout.tsx` | Create | Server layout — renders AdminShell |
| `src/app/admin/page.tsx` | Create | Redirect → /admin/posts |
| `src/components/admin/post-table.tsx` | Create | Full table: toolbar + TanStack Table + pagination |
| `src/app/admin/posts/page.tsx` | Create | Server page — passes mock data to PostTable |

---

### Task 1: Install dependency + create Post type + mock data

**Files:**
- Create: `src/lib/mock-data.ts`

**Interfaces:**
- Produces: `Post` type, `mockPosts: Post[]` — consumed by Task 4 (PostTable) and Task 5 (page)

- [ ] **Step 1: Install @tanstack/react-table**

```bash
pnpm add @tanstack/react-table
```

Expected: package added to `dependencies` in `package.json`.

- [ ] **Step 2: Create mock data file**

Create `src/lib/mock-data.ts`:

```ts
export type Post = {
  id: string
  title: string
  thumbnailUrl: string
  uploadedAt: string  // ISO 8601
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
```

- [ ] **Step 3: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

---

### Task 2: Admin sidebar + header + shell + layout

**Files:**
- Create: `src/components/admin/admin-sidebar.tsx`
- Create: `src/components/admin/admin-header.tsx`
- Create: `src/components/admin/admin-shell.tsx`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/page.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces: `AdminShell` component consumed by `src/app/admin/layout.tsx`; full admin chrome visible at `/admin/*`

- [ ] **Step 1: Create admin-sidebar.tsx**

Create `src/components/admin/admin-sidebar.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Briefcase,
  Newspaper,
  FlaskConical,
  Share2,
  UserCog,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Main Home', href: '/', icon: Home },
  { label: 'Careers', href: '/admin/careers', icon: Briefcase },
  { label: 'Blog & News', href: '/admin/posts', icon: Newspaper },
  { label: 'Research', href: '/admin/research', icon: FlaskConical },
  { label: 'SNS', href: '/admin/sns', icon: Share2 },
  { label: 'Admin User', href: '/admin/users', icon: UserCog },
  { label: 'Board', href: '/admin/board', icon: LayoutDashboard },
  { label: 'Privacy Policy', href: '/admin/privacy', icon: ShieldCheck },
]

export function AdminSidebar({ open }: { open: boolean }) {
  const pathname = usePathname()

  if (!open) return null

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r bg-white">
      {/* Logo */}
      <div className="border-b px-6 py-5">
        <p className="text-lg font-bold leading-none tracking-tight">42dot</p>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
          Contents Management System
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === '/'
                ? pathname === '/'
                : pathname === href || pathname.startsWith(href + '/')
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isActive ? 'text-violet-600' : 'text-gray-400'
                    )}
                  />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t px-6 py-4">
        <p className="text-[11px] text-muted-foreground">
          © 2026 42dot. All rights reserved.
        </p>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Create admin-header.tsx**

Create `src/components/admin/admin-header.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Home, Moon, ChevronRight, Crown, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const breadcrumbMap: Record<string, string> = {
  '/admin/posts': 'BLOG & NEWS',
  '/admin/careers': 'CAREERS',
  '/admin/research': 'RESEARCH',
  '/admin/sns': 'SNS',
  '/admin/users': 'ADMIN USER',
  '/admin/board': 'BOARD',
  '/admin/privacy': 'PRIVACY POLICY',
}

export function AdminHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const pathname = usePathname()

  const crumbLabel =
    Object.entries(breadcrumbMap)
      .filter(([key]) => pathname.startsWith(key))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? ''

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b bg-white px-4">
      {/* Left */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" render={<Link href="/" />}>
          <Home className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
          <Moon className="h-3.5 w-3.5" />
          Dark
        </Button>

        {/* Breadcrumb */}
        <nav className="ml-2 flex items-center gap-1 text-sm text-muted-foreground">
          <Link href="/admin" className="hover:text-foreground">
            42dot
          </Link>
          {crumbLabel && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-medium text-violet-600">{crumbLabel}</span>
            </>
          )}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 text-sm">
        <Crown className="h-4 w-4 text-yellow-400" />
        <span className="text-muted-foreground">(하이브랩)정민수</span>
        <Button variant="ghost" size="icon">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Create admin-shell.tsx**

Create `src/components/admin/admin-shell.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar open={sidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create admin layout + redirect page**

Create `src/app/admin/layout.tsx`:

```tsx
import { AdminShell } from '@/components/admin/admin-shell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
```

Create `src/app/admin/page.tsx`:

```tsx
import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect('/admin/posts')
}
```

- [ ] **Step 5: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Visual check**

```bash
pnpm dev
```

Open `http://localhost:3000/admin` — should redirect to `/admin/posts` and show the sidebar + header chrome. "Blog & News" in the sidebar should be highlighted violet.

---

### Task 3: PostTable component

**Files:**
- Create: `src/components/admin/post-table.tsx`

**Interfaces:**
- Consumes: `Post` from `@/lib/mock-data`
- Produces: `PostTable` component that accepts `data: Post[]`

- [ ] **Step 1: Create post-table.tsx**

Create `src/components/admin/post-table.tsx`:

```tsx
'use client'

import { useState, useMemo } from 'react'
import {
  type ColumnDef,
  type PaginationState,
  type RowSelectionState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { format, parseISO, isBefore, isAfter, startOfDay, endOfDay } from 'date-fns'
import Link from 'next/link'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Post } from '@/lib/mock-data'

const columns: ColumnDef<Post>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        className="h-4 w-4 cursor-pointer accent-violet-600"
        checked={table.getIsAllPageRowsSelected()}
        ref={(el) => {
          if (el) el.indeterminate = table.getIsSomePageRowsSelected()
        }}
        onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="h-4 w-4 cursor-pointer accent-violet-600"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
        aria-label="Select row"
      />
    ),
    size: 40,
  },
  {
    accessorKey: 'thumbnailUrl',
    header: '썸네일 이미지',
    cell: ({ row }) => (
      <div className="flex justify-center">
        <img
          src={row.getValue<string>('thumbnailUrl')}
          alt="thumbnail"
          className="h-[60px] w-[80px] rounded object-cover"
        />
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: 'title',
    header: '제목',
    cell: ({ row }) => (
      <p className="line-clamp-2 text-sm leading-relaxed">
        {row.getValue<string>('title')}
      </p>
    ),
  },
  {
    accessorKey: 'uploadedAt',
    header: '업로드 일시',
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm text-muted-foreground">
        {format(parseISO(row.getValue<string>('uploadedAt')), 'yyyy-MM-dd HH:mm:ss')}
      </span>
    ),
    size: 180,
  },
  {
    accessorKey: 'status',
    header: '게시',
    cell: ({ row }) => {
      const status = row.getValue<string>('status')
      return status === 'published' ? (
        <Badge className="bg-violet-600 text-white hover:bg-violet-700">게시</Badge>
      ) : (
        <Badge variant="secondary">Draft</Badge>
      )
    },
    size: 80,
  },
  {
    id: 'actions',
    header: '수정',
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="sm"
        className="text-xs"
        render={<Link href={`/admin/posts/${row.original.id}/edit`} />}
      >
        수정
      </Button>
    ),
    size: 80,
  },
]

interface PostTableProps {
  data: Post[]
}

export function PostTable({ data }: PostTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [searchValue, setSearchValue] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const filteredData = useMemo(() => {
    return data.filter((post) => {
      if (
        searchValue &&
        !post.title.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        return false
      }
      if (dateFrom) {
        const from = startOfDay(parseISO(dateFrom))
        if (isBefore(parseISO(post.uploadedAt), from)) return false
      }
      if (dateTo) {
        const to = endOfDay(parseISO(dateTo))
        if (isAfter(parseISO(post.uploadedAt), to)) return false
      }
      return true
    })
  }, [data, searchValue, dateFrom, dateTo])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { rowSelection, pagination },
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  })

  const selectedIds = Object.keys(rowSelection)
  const pageCount = table.getPageCount()
  const currentPageIndex = table.getState().pagination.pageIndex

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
              setPagination((p) => ({ ...p, pageIndex: 0 }))
            }}
            className="h-9 w-56 pl-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value)
              setPagination((p) => ({ ...p, pageIndex: 0 }))
            }}
            className="h-9 w-38 text-sm"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value)
              setPagination((p) => ({ ...p, pageIndex: 0 }))
            }}
            className="h-9 w-38 text-sm"
          />
        </div>
      </div>

      {/* Count + page-size row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          전체{' '}
          <span className="font-semibold text-foreground">{filteredData.length}</span>
        </p>
        <Select
          value={String(pagination.pageSize)}
          onValueChange={(val) =>
            setPagination({ pageIndex: 0, pageSize: Number(val) })
          }
        >
          <SelectTrigger className="h-8 w-32 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10개씩 보기</SelectItem>
            <SelectItem value="20">20개씩 보기</SelectItem>
            <SelectItem value="50">50개씩 보기</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50 hover:bg-gray-50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-center text-xs font-semibold text-gray-700"
                    style={{ width: header.column.columnDef.size }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  className="h-20"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between">
        {/* Delete */}
        <Button
          variant="outline"
          size="sm"
          disabled={selectedIds.length === 0}
        >
          삭제{selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
        </Button>

        {/* Pagination */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: pageCount }, (_, i) => (
            <Button
              key={i}
              variant={currentPageIndex === i ? 'default' : 'outline'}
              size="icon-sm"
              className={cn(
                currentPageIndex === i ? 'bg-violet-600 hover:bg-violet-700' : ''
              )}
              onClick={() => table.setPageIndex(i)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Register */}
        <Button
          className="bg-violet-600 hover:bg-violet-700"
          render={<Link href="/admin/posts/new" />}
        >
          등록
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

---

### Task 4: Admin posts page

**Files:**
- Create: `src/app/admin/posts/page.tsx`

**Interfaces:**
- Consumes: `mockPosts` from `@/lib/mock-data`, `PostTable` from `@/components/admin/post-table`
- Produces: fully working `/admin/posts` page

- [ ] **Step 1: Create posts directory + page**

```bash
mkdir -p src/app/admin/posts
```

Create `src/app/admin/posts/page.tsx`:

```tsx
import { mockPosts } from '@/lib/mock-data'
import { PostTable } from '@/components/admin/post-table'

export default function AdminPostsPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-xl font-semibold">블로그 & 뉴스 글 목록</h1>
      <PostTable data={mockPosts} />
    </div>
  )
}
```

- [ ] **Step 2: Final type-check**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Visual verification**

```bash
pnpm dev
```

Open `http://localhost:3000/admin/posts` and verify:
- Sidebar visible on left with "Blog & News" highlighted in violet
- Header shows breadcrumb `42dot › BLOG & NEWS`
- Table shows 14 rows with thumbnails, titles, dates, status badges
- Search box filters rows as you type
- Date range inputs filter by upload date
- Page size selector (default 20) shows all 14 rows on one page
- Row checkboxes selectable; "삭제" button appears enabled when rows selected
- "등록" button visible in bottom-right (violet)
- Sidebar toggle (hamburger) collapses/shows sidebar
