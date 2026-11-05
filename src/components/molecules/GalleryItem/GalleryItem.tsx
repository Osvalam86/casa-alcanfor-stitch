import { Image } from '@/components/atoms/Image'
import { cn } from '@/lib/cn'

export type GalleryItemProps = {
  image: { src: string; alt: string; srcSet?: string; width?: number; height?: number }
  /** Ancho que ocupa la foto según la rejilla del organismo que la contiene */
  sizes: string
  caption: string
  /** Proporción del mosaico desktop */
  aspect?: 'portrait' | 'square'
  className?: string
}

/**
 * Foto con pie. El pie siempre existe en el DOM: visible en móvil (sin hover)
 * y al pasar el mouse en desktop, como en el diseño.
 */
export function GalleryItem({ image, sizes, caption, aspect = 'portrait', className }: GalleryItemProps) {
  return (
    <figure
      className={cn(
        'group relative aspect-square overflow-hidden rounded-2xl bg-surface-muted shadow-sm',
        aspect === 'portrait' && 'md:aspect-3/4',
        className,
      )}
    >
      <Image
        src={image.src}
        srcSet={image.srcSet}
        sizes={sizes}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
      />
      <figcaption
        className={cn(
          'absolute inset-x-0 bottom-0 bg-surface-inverse-strong/75 px-3 py-2 font-sans text-label-md text-text-on-inverse',
          'md:inset-0 md:flex md:items-end md:font-serif md:bg-transparent md:bg-linear-to-t md:from-surface-inverse-strong/80 md:via-surface-inverse-strong/20 md:to-transparent md:p-6 md:text-headline-sm md:opacity-0 md:transition-opacity md:group-hover:opacity-100',
        )}
      >
        {caption}
      </figcaption>
    </figure>
  )
}
