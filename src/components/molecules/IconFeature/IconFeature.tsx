import { cva, type VariantProps } from 'class-variance-authority'
import { Heading } from '@/components/atoms/Heading'
import { Icon } from '@/components/atoms/Icon'
import { Text } from '@/components/atoms/Text'
import { cn } from '@/lib/cn'
import type { IconName } from '@/lib/icons'

const iconBoxVariants = cva('flex shrink-0 items-center justify-center', {
  variants: {
    tone: {
      sage: 'bg-action text-on-action',
      gold: 'bg-accent-soft text-on-accent-soft',
      neutral: 'bg-surface-stronger text-accent',
      sageSoft: 'bg-sage-soft text-on-sage-soft',
    },
    layout: {
      stacked: 'size-14 rounded-2xl',
      inline: 'size-10 rounded-full',
    },
  },
  defaultVariants: { tone: 'sage', layout: 'stacked' },
})

export type IconFeatureProps = VariantProps<typeof iconBoxVariants> & {
  icon: IconName
  title: string
  description: string
  headingLevel?: 'h3' | 'h4'
  className?: string
}

/** Ícono + título + descripción (bento de "Nuestra Promesa" y su versión móvil en fila). */
export function IconFeature({
  icon,
  title,
  description,
  tone,
  layout = 'stacked',
  headingLevel = 'h3',
  className,
}: IconFeatureProps) {
  const inline = layout === 'inline'

  return (
    <div
      className={cn(
        'rounded-2xl bg-surface-sunken transition-colors duration-300 hover:bg-surface-muted',
        inline ? 'flex items-start gap-3.5 p-4' : 'flex flex-col gap-4 p-8',
        className,
      )}
    >
      <span className={iconBoxVariants({ tone, layout })}>
        <Icon name={icon} size={inline ? 'lg' : 'xl'} />
      </span>
      <div className={cn('flex flex-col', inline ? 'gap-0.5' : 'gap-4')}>
        <Heading as={headingLevel} size={inline ? 'sm' : 'md'}>
          {title}
        </Heading>
        <Text size="sm" tone="muted">
          {description}
        </Text>
      </div>
    </div>
  )
}
