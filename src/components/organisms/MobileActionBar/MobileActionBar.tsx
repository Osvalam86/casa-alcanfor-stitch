import { ButtonLink } from '@/components/atoms/ButtonLink'
import { Icon } from '@/components/atoms/Icon'
import { cn } from '@/lib/cn'

export type MobileActionBarProps = {
  /** Barra visible (fondo + CTA). Cerrada: solo el botón flotante de WhatsApp. */
  open: boolean
  cta: { label: string; href: string }
  whatsapp: { href: string; label: string; newTabHint: string }
}

/**
 * Barra inferior fija en móvil (oculta desde md).
 * - Cerrada: sin fondo ni borde; solo WhatsApp a la derecha. El área transparente deja pasar
 *   toques y clics al contenido (pointer-events-none).
 * - Abierta: aparecen juntos el fondo y el CTA (opacity + transform; instantáneo con reduced motion).
 * WhatsApp ocupa siempre la misma caja: el CTA conserva su espacio aunque esté oculto, así que el
 * botón no se mueve entre estados. Oculto, el CTA es inert (fuera del orden de foco y del árbol accesible).
 * El espacio reservado a lo fijo (--floating-offset) sigue al estado vía <html data-action-bar>.
 */
export function MobileActionBar({ open, cta, whatsapp }: MobileActionBarProps) {
  return (
    <div
      data-state={open ? 'open' : 'closed'}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 data-[state=open]:pointer-events-auto md:hidden"
    >
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 border-t border-border bg-surface/95 shadow-lg backdrop-blur-md motion-safe:transition-opacity motion-safe:duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />
      <div className="relative flex items-center gap-3 px-margin-mobile pt-2.5 pb-safe-bar">
        <div
          inert={!open}
          className={cn(
            'flex-1 motion-safe:transition-[opacity,transform] motion-safe:duration-300',
            open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
          )}
        >
          <ButtonLink href={cta.href} fullWidth iconEnd={<Icon name="calendar-month" />}>
            {cta.label}
          </ButtonLink>
        </div>
        <a
          href={whatsapp.href}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-inverse text-text-on-inverse shadow-sm transition-surface hover:bg-accent"
        >
          <Icon name="chat" size="xl" />
          <span className="sr-only">
            {whatsapp.label} {whatsapp.newTabHint}
          </span>
        </a>
      </div>
    </div>
  )
}
