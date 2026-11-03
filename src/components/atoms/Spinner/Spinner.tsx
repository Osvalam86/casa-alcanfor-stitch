import { cn } from '@/lib/cn'

export type SpinnerProps = {
  /** Texto para lectores de pantalla; si se omite, el spinner es decorativo */
  label?: string
  className?: string
}

export function Spinner({ label, className }: SpinnerProps) {
  return (
    <span className={cn('inline-flex items-center', className)}>
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-current border-r-transparent text-accent"
      />
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  )
}
