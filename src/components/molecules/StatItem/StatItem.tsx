import { cva, type VariantProps } from 'class-variance-authority'
import { Icon } from '@/components/atoms/Icon'
import { cn } from '@/lib/cn'
import type { IconName } from '@/lib/icons'

const statIconVariants = cva('flex size-12 shrink-0 items-center justify-center rounded-xl', {
  variants: {
    tone: {
      sage: 'bg-action text-on-action',
      gold: 'bg-accent-soft text-on-accent-soft',
      neutral: 'bg-surface-stronger text-accent',
    },
  },
  defaultVariants: { tone: 'sage' },
})

export type StatItemProps = VariantProps<typeof statIconVariants> & {
  icon: IconName
  value: string
  /** Lo que mide la cifra; es el término (<dt>) */
  label: string
  /** Texto alternativo de la cifra para lectores (p. ej. "4.9 de 5 estrellas") */
  valueLabel?: string
  className?: string
}

/**
 * Par término/valor de la barra de confianza. Debe vivir dentro de un <dl>.
 * El <div> agrupa solo <dt> y <dd> (contenido permitido en <dl>); el ícono decorativo
 * va dentro del <dt>, posicionado a la izquierda. El DOM va término → valor;
 * visualmente la cifra va arriba (flex-col-reverse).
 */
export function StatItem({ icon, value, label, valueLabel, tone, className }: StatItemProps) {
  return (
    <div className={cn('relative flex min-h-12 flex-col-reverse justify-center ps-16', className)}>
      <dt className="font-sans text-body-sm text-text-muted">
        <span className={cn(statIconVariants({ tone }), 'absolute start-0 top-1/2 -translate-y-1/2')}>
          <Icon name={icon} size="xl" />
        </span>
        {label}
      </dt>
      <dd className="font-serif text-headline-md-mobile leading-tight text-text-strong md:text-headline-md">
        {valueLabel ? (
          <>
            <span aria-hidden="true">{value}</span>
            <span className="sr-only">{valueLabel}</span>
          </>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}
