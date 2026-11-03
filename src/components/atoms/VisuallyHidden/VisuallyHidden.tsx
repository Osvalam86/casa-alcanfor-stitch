import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type VisuallyHiddenProps = ComponentProps<'span'> & {
  children: ReactNode
}

/** Texto solo para tecnología asistiva. */
export function VisuallyHidden({ className, children, ...props }: VisuallyHiddenProps) {
  return (
    <span className={cn('sr-only', className)} {...props}>
      {children}
    </span>
  )
}
