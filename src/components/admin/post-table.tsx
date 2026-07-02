'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  type ColumnDef,
  type RowSelectionState,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import { format, parseISO, isBefore, isAfter, startOfDay, endOfDay } from 'date-fns'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { listNews, type NewsListItem } from '@/lib/api/news'

const columns: ColumnDef<NewsListItem>[] = [
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
    accessorKey: 'title',
    header: '제목',
    cell: ({ row }) => (
      <p className="line-clamp-2 text-sm leading-relaxed text-foreground">
        {row.getValue<string>('title')}
      </p>
    ),
  },
  {
    accessorKey: 'description',
    header: '설명',
    cell: ({ row }) => (
      <p className="line-clamp-2 text-sm leading-relaxed text-foreground">
        {row.getValue<string>('description')}
      </p>
    ),
  },
  {
    accessorKey: 'published_at',
    header: '게시 일시',
    cell: ({ row }) => {
      const publishedAt = row.getValue<string | null>('published_at')
      return (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {publishedAt ? format(parseISO(publishedAt), 'yyyy-MM-dd HH:mm:ss') : '-'}
        </span>
      )
    },
    size: 180,
  },
  {
    id: 'actions',
    header: '수정',
    cell: ({ row }) => (
      <Link
        href={`/admin/posts/${row.original.id}/edit`}
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'border-gray-200 text-xs px-3 h-8 bg-white hover:bg-gray-50 text-gray-700 font-medium shadow-none transition-colors min-w-30'
        )}
      >
        수정
      </Link>
    ),
    size: 72,
  },
]

export function PostTable() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const q = searchParams.get('q') ?? ''
  const dateFrom = searchParams.get('date_from') ?? ''
  const dateTo = searchParams.get('date_to') ?? ''
  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = Number(searchParams.get('page_size') ?? '20')

  const [searchValue, setSearchValue] = useState(q)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [items, setItems] = useState<NewsListItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setSearchValue(q)
  }, [q])

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') {
          next.delete(key)
        } else {
          next.set(key, value)
        }
      }
      router.push(`${pathname}?${next.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  useEffect(() => {
    let cancelled = false

    async function fetchNews() {
      setLoading(true)
      setError(null)
      try {
        const result = await listNews({
          q: q || undefined,
          date_from: dateFrom ? format(startOfDay(parseISO(dateFrom)), "yyyy-MM-dd'T'HH:mm:ss") : undefined,
          date_to: dateTo ? format(endOfDay(parseISO(dateTo)), "yyyy-MM-dd'T'HH:mm:ss") : undefined,
          page,
          page_size: pageSize,
        })
        if (cancelled) return
        setItems(result.items)
        setTotal(result.total)
        setRowSelection({})
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : '목록을 불러오지 못했습니다.')
        setItems([])
        setTotal(0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchNews()
    return () => {
      cancelled = true
    }
  }, [q, dateFrom, dateTo, page, pageSize])

  const table = useReactTable({
    data: items,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  const selectedIds = Object.keys(rowSelection)
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <SearchInput
          value={searchValue}
          onValueChange={setSearchValue}
          onSearch={() => updateParams({ q: searchValue || null, page: null })}
          onClear={() => {
            setSearchValue('')
            updateParams({ q: null, page: null })
          }}
        />

        {/* Date range */}
        <div className="flex items-center gap-2">
          <DatePicker
            value={dateFrom}
            onChange={(val) => updateParams({ date_from: val || null, page: null })}
            disabled={(date) => (dateTo ? isAfter(date, endOfDay(parseISO(dateTo))) : false)}
          />
          <span className="text-sm text-gray-400 font-medium">-</span>
          <DatePicker
            value={dateTo}
            onChange={(val) => updateParams({ date_to: val || null, page: null })}
            disabled={(date) => (dateFrom ? isBefore(date, startOfDay(parseISO(dateFrom))) : false)}
          />
        </div>
      </div>

      {/* Count + page-size */}
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-sm text-gray-700">
          전체 <span className="font-bold text-gray-900">{total}</span>
        </p>
        <Select
          value={String(pageSize)}
          onValueChange={(val) => updateParams({ page_size: val, page: null })}
        >
          <SelectTrigger className="h-9 w-32 text-xs border-gray-200 focus-visible:ring-violet-600 focus-visible:border-violet-600 rounded-md">
            {pageSize}개씩 보기
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10개씩 보기</SelectItem>
            <SelectItem value="20">20개씩 보기</SelectItem>
            <SelectItem value="50">50개씩 보기</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200 border-collapse">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'py-3.5 text-xs font-semibold text-gray-700 border-r border-gray-200 last:border-r-0',
                      header.column.id === 'select'
                        ? 'px-2 text-center'
                        : header.column.id === 'title'
                          ? 'px-4 text-left'
                          : 'px-4 text-center'
                    )}
                    style={{ width: header.column.columnDef.size }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-sm text-red-600">
                  {error}
                </TableCell>
              </TableRow>
            ) : loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-sm text-muted-foreground">
                  불러오는 중...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'py-3.5 align-middle border-r border-gray-200 last:border-r-0',
                        cell.column.id === 'select'
                          ? 'px-2 text-center'
                          : cell.column.id === 'title'
                            ? 'px-4 text-left'
                            : 'px-4 text-center'
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer: delete | pagination | register */}
      <div className="relative flex items-center justify-between pt-5">
        {/* Left Spacer to push pagination to center */}
        <div className="flex-1" />

        {/* Center: Pagination */}
        <div className="flex items-center gap-1 justify-center">
          {pageCount > 1 && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 h-8 w-8"
            onClick={() => updateParams({ page: String(page - 1) })}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          )}
          {Array.from({ length: pageCount }, (_, i) => (
            <Button
              key={i}
              variant={page - 1 === i ? 'default' : 'ghost'}
              size="icon-sm"
              className={cn(
                'rounded-md h-8 w-8 text-sm font-medium transition-colors',
                page - 1 === i
                  ? 'bg-violet-600 hover:bg-violet-700 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
              onClick={() => updateParams({ page: String(i + 1) })}
            >
              {i + 1}
            </Button>
          ))}
          {pageCount > 1 && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 h-8 w-8"
            onClick={() => updateParams({ page: String(page + 1) })}
            disabled={page >= pageCount}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex flex-1 justify-end items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={selectedIds.length === 0}
            className={cn(
              "text-xs px-4 h-9 rounded-md transition-colors w-30",
              selectedIds.length === 0
                ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed opacity-100"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            )}
          >
            삭제{selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
          </Button>
          <Link
            href="/admin/posts/create"
            className={cn(
              buttonVariants({ size: 'sm' }),
              'bg-violet-600 hover:bg-violet-700 text-white text-xs px-4 h-9 rounded-md transition-colors w-30'
            )}
          >
            등록
          </Link>
        </div>
      </div>
    </div>
  )
}
