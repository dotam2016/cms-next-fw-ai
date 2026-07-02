'use client'

import * as React from 'react'
import { format, parseISO } from 'date-fns'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Calendar } from './calendar'

export interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: (date: Date) => boolean
}

export function DatePicker({ value, onChange, placeholder = 'YYYY.MM.DD', disabled }: DatePickerProps) {
  return (
    <Popover>
      <div className="relative">
        <PopoverTrigger
          className={cn(
            "h-10 w-[160px] px-3 border border-gray-200 rounded-md text-left font-normal flex items-center justify-between bg-white text-gray-700 hover:bg-gray-50 focus:outline-hidden focus-visible:ring-[#0b1b3a] focus-visible:border-[#0b1b3a] shadow-none cursor-pointer",
            !value && "text-gray-400"
          )}
        >
          <span>{value ? format(parseISO(value), 'yyyy.MM.dd') : placeholder}</span>
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
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? parseISO(value) : undefined}
          onSelect={(date) => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  )
}
