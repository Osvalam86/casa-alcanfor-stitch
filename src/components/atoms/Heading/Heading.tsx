import type { ComponentProps, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const headingVariants = cva('font-serif text-balance', {
  variants: {
    /** El tamaño visual es independiente del nivel (as); los -mobile se resuelven aquí */
    size: {
      display: 'text-headline-lg-mobile tracking-tight md:text-headline-lg lg:text-display-hero',
      section: 'text-headline-md-mobile tracking-tight md:text-headline-lg',
      lg: 'text-headline-md-mobile md:text-headline-md',
      md: 'text-headline-sm',
      sm: 'text-headline-xs',
    },
    tone: {
      strong: 'text-text-strong',
      accent: 'text-accent',
      onInverse: 'text-text-on-inverse',
      inherit: '',
    },
  },
  defaultVariants: { size: 'section', tone: 'strong' },
})

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'

export type HeadingProps = ComponentProps<'h2'> &
  VariantProps<typeof headingVariants> & {
    /** Nivel semántico; se elige por jerarquía, no por tamaño */
    as: HeadingLevel
    children: ReactNode
  }

export function Heading({ as: Tag, size, tone, className, children, ...props }: HeadingProps) {
  return (
    <Tag className={cn(headingVariants({ size, tone }), className)} {...props}>
      {children}
    </Tag>
  )
}
