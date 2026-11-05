import { useId, type ReactNode } from 'react'
import { Badge } from '@/components/atoms/Badge'
import { ButtonLink } from '@/components/atoms/ButtonLink'
import { Icon } from '@/components/atoms/Icon'
import { Image } from '@/components/atoms/Image'
import { Text } from '@/components/atoms/Text'
import { cn } from '@/lib/cn'
import type { IconName } from '@/lib/icons'
import { containerClasses } from '@/lib/styles/layout'

export type HeroProps = {
  id: string
  badge: string
  title: { before: string; emphasis: string }
  description: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  highlights: readonly { icon: IconName; label: string }[]
  image: { src: string; alt: string; width: number; height: number }
  imageCard: { eyebrow: string; title: string }
  /** Calculador de disponibilidad (organismo compuesto en el template) */
  checker?: ReactNode
  /** Barra de confianza (organismo compuesto en el template) */
  trustBar?: ReactNode
}

export function Hero({
  id,
  badge,
  title,
  description,
  primaryCta,
  secondaryCta,
  highlights,
  image,
  imageCard,
  checker,
  trustBar,
}: HeroProps) {
  const titleId = useId()

  // scroll-mt-notice: el ancla de inicio sube también la franja de aviso (vuelve al tope)
  return (
    <section id={id} aria-labelledby={titleId} className="relative scroll-mt-notice overflow-hidden bg-surface pt-6 pb-16 lg:pb-32">
      {/* Brillos ambientales decorativos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 -mt-20 -mr-40 size-glow-lg rounded-full bg-accent-soft/20 blur-glow-lg"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-0 -ml-40 size-glow-md rounded-full bg-sage-soft/25 blur-glow-md"
      />

      <div className={cn(containerClasses, 'relative z-10 mt-6')}>
        <Badge variant="outline" dot className="mb-6 whitespace-normal">
          {badge}
        </Badge>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <h1
              id={titleId}
              className="font-serif text-headline-lg-mobile tracking-tight text-balance text-text-strong md:text-headline-lg lg:text-display-hero"
            >
              {title.before}
              <span className="text-accent italic">{title.emphasis}</span>
            </h1>
            <Text size="subheading" tone="muted" className="max-w-xl">
              {description}
            </Text>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <ButtonLink href={primaryCta.href} size="lg" iconEnd={<Icon name="calendar-month" />}>
                {primaryCta.label}
              </ButtonLink>
              <ButtonLink href={secondaryCta.href} variant="outline" size="lg" iconEnd={<Icon name="arrow-forward" />}>
                {secondaryCta.label}
              </ButtonLink>
            </div>
            <ul className="flex flex-wrap items-center gap-6 pt-4 font-sans text-label-md text-text-muted">
              {highlights.map((highlight) => (
                <li key={highlight.label} className="flex items-center gap-2">
                  <Icon name={highlight.icon} size="lg" className="text-accent" />
                  {highlight.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative mx-auto aspect-4/5 max-w-hero-media overflow-hidden rounded-t-full rounded-b-2xl border-4 border-surface-raised/60 bg-surface-muted shadow-2xl">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="eager"
                fetchPriority="high"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-surface-inverse-strong/70 via-transparent to-transparent"
              />
              <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-surface/90 p-4 shadow-lg backdrop-blur-md sm:right-6 sm:bottom-6 sm:left-12">
                <div>
                  <p className="font-sans text-label-caps uppercase text-accent">{imageCard.eyebrow}</p>
                  <p className="font-serif text-headline-xs text-text-strong sm:text-headline-sm">{imageCard.title}</p>
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-action text-on-action">
                  <Icon name="yard" size="lg" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {checker ? <div className="relative z-10 mt-10 lg:mt-6">{checker}</div> : null}
        {trustBar ? <div className="mt-10 lg:mt-14">{trustBar}</div> : null}
      </div>
    </section>
  )
}
