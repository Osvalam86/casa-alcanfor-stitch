import { useId, type MouseEvent } from 'react'
import { EventCard } from '@/components/molecules/EventCard'
import { SectionHeader } from '@/components/molecules/SectionHeader'
import { cn } from '@/lib/cn'
import { containerClasses, sectionClasses } from '@/lib/styles/layout'

type EventEntry = {
  title: string
  description: string
  badge: string
  image: {
    src: string
    alt: string
    srcSet?: string
    width: number
    height: number
    square: { src: string; srcSet?: string; width: number; height: number }
  }
  linkContext: string
  href: string
}

/**
 * La lista es un @container (cards): con menos de 35rem, tarjetas compactas en una columna;
 * desde 35rem, rejilla de tarjetas verticales (2 columnas; 3 desde lg). La lista mide 100vw − 3rem
 * hasta lg, así que la rejilla empieza en 38rem de viewport.
 *
 * sizes de la foto vertical (≈1.84:1, object-cover en caja de alto fijo) = max(ancho, alto × 1.84):
 * - 38–48rem: 2 columnas ((100vw − 5rem) / 2) con h-44 → 20.25rem; la columna gana desde 45.5rem
 * - md en adelante: h-64 → 29.5rem; la columna nunca es más ancha (≤ 26.67rem con 3 columnas)
 * sizes de la miniatura 1:1 de la compacta: 96 px (6rem), 112 px (7rem) desde 25rem de lista (28rem de viewport).
 */
const CARD_IMAGE_SIZES = '(min-width: 48rem) 29.5rem, (min-width: 45.5rem) calc((100vw - 5rem) / 2), 20.25rem'
const CARD_THUMB_SIZES = '(min-width: 28rem) 7rem, 6rem'

export type EventsSectionProps = {
  id: string
  eyebrow: string
  title: string
  description: string
  linkLabel: string
  items: readonly EventEntry[]
  onLinkClick?: (index: number, event: MouseEvent<HTMLAnchorElement>) => void
}

/** Tarjetas compactas en una columna en contenedores angostos; rejilla de tarjetas verticales desde 35rem de lista. */
export function EventsSection({ id, eyebrow, title, description, linkLabel, items, onLinkClick }: EventsSectionProps) {
  const titleId = useId()

  return (
    <section id={id} aria-labelledby={titleId} className={cn(sectionClasses, 'bg-surface-sunken')}>
      <div className={cn(containerClasses, 'flex flex-col gap-10 md:gap-16')}>
        <SectionHeader eyebrow={eyebrow} title={title} description={description} titleId={titleId} />
      </div>
      <div className={cn(containerClasses, 'mt-10 md:mt-16')}>
        <div className="@container/cards">
          {/* Las 3 columnas de lg se encadenan a la variante de contenedor para ganarle a grid-cols-2 en el CSS */}
          <ul className="grid grid-cols-1 gap-4 @card-grid/cards:grid-cols-2 @card-grid/cards:gap-8 @card-grid/cards:lg:grid-cols-3">
            {items.map((item, index) => (
              <li key={item.title}>
                <EventCard
                  title={item.title}
                  description={item.description}
                  badge={item.badge}
                  image={item.image}
                  sizes={CARD_IMAGE_SIZES}
                  thumbnailSizes={CARD_THUMB_SIZES}
                  link={{ label: linkLabel, href: item.href }}
                  linkContext={item.linkContext}
                  onLinkClick={onLinkClick ? (event) => onLinkClick(index, event) : undefined}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
