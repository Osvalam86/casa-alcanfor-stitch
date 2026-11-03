import { cn } from '@/lib/cn'

export type BrandLockupProps = {
  name: string
  tagline?: string
  /** Iniciales del monograma (decorativo; el nombre ya está en texto) */
  monogram: string
  tone?: 'default' | 'inverse'
  className?: string
}

/** Marca: monograma tipográfico (no hay logo en SVG, D8) + nombre + descriptor. */
export function BrandLockup({ name, tagline, monogram, tone = 'default', className }: BrandLockupProps) {
  const inverse = tone === 'inverse'

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-t-full rounded-b-sm border font-serif text-headline-xs italic',
          inverse ? 'border-accent-on-inverse text-accent-on-inverse' : 'border-accent text-accent',
        )}
      >
        {monogram}
      </span>
      <span className="flex flex-col">
        <span
          className={cn('font-serif text-headline-sm leading-none tracking-wide', inverse ? 'text-text-on-inverse' : 'text-text-strong')}
        >
          {name}
        </span>
        {tagline ? (
          <span className={cn('mt-1 font-sans text-label-caps uppercase', inverse ? 'text-accent-on-inverse' : 'text-accent')}>
            {tagline}
          </span>
        ) : null}
      </span>
    </span>
  )
}
