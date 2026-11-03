import { ButtonLink } from '@/components/atoms/ButtonLink'
import { Icon } from '@/components/atoms/Icon'

export type MobileActionBarProps = {
  cta: { label: string; href: string }
  whatsapp: { href: string; label: string; newTabHint: string }
}

/**
 * Barra inferior fija en móvil. Su altura está reservada con --floating-offset
 * (padding del contenido y scroll-padding-bottom) para no tapar el foco (2.4.11).
 */
export function MobileActionBar({ cta, whatsapp }: MobileActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border bg-surface/95 px-margin-mobile pt-2.5 pb-safe-bar shadow-lg backdrop-blur-md md:hidden">
      <ButtonLink href={cta.href} fullWidth className="flex-1">
        {cta.label}
      </ButtonLink>
      <a
        href={whatsapp.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-inverse text-text-on-inverse shadow-sm transition-surface hover:bg-accent"
      >
        <Icon name="chat" size="xl" />
        <span className="sr-only">
          {whatsapp.label} {whatsapp.newTabHint}
        </span>
      </a>
    </div>
  )
}
