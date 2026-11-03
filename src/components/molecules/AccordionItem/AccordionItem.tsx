import { useId, type ReactNode } from 'react'
import { Icon } from '@/components/atoms/Icon'
import { cn } from '@/lib/cn'

export type AccordionItemProps = {
  question: string
  children: ReactNode
  open: boolean
  onToggle: () => void
  headingLevel?: 'h3' | 'h4'
  className?: string
}

/**
 * Ítem de acordeón (patrón APG): encabezado > botón con aria-expanded y aria-controls.
 * El panel no lleva role="region" (con 8 paneles, APG lo desaconseja).
 * El estado lo controla el organismo (comportamiento exclusivo del diseño).
 */
export function AccordionItem({ question, children, open, onToggle, headingLevel: Tag = 'h3', className }: AccordionItemProps) {
  const baseId = useId()
  const panelId = `${baseId}-panel`

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-border-subtle bg-surface-sunken', className)}>
      <Tag className="font-serif text-headline-xs text-text-strong md:text-headline-sm">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 rounded-2xl p-4 text-start transition-surface duration-200 hover:text-accent md:p-6"
        >
          <span>{question}</span>
          <Icon
            name="expand-more"
            size="xl"
            className={cn('text-accent motion-safe:transition-transform motion-safe:duration-300', open && 'rotate-180')}
          />
        </button>
      </Tag>
      <div
        id={panelId}
        hidden={!open}
        className="mx-4 border-t border-surface-stronger pt-4 pb-4 font-sans text-body-md text-text-muted md:mx-6 md:pb-6"
      >
        {children}
      </div>
    </div>
  )
}
