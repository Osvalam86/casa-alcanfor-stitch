import type { ComponentProps, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const iconButtonVariants = cva(
  'inline-flex shrink-0 items-center justify-center rounded-full transition-surface duration-200 disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        ghost: 'text-text-strong hover:bg-surface-strong active:bg-surface-stronger',
        soft: 'bg-surface-muted text-text-strong hover:bg-surface-strong active:bg-surface-stronger',
        filled: 'bg-action text-on-action shadow-lg hover:bg-accent hover:text-on-accent active:bg-action-hover',
      },
      size: {
        md: 'size-control-md',
        lg: 'size-fab',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'md' },
  },
)

export type IconButtonProps = Omit<ComponentProps<'button'>, 'aria-label' | 'children'> &
  VariantProps<typeof iconButtonVariants> & {
    /** Nombre accesible obligatorio: el botón solo muestra un ícono */
    label: string
    /** El ícono (decorativo) */
    children: ReactNode
  }

export function IconButton({ label, variant, size, type = 'button', className, children, ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  )
}
