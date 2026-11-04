import type { ReactNode } from 'react'
import { Icon } from '@/components/atoms/Icon'
import { cn } from '@/lib/cn'
import type { IconName } from '@/lib/icons'

export type ContactInfoItemProps = {
  icon: IconName
  label: string
  /** Contenido del dato (puede incluir enlaces tel:) */
  children: ReactNode
  /** Nota secundaria (p. ej. "A solo 12 min de Periférico Norte") */
  note?: string
  className?: string
}

/**
 * Dato de contacto o ubicación. Debe vivir dentro de un <dl>.
 * El <div> agrupa solo <dt> y <dd>; el ícono decorativo va dentro del <dt>, a la izquierda.
 */
export function ContactInfoItem({ icon, label, children, note, className }: ContactInfoItemProps) {
  return (
    <div className={cn('relative ps-9', className)}>
      <dt className="font-sans text-body-md font-bold text-text-strong">
        <Icon name={icon} size="xl" className="absolute start-0 top-1 text-accent" />
        {label}
      </dt>
      <dd className="font-sans text-body-sm text-text-muted">
        {children}
        {note ? <span className="block text-caption font-semibold text-accent">{note}</span> : null}
      </dd>
    </div>
  )
}
