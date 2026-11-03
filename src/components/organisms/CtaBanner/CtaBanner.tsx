import { useId } from 'react'
import { ButtonLink } from '@/components/atoms/ButtonLink'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { Icon } from '@/components/atoms/Icon'
import { Text } from '@/components/atoms/Text'
import { cn } from '@/lib/cn'
import { containerClasses } from '@/lib/styles/layout'

export type CtaBannerProps = {
  eyebrow: string
  title: string
  description: string
  primaryCta: { label: string; href: string }
  whatsappCta: { label: string; href: string; newTabHint: string }
}

/** Banner oscuro: data-surface="inverse" cambia el color del foco. */
export function CtaBanner({ eyebrow, title, description, primaryCta, whatsappCta }: CtaBannerProps) {
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      data-surface="inverse"
      className="relative overflow-hidden bg-surface-inverse py-14 md:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-20 size-96 rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 size-96 rounded-full bg-surface-raised/10 blur-3xl"
      />
      <div className={cn(containerClasses, 'relative z-10 flex flex-col items-center gap-6 text-center')}>
        <Eyebrow tone="onInverse">{eyebrow}</Eyebrow>
        <Heading as="h2" id={titleId} size="display" tone="onInverse" className="max-w-3xl">
          {title}
        </Heading>
        <Text size="subheading" tone="onInverseMuted" className="max-w-2xl">
          {description}
        </Text>
        <div className="flex w-full flex-col items-stretch gap-3 pt-4 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
          <ButtonLink href={primaryCta.href} variant="inverse" size="lg" iconEnd={<Icon name="calendar-today" />}>
            {primaryCta.label}
          </ButtonLink>
          <ButtonLink
            href={whatsappCta.href}
            variant="inverseSubtle"
            size="lg"
            newTabHint={whatsappCta.newTabHint}
            iconEnd={<Icon name="chat" />}
          >
            {whatsappCta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
