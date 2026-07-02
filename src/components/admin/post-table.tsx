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
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SearchInput } from '@/components/ui/search-input'
import { DatePicker } from '@/components/ui/date-picker'
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
        <Badge className="bg-green-100 text-gray-900 border-none shadow-none px-3 py-2 font-normal text-[12px]">게시</Badge>
      ) : (
        <Badge className="bg-gray-100 text-gray-400 border-none shadow-none px-3 py-2 font-normal text-[12px]">
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
          'border-gray-200 text-xs px-3 h-8 bg-white hover:bg-gray-50 text-gray-700 font-medium shadow-none transition-colors min-w-30'
        )}
      >
        수정
      </Link>
    ),
    size: 72,
  },
]

// Reusable components are imported from @/components/ui/

interface PostTableProps {
  data: Post[]
}

export function PostTable({ data }: PostTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [searchValue, setSearchValue] = useState('')
  const [activeSearch, setActiveSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const filteredData = useMemo(() => {
    return data.filter((post) => {
      if (activeSearch && !post.title.toLowerCase().includes(activeSearch.toLowerCase())) {
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
  }, [data, activeSearch, dateFrom, dateTo])

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
    <div className="flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <SearchInput
          value={searchValue}
          onValueChange={setSearchValue}
          onSearch={() => {
            setActiveSearch(searchValue)
            setPagination((p) => ({ ...p, pageIndex: 0 }))
          }}
          onClear={() => {
            setSearchValue('')
            setActiveSearch('')
            setPagination((p) => ({ ...p, pageIndex: 0 }))
          }}
        />

        {/* Date range */}
        <div className="flex items-center gap-2">
          <DatePicker
            value={dateFrom}
            onChange={(val) => {
              setDateFrom(val)
              setPagination((p) => ({ ...p, pageIndex: 0 }))
            }}
            disabled={(date) => (dateTo ? isAfter(date, endOfDay(parseISO(dateTo))) : false)}
          />
          <span className="text-sm text-gray-400 font-medium">-</span>
          <DatePicker
            value={dateTo}
            onChange={(val) => {
              setDateTo(val)
              setPagination((p) => ({ ...p, pageIndex: 0 }))
            }}
            disabled={(date) => (dateFrom ? isBefore(date, startOfDay(parseISO(dateFrom))) : false)}
          />
        </div>
      </div>

      {/* Count + page-size */}
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-sm text-gray-700">
          전체 <span className="font-bold text-gray-900">{filteredData.length}</span>
        </p>
        <Select
          value={String(pagination.pageSize)}
          onValueChange={(val) => setPagination({ pageIndex: 0, pageSize: Number(val) })}
        >
          <SelectTrigger className="h-9 w-32 text-xs border-gray-200 focus-visible:ring-violet-600 focus-visible:border-violet-600 rounded-md">
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
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200 border-collapse">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'py-3.5 px-4 text-xs font-semibold text-gray-700 border-r border-gray-200 last:border-r-0',
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
                  className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'py-3.5 px-4 align-middle border-r border-gray-200 last:border-r-0',
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
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          )}
          {Array.from({ length: pageCount }, (_, i) => (
            <Button
              key={i}
              variant={currentPageIndex === i ? 'default' : 'ghost'}
              size="icon-sm"
              className={cn(
                'rounded-md h-8 w-8 text-sm font-medium transition-colors',
                currentPageIndex === i
                  ? 'bg-violet-600 hover:bg-violet-700 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
              onClick={() => table.setPageIndex(i)}
            >
              {i + 1}
            </Button>
          ))}
          {pageCount > 1 && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 h-8 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
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
            href="/admin/posts/new"
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
