import type { ReactNode } from 'react'
import { Icon } from '@/components/atoms/Icon'
import { cn } from '@/lib/cn'
import type { IconName } from '@/lib/icons'

export type ContactInfoItemProps = {
  icon: IconName
  label: string
  /** Contenido del dato (puede incluir enlaces tel:) */
  children: ReactNode
  /** Nota secundaria (p. ej. "A sólo 12 min de Periférico Norte") */
  note?: string
  className?: string
}

/** Dato de contacto o ubicación. Debe vivir dentro de un <dl>. */
export function ContactInfoItem({ icon, label, children, note, className }: ContactInfoItemProps) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <Icon name={icon} size="xl" className="mt-1 text-accent" />
      <div>
        <dt className="font-sans text-body-md font-bold text-text-strong">{label}</dt>
        <dd className="font-sans text-body-sm text-text-muted">
          {children}
          {note ? <span className="block text-caption font-semibold text-accent">{note}</span> : null}
        </dd>
      </div>
    </div>
  )
}
