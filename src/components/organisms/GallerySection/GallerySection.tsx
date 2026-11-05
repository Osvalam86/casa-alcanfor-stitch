import { useId, useState } from 'react'
import { Heading } from '@/components/atoms/Heading'
import { Eyebrow } from '@/components/atoms/Eyebrow'
import { FilterChip } from '@/components/molecules/FilterChip'
import { GalleryItem } from '@/components/molecules/GalleryItem'
import { cn } from '@/lib/cn'
import { containerClasses, sectionClasses } from '@/lib/styles/layout'

type Photo = {
  category: string
  caption: string
  aspect: 'portrait' | 'square'
  wide?: boolean
  image: { src: string; alt: string; srcSet?: string; width: number; height: number }
}

/*
 * Ancho con que se dibuja cada foto. Ancho de columna (contenedor: 100vw − 3rem; desde lg, min(100vw, 90rem) − 6rem):
 * - móvil: 2 columnas con gap-3 → (100vw − 3.75rem) / 2
 * - md: 3 columnas con gap-6 → (100vw − 6rem) / 3
 * - lg: 4 columnas con gap-6 → (100vw − 10.5rem) / 4; tope en 90rem → 19.875rem
 * - anchas (md:col-span-2): dos columnas y un gap
 * Las fotos (≈1.84:1) cubren cajas más altas con object-cover y se dibujan a alto × 1.84:
 * - cuadrada (todas en móvil): columna × 1.84
 * - vertical 3:4 (md en adelante): columna × 4/3 × 1.84 = columna × 2.4533
 */
const PHOTO_SIZES = {
  portrait:
    '(min-width: 90rem) 48.8rem, (min-width: 64rem) calc((100vw - 10.5rem) * 0.6134), (min-width: 48rem) calc((100vw - 6rem) * 0.8178), calc((100vw - 3.75rem) * 0.92)',
  square:
    '(min-width: 90rem) 36.6rem, (min-width: 64rem) calc((100vw - 10.5rem) * 0.46), (min-width: 48rem) calc((100vw - 6rem) * 0.6134), calc((100vw - 3.75rem) * 0.92)',
  wide: '(min-width: 90rem) 75.9rem, (min-width: 64rem) calc((100vw - 10.5rem) * 0.92 + 2.76rem), (min-width: 48rem) calc((100vw - 6rem) * 1.2267 + 2.76rem), calc((100vw - 3.75rem) * 0.92)',
} as const

export type GallerySectionProps = {
  id: string
  eyebrow: string
  title: string
  filtersLabel: string
  /** Plantilla con {count} */
  resultsAnnouncement: string
  filters: readonly { id: string; label: string }[]
  photos: readonly Photo[]
  /** "todos" muestra todo; el filtro activo vive en la URL */
  activeFilter: string
  onFilterChange: (id: string) => void
}

export function GallerySection({
  id,
  eyebrow,
  title,
  filtersLabel,
  resultsAnnouncement,
  filters,
  photos,
  activeFilter,
  onFilterChange,
}: GallerySectionProps) {
  const titleId = useId()
  // El anuncio solo se llena tras una acción del usuario (la región existe desde el inicio)
  const [announcement, setAnnouncement] = useState('')
  const isVisible = (photo: Photo) => activeFilter === 'todos' || photo.category === activeFilter

  function handleFilter(filterId: string) {
    onFilterChange(filterId)
    const count = photos.filter((photo) => filterId === 'todos' || photo.category === filterId).length
    setAnnouncement(resultsAnnouncement.replace('{count}', String(count)))
  }

  return (
    <section id={id} aria-labelledby={titleId} tabIndex={-1} className={cn(sectionClasses, 'bg-surface')}>
      <div className={cn(containerClasses, 'flex flex-col gap-8 md:gap-12')}>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-3">
            <Eyebrow>{eyebrow}</Eyebrow>
            <Heading as="h2" id={titleId}>
              {title}
            </Heading>
          </div>
          <div role="group" aria-label={filtersLabel} className="-mx-margin-mobile flex gap-2 overflow-x-auto px-margin-mobile pb-1 md:mx-0 md:flex-wrap md:px-0">
            {filters.map((filter) => (
              <FilterChip key={filter.id} pressed={activeFilter === filter.id} onClick={() => handleFilter(filter.id)}>
                {filter.label}
              </FilterChip>
            ))}
          </div>
        </div>

        <p role="status" className="sr-only">
          {announcement}
        </p>

        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {photos.map((photo) => (
            <li key={photo.caption} hidden={!isVisible(photo)} className={cn(photo.wide && 'md:col-span-2')}>
              <GalleryItem
                image={photo.image}
                sizes={photo.wide ? PHOTO_SIZES.wide : PHOTO_SIZES[photo.aspect]}
                caption={photo.caption}
                aspect={photo.aspect}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
