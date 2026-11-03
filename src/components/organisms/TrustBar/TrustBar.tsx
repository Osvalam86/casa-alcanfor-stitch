import { StatItem, type StatItemProps } from '@/components/molecules/StatItem'

export type TrustBarProps = {
  stats: readonly Pick<StatItemProps, 'icon' | 'tone' | 'value' | 'label' | 'valueLabel'>[]
}

/** Cifras de confianza: lista de pares término/valor. */
export function TrustBar({ stats }: TrustBarProps) {
  return (
    <dl className="grid grid-cols-1 gap-6 rounded-2xl bg-surface-sunken p-6 md:grid-cols-3 md:gap-8 lg:p-8">
      {stats.map((stat) => (
        <StatItem key={stat.label} {...stat} />
      ))}
    </dl>
  )
}
