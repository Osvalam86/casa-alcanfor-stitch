import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'
import { iconHref, type IconName } from '@/lib/icons'

const iconVariants = cva('inline-block shrink-0 fill-current', {
  variants: {
    size: {
      xs: 'size-3.5',
      sm: 'size-4',
      md: 'size-4.5',
      lg: 'size-5',
      xl: 'size-6',
      '2xl': 'size-7',
      '3xl': 'size-8',
    },
  },
  defaultVariants: { size: 'md' },
})

export type IconProps = Omit<ComponentProps<'svg'>, 'children'> &
  VariantProps<typeof iconVariants> & {
    name: IconName
  }

/** Ícono decorativo: siempre oculto para tecnología asistiva. El nombre lo da el control que lo contiene. */
export function Icon({ name, size, className, ...props }: IconProps) {
  return (
    <svg aria-hidden="true" focusable="false" className={cn(iconVariants({ size }), className)} {...props}>
      <use href={iconHref(name)} />
    </svg>
  )
}
