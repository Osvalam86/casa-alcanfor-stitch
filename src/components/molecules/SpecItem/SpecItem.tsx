import { Icon } from '@/components/atoms/Icon'
import { cn } from '@/lib/cn'
import type { IconName } from '@/lib/icons'

export type SpecItemProps = {
  icon: IconName
  label: string
  value: string
  className?: string
}

/** Ficha técnica de un espacio (Capacidad → Hasta 450 pax). Debe vivir dentro de un <dl>. */
export function SpecItem({ icon, label, value, className }: SpecItemProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Icon name={icon} size="xl" className="text-accent" />
      <dt className="font-sans text-label-caps uppercase text-accent">{label}</dt>
      <dd className="font-sans text-body-sm font-semibold text-text-strong">{value}</dd>
    </div>
  )
}
