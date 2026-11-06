import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { containerClasses, sectionClasses } from '@/lib/styles/layout'

export type ContactSectionProps = {
  id: string
  /** id del título del formulario: nombra la sección */
  titleId: string
  form: ReactNode
  location: ReactNode
}

/**
 * Distribución de contacto: formulario + ubicación, recibidos por slots.
 * Sin tabIndex: al llegar por ancla (#contacto) el foco no cae en el contenedor; el navegador mueve
 * el punto de partida de Tab a la sección y el siguiente Tab entra al formulario.
 */
export function ContactSection({ id, titleId, form, location }: ContactSectionProps) {
  return (
    <section id={id} aria-labelledby={titleId} className={cn(sectionClasses, 'bg-surface-strong')}>
      <div className={cn(containerClasses, 'grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12')}>
        <div className="lg:col-span-7">{form}</div>
        <div className="lg:col-span-5">{location}</div>
      </div>
    </section>
  )
}
