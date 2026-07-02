'use client'

import * as React from 'react'
import { format, parseISO } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
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
      <PopoverTrigger
        className={cn(
          "h-10 w-[160px] px-3 border border-gray-200 rounded-md text-left font-normal flex items-center justify-between bg-white text-gray-700 hover:bg-gray-50 focus:outline-hidden focus-visible:ring-violet-600 focus-visible:border-violet-600 shadow-none cursor-pointer",
          !value && "text-gray-400"
        )}
      >
        <span>{value ? format(parseISO(value), 'yyyy.MM.dd') : placeholder}</span>
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      </PopoverTrigger>
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
