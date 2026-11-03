import type { ComponentProps, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-sans text-label-caps uppercase whitespace-nowrap',
  {
    variants: {
      variant: {
        sage: 'bg-action text-on-action',
        gold: 'bg-accent-soft text-on-accent-soft',
        goldSolid: 'bg-accent text-on-accent shadow-md',
        neutral: 'bg-surface-strong text-text-strong',
        outline: 'border border-border-subtle bg-surface-strong text-accent',
        onImage: 'border border-border-subtle bg-surface/90 text-accent shadow-sm backdrop-blur-md',
        success: 'rounded-sm bg-success-soft text-success',
        error: 'rounded-sm bg-error-soft text-error',
        warning: 'rounded-sm bg-warning-soft text-on-accent-soft',
      },
    },
    defaultVariants: { variant: 'gold' },
  },
)

export type BadgeProps = ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    children: ReactNode
    /** Punto decorativo antes del texto */
    dot?: boolean
    icon?: ReactNode
  }

export function Badge({ variant, dot = false, icon, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot ? <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" /> : null}
      {icon}
      {children}
    </span>
  )
}
