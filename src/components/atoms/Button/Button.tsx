import type { ComponentProps, MouseEvent, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { buttonVariants, type ButtonVariantProps } from './buttonVariants'

export type ButtonProps = ComponentProps<'button'> &
  ButtonVariantProps & {
    children: ReactNode
    /** Ícono u otro nodo decorativo después del texto */
    iconEnd?: ReactNode
    iconStart?: ReactNode
    /** Estado de carga: el botón sigue enfocable pero no ejecuta la acción */
    loading?: boolean
    /** Texto visible mientras carga (viene de content/) */
    loadingLabel?: string
  }

export function Button({
  variant,
  size,
  fullWidth,
  iconStart,
  iconEnd,
  loading = false,
  loadingLabel,
  type = 'button',
  className,
  onClick,
  children,
  ...props
}: ButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (loading) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      aria-disabled={loading || undefined}
      onClick={handleClick}
      {...props}
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
          />
          <span>{loadingLabel ?? children}</span>
        </>
      ) : (
        <>
          {iconStart}
          <span>{children}</span>
          {iconEnd}
        </>
      )}
    </button>
  )
}
