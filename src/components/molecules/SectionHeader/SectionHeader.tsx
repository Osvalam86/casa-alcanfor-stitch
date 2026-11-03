import type { ComponentProps } from 'react'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { Text } from '@/components/atoms/Text'
import { cn } from '@/lib/cn'

export type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description?: string
  /** id del título, para aria-labelledby de la <section> */
  titleId?: string
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4'
  size?: ComponentProps<typeof Heading>['size']
  align?: 'center' | 'start'
  tone?: 'default' | 'inverse'
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  titleId,
  headingLevel = 'h2',
  size = 'section',
  align = 'center',
  tone = 'default',
  className,
}: SectionHeaderProps) {
  const inverse = tone === 'inverse'

  return (
    <div
      className={cn(
        'flex max-w-2xl flex-col gap-3',
        align === 'center' ? 'mx-auto items-center text-center' : 'items-start text-start',
        className,
      )}
    >
      {eyebrow ? <Eyebrow tone={inverse ? 'onInverse' : 'accent'}>{eyebrow}</Eyebrow> : null}
      <Heading as={headingLevel} id={titleId} size={size} tone={inverse ? 'onInverse' : 'strong'}>
        {title}
      </Heading>
      {description ? (
        <Text size="md" tone={inverse ? 'onInverseMuted' : 'muted'}>
          {description}
        </Text>
      ) : null}
    </div>
  )
}
