import type { MouseEvent } from 'react'
import { Badge } from '@/components/atoms/Badge'
import { Heading } from '@/components/atoms/Heading'
import { Icon } from '@/components/atoms/Icon'
import { Image } from '@/components/atoms/Image'
import { Text } from '@/components/atoms/Text'
import { TextLink } from '@/components/atoms/TextLink'
import { cn } from '@/lib/cn'

type CardImage = { src: string; srcSet?: string; width?: number; height?: number }

export type EventCardProps = {
  title: string
  description: string
  badge: string
  /** Foto completa (tarjeta vertical) y, opcional, su recorte 1:1 para la miniatura de la compacta */
  image: CardImage & { alt: string; square?: CardImage }
  /** Ancho que ocupa la foto vertical según la rejilla del organismo que la contiene */
  sizes: string
  /** Ancho de la miniatura de la tarjeta compacta */
  thumbnailSizes?: string
  link: { label: string; href: string }
  /** Contexto oculto del enlace; por defecto, el título */
  linkContext?: string
  onLinkClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  headingLevel?: 'h3' | 'h4'
  className?: string
}

/**
 * Tarjeta de tipo de evento. Se adapta al @container "cards" de la lista que la contiene:
 * - menos de 35rem (@card-grid): compacta horizontal, miniatura 1:1 de 96 px (112 px desde 25rem)
 *   a la izquierda y, a la derecha, etiqueta como texto pequeño, título, descripción completa y enlace
 * - desde 35rem: la tarjeta vertical (foto arriba con la etiqueta como badge)
 * Solo una de las dos fotos se muestra (la otra va con display: none y, al ser lazy, no se descarga).
 * El texto del enlace se repite entre tarjetas: lleva contexto oculto.
 */
export function EventCard({
  title,
  description,
  badge,
  image,
  sizes,
  thumbnailSizes = '7rem',
  link,
  linkContext,
  onLinkClick,
  headingLevel = 'h3',
  className,
}: EventCardProps) {
  const thumbnail = image.square ?? image

  return (
    <article
      className={cn(
        'group flex h-full gap-3 overflow-hidden rounded-2xl bg-surface p-3 shadow-sm transition-shadow duration-300 hover:shadow-xl',
        '@card-grid/cards:flex-col @card-grid/cards:gap-0 @card-grid/cards:p-0',
        className,
      )}
    >
      {/* Miniatura (compacta) */}
      <div className="relative aspect-square size-24 shrink-0 overflow-hidden rounded-xl @card-thumb/cards:size-28 @card-grid/cards:hidden">
        <Image
          src={thumbnail.src}
          srcSet={thumbnail.srcSet}
          sizes={thumbnailSizes}
          alt={image.alt}
          width={thumbnail.width}
          height={thumbnail.height}
        />
      </div>

      {/* Foto con badge (vertical) */}
      <div className="relative hidden h-44 overflow-hidden md:h-64 @card-grid/cards:block">
        <Image
          src={image.src}
          srcSet={image.srcSet}
          sizes={sizes}
          alt={image.alt}
          width={image.width}
          height={image.height}
          className="motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
        />
        <Badge variant="sage" className="absolute top-4 right-4">
          {badge}
        </Badge>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 @card-grid/cards:gap-4 @card-grid/cards:p-4 @card-grid/cards:md:p-8">
        <div className="flex flex-col gap-1 @card-grid/cards:gap-2">
          <p className="font-sans text-label-caps tracking-caps-compact text-accent uppercase @card-grid/cards:hidden">{badge}</p>
          <Heading as={headingLevel} size="md" className="text-headline-xs text-balance @card-grid/cards:text-headline-sm">
            {title}
          </Heading>
          <Text size="sm" tone="muted">
            {description}
          </Text>
        </div>
        <TextLink
          href={link.href}
          srContext={linkContext ?? title}
          onClick={onLinkClick}
          iconEnd={<Icon name="arrow-forward" size="sm" />}
        >
          {link.label}
        </TextLink>
      </div>
    </article>
  )
}
