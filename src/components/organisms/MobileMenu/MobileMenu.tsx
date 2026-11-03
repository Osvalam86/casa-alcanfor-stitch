import { useEffect, useId, useRef } from 'react'
import { ButtonLink } from '@/components/atoms/ButtonLink'
import { Icon } from '@/components/atoms/Icon'
import { IconButton } from '@/components/atoms/IconButton'

export type MobileMenuProps = {
  open: boolean
  onClose: () => void
  title: string
  closeLabel: string
  navLabel: string
  items: readonly { label: string; href: string }[]
  cta: { label: string; href: string }
}

/**
 * Menú en <dialog> modal: showModal() atrapa el foco, Escape lo cierra (evento cancel)
 * y al cerrar el foco vuelve al botón que lo abrió (lo gestiona SiteHeader).
 */
export function MobileMenu({ open, onClose, title, closeLabel, navLabel, items, cta }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-sm bg-surface p-0 text-text shadow-2xl backdrop:bg-surface-inverse-strong/50"
    >
      <div className="flex h-full flex-col gap-6 p-margin-mobile">
        <div className="flex items-center justify-between">
          <p id={titleId} className="font-sans text-label-caps uppercase text-accent">
            {title}
          </p>
          <IconButton label={closeLabel} onClick={onClose}>
            <Icon name="close" size="xl" />
          </IconButton>
        </div>
        <nav aria-label={navLabel}>
          <ul className="flex flex-col divide-y divide-border">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className="flex min-h-control-md items-center justify-between py-3 font-serif text-headline-sm text-text-strong transition-surface hover:text-accent"
                >
                  {item.label}
                  <Icon name="arrow-forward" size="md" className="text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ButtonLink href={cta.href} size="lg" fullWidth onClick={onClose} iconEnd={<Icon name="calendar-month" />}>
          {cta.label}
        </ButtonLink>
      </div>
    </dialog>
  )
}
