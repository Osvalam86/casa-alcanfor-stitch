import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type LabelProps = ComponentProps<'label'> & {
  htmlFor: string
  children: ReactNode
  /** Marca visible de obligatorio (texto desde content/, p. ej. "Requerido") */
  requiredText?: string
  invalid?: boolean
}

export function Label({ htmlFor, requiredText, invalid = false, className, children, ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'flex items-baseline justify-between gap-2 font-sans text-label-caps uppercase',
        invalid ? 'text-error' : 'text-text',
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {requiredText ? (
        <span className={cn('text-caption font-medium normal-case tracking-normal', invalid ? 'text-error' : 'text-text-muted')}>
          {requiredText}
        </span>
      ) : null}
    </label>
  )
}
