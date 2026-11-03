import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type FilterChipProps = Omit<ComponentProps<'button'>, 'aria-pressed' | 'children'> & {
  pressed: boolean
  children: ReactNode
}

/** Filtro de alternancia: etiqueta fija + aria-pressed (los filtros no son pestañas). */
export function FilterChip({ pressed, className, children, ...props }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        'inline-flex min-h-control-sm items-center rounded-full px-4 py-2 font-sans text-label-md whitespace-nowrap transition-colors duration-200',
        pressed
          ? 'bg-action font-semibold text-on-action'
          : 'bg-surface-strong text-text-muted hover:bg-surface-stronger hover:text-text-strong',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
