import { useId, type MouseEvent } from 'react'
import { EventCard } from '@/components/molecules/EventCard'
import { SectionHeader } from '@/components/molecules/SectionHeader'
import { cn } from '@/lib/cn'
import { MEDIA_MD, useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { containerClasses, sectionClasses } from '@/lib/styles/layout'

type EventEntry = {
  title: string
  description: string
  badge: string
  image: { src: string; alt: string; srcSet?: string; width: number; height: number }
  linkContext: string
  href: string
}

/**
 * Ancho con que se dibuja cada foto. La caja de la tarjeta tiene alto fijo y la foto (≈1.84:1)
 * la cubre con object-cover, así que se dibuja a max(ancho de la caja, alto × 1.84):
 * - móvil: tarjeta de 17.5rem y h-44 (11rem) → gana el alto: 11 × 1.84 = 20.25rem
 * - md en adelante: h-64 (16rem) → 29.5rem; la caja nunca es más ancha
 *   (md: (100vw − 5rem) / 2 < 29.5rem hasta lg; lg: (100vw − 10rem) / 3 ≤ 26.67rem con el tope de 90rem)
 */
const CARD_IMAGE_SIZES = '(min-width: 48rem) 29.5rem, 20.25rem'

export type EventsSectionProps = {
  id: string
  eyebrow: string
  title: string
  description: string
  carouselLabel: string
  linkLabel: string
  items: readonly EventEntry[]
  onLinkClick?: (index: number, event: MouseEvent<HTMLAnchorElement>) => void
}

/** Grid desde md; abajo de md, carrusel horizontal con scroll-snap (sin puntos, D14). */
export function EventsSection({
  id,
  eyebrow,
  title,
  description,
  carouselLabel,
  linkLabel,
  items,
  onLinkClick,
}: EventsSectionProps) {
  const titleId = useId()
  const isDesktop = useMediaQuery(MEDIA_MD)

  return (
    <section id={id} aria-labelledby={titleId} className={cn(sectionClasses, 'bg-surface-sunken')}>
      <div className={cn(containerClasses, 'flex flex-col gap-10 md:gap-16')}>
        <SectionHeader eyebrow={eyebrow} title={title} description={description} titleId={titleId} />
      </div>
      {/* En móvil la lista se desplaza: es una región con nombre y enfocable para el teclado */}
      <div
        role={isDesktop ? undefined : 'region'}
        aria-label={isDesktop ? undefined : carouselLabel}
        tabIndex={isDesktop ? undefined : 0}
        className={cn(
          containerClasses,
          'relative mt-10 snap-x snap-mandatory overflow-x-auto pb-3 md:mt-16 md:snap-none md:overflow-visible md:pb-0',
        )}
      >
        <ul className="flex gap-4 md:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {items.map((item, index) => (
            <li key={item.title} className="w-carousel-card shrink-0 snap-center md:w-auto">
              <EventCard
                title={item.title}
                description={item.description}
                badge={item.badge}
                image={item.image}
                sizes={CARD_IMAGE_SIZES}
                link={{ label: linkLabel, href: item.href }}
                linkContext={item.linkContext}
                onLinkClick={onLinkClick ? (event) => onLinkClick(index, event) : undefined}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
