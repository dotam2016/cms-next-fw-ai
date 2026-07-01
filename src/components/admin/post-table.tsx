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
import { Search, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
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
    size: 48,
  },
  {
    accessorKey: 'thumbnailUrl',
    header: '썸네일 이미지',
    cell: ({ row }) => (
      <div className="flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={row.getValue<string>('thumbnailUrl')}
          alt="thumbnail"
          className="h-16 w-24 rounded-md object-cover"
        />
      </div>
    ),
    size: 120,
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
        <Badge variant="outline" className="text-muted-foreground">
          Draft
        </Badge>
      )
    },
    size: 80,
  },
  {
    id: 'actions',
    header: '수정',
    cell: ({ row }) => (
      <Link
        href={`/admin/posts/${row.original.id}/edit`}
        className={cn(
          buttonVariants({ variant: 'outline', size: 'sm' }),
          'border-gray-300 text-xs'
        )}
      >
        수정
      </Link>
    ),
    size: 72,
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
      if (searchValue && !post.title.toLowerCase().includes(searchValue.toLowerCase())) {
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
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
              setPagination((p) => ({ ...p, pageIndex: 0 }))
            }}
            className="h-10 w-56 pl-9"
          />
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value)
                setPagination((p) => ({ ...p, pageIndex: 0 }))
              }}
              placeholder="YYYY.MM.DD"
              className="h-10 w-40 pr-9 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-9 [&::-webkit-calendar-picker-indicator]:opacity-0"
            />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">-</span>
          <div className="relative">
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value)
                setPagination((p) => ({ ...p, pageIndex: 0 }))
              }}
              placeholder="YYYY.MM.DD"
              className="h-10 w-40 pr-9 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-9 [&::-webkit-calendar-picker-indicator]:opacity-0"
            />
            <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Count + page-size */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          전체 <span className="font-semibold text-foreground">{filteredData.length}</span>
        </p>
        <Select
          value={String(pagination.pageSize)}
          onValueChange={(val) => setPagination({ pageIndex: 0, pageSize: Number(val) })}
        >
          <SelectTrigger className="h-9 w-36 text-xs">
            {pagination.pageSize}개씩 보기
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10개씩 보기</SelectItem>
            <SelectItem value="20">20개씩 보기</SelectItem>
            <SelectItem value="50">50개씩 보기</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'py-3 text-xs font-semibold text-muted-foreground',
                      header.column.id === 'title' ? 'text-left' : 'text-center'
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
            {table.getRowModel().rows.length === 0 ? (
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'py-4 align-middle',
                        cell.column.id === 'title' ? 'text-left' : 'text-center'
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
      <div className="flex items-center justify-between pt-1">
        <Button variant="outline" size="sm" disabled={selectedIds.length === 0}>
          삭제{selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: pageCount }, (_, i) => (
            <Button
              key={i}
              variant={currentPageIndex === i ? 'default' : 'ghost'}
              size="icon-sm"
              className={cn(
                'rounded-full',
                currentPageIndex === i && 'bg-violet-600 hover:bg-violet-700'
              )}
              onClick={() => table.setPageIndex(i)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Link
          href="/admin/posts/new"
          className={cn(buttonVariants(), 'bg-violet-600 hover:bg-violet-700')}
        >
          등록
        </Link>
      </div>
    </div>
  )
}
