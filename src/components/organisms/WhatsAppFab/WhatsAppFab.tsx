import { Icon } from '@/components/atoms/Icon'
import { NBSP } from '@/lib/text'

export type WhatsAppFabProps = {
  href: string
  label: string
  bubble: string
  newTabHint: string
}

/** Botón flotante de WhatsApp (desde md). La burbuja es decorativa: repite el nombre del enlace. */
export function WhatsAppFab({ href, label, bubble, newTabHint }: WhatsAppFabProps) {
  return (
    <div className="group fixed right-8 bottom-8 z-40 hidden items-center gap-3 md:flex">
      <span
        aria-hidden="true"
        className="pointer-events-none rounded-full border border-border-subtle bg-surface-raised px-4 py-2 font-sans text-label-md text-text shadow-md motion-safe:transition-transform motion-safe:group-hover:scale-105"
      >
        {bubble}
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex size-fab items-center justify-center rounded-full border-2 border-border-inverse/50 bg-action text-on-action shadow-md transition-surface hover:bg-accent hover:text-on-accent"
      >
        <Icon name="chat" size="3xl" />
        <span className="sr-only">{`${label}${NBSP}${newTabHint}`}</span>
      </a>
    </div>
  )
}
