import { useRef } from 'react'
import { useMeasuredHeight } from '@/lib/hooks/useMeasuredHeight'
import { cn } from '@/lib/cn'
import { containerClasses } from '@/lib/styles/layout'

export type ConceptBannerProps = {
  /** Nombre del landmark complementario */
  label: string
  text: string
}

/**
 * Franja estática arriba del header: avisa que el sitio es un proyecto conceptual.
 * Va en un <aside> con nombre para que no quede contenido fuera de landmarks;
 * no es fija, así que se va con el scroll y no tapa el foco (2.4.11).
 * Publica su altura en --notice-height: el hero la usa para que "inicio" lleve al tope.
 */
export function ConceptBanner({ label, text }: ConceptBannerProps) {
  const ref = useRef<HTMLElement>(null)
  useMeasuredHeight(ref, '--notice-height')

  return (
    <aside ref={ref} aria-label={label} data-surface="inverse" className="bg-surface-inverse text-text-on-inverse">
      <p className={cn(containerClasses, 'py-2 text-center font-sans text-caption tracking-wide')}>{text}</p>
    </aside>
  )
}
