import type { ReactNode } from 'react'
import { Badge } from '@/components/atoms/Badge'
import { ButtonLink } from '@/components/atoms/ButtonLink'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { Heading } from '@/components/atoms/Heading'
import { Icon } from '@/components/atoms/Icon'
import { Text } from '@/components/atoms/Text'
import { cn } from '@/lib/cn'

export type PricingCardProps = {
  eyebrow: string
  title: string
  description: string
  price: { prefix: string; amount: string; unit: string }
  /** Cada incluido puede traer partes en negritas */
  features: ReactNode[]
  cta: { label: string; href: string }
  /** Paquete destacado: superficie oscura, borde dorado y sello */
  featured?: boolean
  featuredLabel?: string
  headingLevel?: 'h3' | 'h4'
  className?: string
}

export function PricingCard({
  eyebrow,
  title,
  description,
  price,
  features,
  cta,
  featured = false,
  featuredLabel,
  headingLevel = 'h3',
  className,
}: PricingCardProps) {
  return (
    <article
      data-surface={featured ? 'inverse' : undefined}
      className={cn(
        'relative flex flex-col justify-between gap-8 rounded-3xl p-8 lg:p-10',
        featured
          ? 'z-10 border-2 border-accent bg-surface-inverse text-text-on-inverse shadow-xl lg:scale-105'
          : 'border border-border-subtle bg-surface-sunken shadow-sm',
        className,
      )}
    >
      {featured && featuredLabel ? (
        <Badge variant="goldSolid" className="absolute -top-4 left-1/2 -translate-x-1/2 tracking-widest">
          {featuredLabel}
        </Badge>
      ) : null}
      <div className={cn('flex flex-col gap-6', featured && 'pt-2')}>
        <div className="flex flex-col gap-1">
          <Eyebrow tone={featured ? 'onInverse' : 'accent'}>{eyebrow}</Eyebrow>
          <Heading as={headingLevel} size="lg" tone={featured ? 'onInverse' : 'strong'}>
            {title}
          </Heading>
          <Text size="sm" tone={featured ? 'onInverseMuted' : 'muted'} className="mt-1">
            {description}
          </Text>
        </div>
        <p className="flex flex-wrap items-baseline gap-2">
          <span className={cn('font-sans text-label-caps uppercase', featured ? 'text-text-on-inverse-muted' : 'text-text-muted')}>
            {price.prefix}
          </span>
          <span
            className={cn(
              'font-serif text-headline-lg-mobile md:text-headline-lg',
              featured ? 'text-text-on-inverse' : 'text-text-strong',
            )}
          >
            {price.amount}
          </span>
          <span className={cn('font-sans text-body-sm', featured ? 'text-text-on-inverse-muted' : 'text-text-muted')}>
            {price.unit}
          </span>
        </p>
        <ul
          className={cn(
            'flex flex-col gap-3 border-t pt-4',
            featured ? 'border-text-on-inverse/20' : 'border-surface-stronger',
          )}
        >
          {features.map((feature, index) => (
            <li
              // Los incluidos son estáticos y no se reordenan
              key={index}
              className={cn('flex items-start gap-3 font-sans text-body-sm', featured ? 'text-text-on-inverse' : 'text-text')}
            >
              <Icon
                name={featured ? 'verified' : 'check'}
                size="md"
                className={cn('mt-0.5', featured ? 'text-accent-on-inverse' : 'text-accent')}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <ButtonLink href={cta.href} variant={featured ? 'accent' : 'outline'} size="lg" fullWidth srContext={title}>
        {cta.label}
      </ButtonLink>
    </article>
  )
}
