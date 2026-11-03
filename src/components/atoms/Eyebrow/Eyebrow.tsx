import type { ComponentProps, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const eyebrowVariants = cva('font-sans text-label-caps uppercase', {
  variants: {
    tone: {
      accent: 'text-accent',
      onInverse: 'text-accent-on-inverse',
      muted: 'text-text-muted',
    },
  },
  defaultVariants: { tone: 'accent' },
})

export type EyebrowProps = ComponentProps<'p'> &
  VariantProps<typeof eyebrowVariants> & {
    as?: 'p' | 'span'
    children: ReactNode
  }

/** Antetítulo en versalitas con tracking amplio (label-caps). */
export function Eyebrow({ as: Tag = 'p', tone, className, children, ...props }: EyebrowProps) {
  return (
    <Tag className={cn(eyebrowVariants({ tone }), className)} {...props}>
      {children}
    </Tag>
  )
}
