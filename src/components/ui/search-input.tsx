'use client'

import * as React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from './input'

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onValueChange: (value: string) => void
  onSearch: () => void
  onClear: () => void
}

export function SearchInput({
  value,
  onValueChange,
  onSearch,
  onClear,
  className,
  placeholder = 'Search',
  ...props
}: SearchInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <div className="relative flex items-center">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "h-10 w-72 pr-16 border-gray-200 focus-visible:ring-violet-600 focus-visible:border-violet-600 rounded-md",
          className
        )}
        {...props}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-0.5 rounded-sm hover:bg-gray-100"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onSearch}
          className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-0.5 rounded-sm hover:bg-gray-100"
          aria-label="Submit search"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
