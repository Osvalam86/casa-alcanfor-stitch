import { useState } from 'react'
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
 * Cada foto viene a la proporción de su celda (pnpm images), así que se dibuja al ancho de la caja:
 * - cuadradas 1:1 (cuadradas y anchas): exacto en todos los anchos
 * - verticales 3:4: exacto en su celda 3:4 desde md; en la cuadrada de móvil, object-cover la
 *   recorta por el alto (centro) y el ancho sigue siendo el de la caja
 */
const COLUMN_SIZES =
  '(min-width: 90rem) 19.875rem, (min-width: 64rem) calc((100vw - 10.5rem) / 4), (min-width: 48rem) calc((100vw - 6rem) / 3), calc((100vw - 3.75rem) / 2)'
const PHOTO_SIZES = {
  portrait: COLUMN_SIZES,
  square: COLUMN_SIZES,
  wide: '(min-width: 90rem) 41.25rem, (min-width: 64rem) calc((100vw - 10.5rem) / 2 + 1.5rem), (min-width: 48rem) calc((100vw - 6rem) * 2 / 3 + 1.5rem), calc((100vw - 3.75rem) / 2)',
} as const

export type GallerySectionProps = {
  id: string
  /** id fijo del título (h2): destino del foco al llegar desde «Ver detalles y fotos» */
  titleId: string
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
  titleId,
  eyebrow,
  title,
  filtersLabel,
  resultsAnnouncement,
  filters,
  photos,
  activeFilter,
  onFilterChange,
}: GallerySectionProps) {
  // El anuncio solo se llena tras una acción del usuario (la región existe desde el inicio)
  const [announcement, setAnnouncement] = useState('')
  const isVisible = (photo: Photo) => activeFilter === 'todos' || photo.category === activeFilter

  function handleFilter(filterId: string) {
    onFilterChange(filterId)
    const count = photos.filter((photo) => filterId === 'todos' || photo.category === filterId).length
    setAnnouncement(resultsAnnouncement.replace('{count}', String(count)))
  }

  return (
    <section id={id} aria-labelledby={titleId} className={cn(sectionClasses, 'bg-surface')}>
      <div className={cn(containerClasses, 'flex flex-col gap-8 md:gap-12')}>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-3">
            <Eyebrow>{eyebrow}</Eyebrow>
            {/* Enfocable por script (tabIndex -1): el foco llega al encabezado, no al contenedor */}
            <Heading as="h2" id={titleId} tabIndex={-1} className="rounded-xs">

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
