import type { ComponentProps, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const textVariants = cva('font-sans', {
  variants: {
    size: {
      subheading: 'text-subheading',
      lg: 'text-body-lg',
      md: 'text-body-md',
      sm: 'text-body-sm',
      caption: 'text-caption',
      label: 'text-label-md',
    },
    tone: {
      default: 'text-text',
      muted: 'text-text-muted',
      strong: 'text-text-strong',
      accent: 'text-accent',
      onInverse: 'text-text-on-inverse',
      onInverseMuted: 'text-text-on-inverse-muted',
      error: 'text-error',
      inherit: '',
    },
  },
  defaultVariants: { size: 'md', tone: 'default' },
})

export type TextProps = ComponentProps<'p'> &
  VariantProps<typeof textVariants> & {
    as?: 'p' | 'span' | 'div' | 'strong'
    children: ReactNode
  }

export function Text({ as: Tag = 'p', size, tone, className, children, ...props }: TextProps) {
  return (
    <Tag className={cn(textVariants({ size, tone }), className)} {...props}>
      {children}
    </Tag>
  )
}
