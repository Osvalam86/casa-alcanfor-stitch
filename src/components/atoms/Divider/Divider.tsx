import { cn } from '@/lib/cn'
import { iconHref } from '@/lib/icons'

export type DividerProps = {
  /** hairline: separador temático (<hr>); botanical: ornamento decorativo */
  variant?: 'hairline' | 'botanical'
  className?: string
}

export function Divider({ variant = 'hairline', className }: DividerProps) {
  if (variant === 'botanical') {
    return (
      <div aria-hidden="true" className={cn('flex items-center justify-center gap-2 text-accent', className)}>
        <span className="h-px w-12 bg-border-subtle" />
        <svg focusable="false" className="size-4.5 fill-current">
          <use href={iconHref('eco')} />
        </svg>
        <span className="h-px w-12 bg-border-subtle" />
      </div>
    )
  }

  return <hr className={cn('border-0 border-t border-border', className)} />
}
