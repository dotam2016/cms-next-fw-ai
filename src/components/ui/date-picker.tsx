'use client'

import * as React from 'react'
import { format, parseISO, startOfMonth, endOfMonth, isSameMonth } from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

const MONTH_LABELS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

export interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: (date: Date) => boolean
  /** Which edge of the selected month the emitted value should represent. */
  boundary?: 'start' | 'end'
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'YYYY.MM',
  disabled,
  boundary = 'start',
}: DatePickerProps) {
  const selectedDate = value ? parseISO(value) : undefined
  const [viewYear, setViewYear] = React.useState(() => (selectedDate ?? new Date()).getFullYear())

  React.useEffect(() => {
    if (selectedDate) setViewYear(selectedDate.getFullYear())
  }, [value])

  const handleSelect = (monthIndex: number) => {
    const candidate = new Date(viewYear, monthIndex, 1)
    const normalized = boundary === 'end' ? endOfMonth(candidate) : startOfMonth(candidate)
    onChange(format(normalized, 'yyyy-MM-dd'))
  }

  return (
    <Popover>
      <div className="relative">
        <PopoverTrigger
          className={cn(
            "h-10 w-[140px] px-3 border border-gray-200 rounded-md text-left font-normal flex items-center justify-between bg-white text-gray-700 hover:bg-gray-50 focus:outline-hidden focus-visible:ring-[#0b1b3a] focus-visible:border-[#0b1b3a] shadow-none cursor-pointer",
            !value && "text-gray-400"
          )}
        >
          <span>{selectedDate ? format(selectedDate, 'yyyy.MM') : placeholder}</span>
          {!value && <CalendarIcon className="h-4 w-4 text-muted-foreground" />}
        </PopoverTrigger>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange('')
            }}
            aria-label="Clear date"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <PopoverContent className="w-[240px] p-3" align="start">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewYear((y) => y - 1)}
            aria-label="Previous year"
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-gray-900">{viewYear}</span>
          <button
            type="button"
            onClick={() => setViewYear((y) => y + 1)}
            aria-label="Next year"
            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {MONTH_LABELS.map((label, index) => {
            const candidate = new Date(viewYear, index, 1)
            const boundaryDate = boundary === 'end' ? endOfMonth(candidate) : startOfMonth(candidate)
            const isDisabled = disabled?.(boundaryDate) ?? false
            const isSelected = selectedDate ? isSameMonth(selectedDate, candidate) : false
            return (
              <button
                key={label}
                type="button"
                disabled={isDisabled}
                onClick={() => handleSelect(index)}
                className={cn(
                  "h-9 rounded-md text-sm font-normal text-gray-700 hover:bg-gray-100 cursor-pointer",
                  isSelected && "bg-[#0b1b3a] text-white hover:bg-[#0b1b3a]",
                  isDisabled && "text-gray-300 opacity-40 cursor-not-allowed hover:bg-transparent"
                )}
              >
                {label}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
