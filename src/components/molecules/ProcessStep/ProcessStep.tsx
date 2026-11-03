import { Heading } from '@/components/atoms/Heading'
import { Icon } from '@/components/atoms/Icon'
import { Text } from '@/components/atoms/Text'
import { cn } from '@/lib/cn'
import type { IconName } from '@/lib/icons'

export type ProcessStepProps = {
  /** Número visible ("01"); el orden lo comunica el <ol> que lo contiene */
  number: string
  icon: IconName
  title: string
  description: string
  tag: string
  /** Último paso: ícono en sage sólido */
  highlight?: boolean
  headingLevel?: 'h3' | 'h4'
  className?: string
}

/** Paso del proceso de reserva. Se usa dentro de un <li> de un <ol>. */
export function ProcessStep({
  number,
  icon,
  title,
  description,
  tag,
  highlight = false,
  headingLevel = 'h3',
  className,
}: ProcessStepProps) {
  return (
    <article
      className={cn(
        'flex h-full flex-col justify-between rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm transition-shadow duration-300 hover:shadow-md md:p-8',
        className,
      )}
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span aria-hidden="true" className="font-serif text-headline-md leading-none text-accent md:text-headline-lg">
            {number}
          </span>
          <span
            className={cn(
              'flex size-10 items-center justify-center rounded-full',
              highlight ? 'bg-action text-on-action' : 'border border-accent/20 bg-accent-soft/20 text-accent',
            )}
          >
            <Icon name={icon} size="md" />
          </span>
        </div>
        <Heading as={headingLevel} size="md" className="mb-2">
          {title}
        </Heading>
        <Text size="sm" tone="muted">
          {description}
        </Text>
      </div>
      <p className="mt-6 flex items-center gap-2 border-t border-surface-stronger pt-4 font-sans text-label-caps uppercase text-accent">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
        {tag}
      </p>
    </article>
  )
}
