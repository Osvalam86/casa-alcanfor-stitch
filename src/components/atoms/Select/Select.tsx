import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { iconHref } from '@/lib/icons'
import { fieldClasses } from '@/lib/styles/field'

export type SelectProps = ComponentProps<'select'> & {
  id: string
  /** Las <option> */
  children: ReactNode
}

/** Select nativo con chevron decorativo. */
export function Select({ id, className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select id={id} className={cn(fieldClasses, 'cursor-pointer appearance-none pr-11', className)} {...props}>
        {children}
      </select>
      <svg
        aria-hidden="true"
        focusable="false"
        data-field-icon="expand-more"
        className="pointer-events-none absolute top-1/2 right-3 size-icon-field -translate-y-1/2 fill-current text-text-muted"
      >
        <use href={iconHref('expand-more')} />
      </svg>
    </div>
  )
}
