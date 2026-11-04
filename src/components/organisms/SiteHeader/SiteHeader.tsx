import { useRef, useState, type ReactNode } from 'react'
import { ButtonLink } from '@/components/atoms/ButtonLink'
import { Icon } from '@/components/atoms/Icon'
import { IconButton } from '@/components/atoms/IconButton'
import { TextLink } from '@/components/atoms/TextLink'
import { VisuallyHidden } from '@/components/atoms/VisuallyHidden'
import { useHeaderHeight } from '@/lib/hooks/useHeaderHeight'
import { cn } from '@/lib/cn'
import { containerClasses } from '@/lib/styles/layout'

export type SiteHeaderProps = {
  brand: ReactNode
  homeHref: string
  homeLabel: string
  navLabel: string
  nav: readonly { label: string; href: string }[]
  phone: { display: string; href: string }
  cta: { label: string; href: string }
  menuOpenLabel: string
  /** El menú móvil se recibe como render-prop para cablear apertura y cierre */
  renderMenu: (state: { open: boolean; onClose: () => void }) => ReactNode
}

export function SiteHeader({
  brand,
  homeHref,
  homeLabel,
  navLabel,
  nav,
  phone,
  cta,
  menuOpenLabel,
  renderMenu,
}: SiteHeaderProps) {
  const headerRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  useHeaderHeight(headerRef)

  // Al cerrarse, el <dialog> modal devuelve el foco al botón que lo abrió (comportamiento nativo)
  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 border-b border-border bg-surface-header/95 backdrop-blur-md"
    >
      <div className={cn(containerClasses, 'flex h-16 items-center justify-between gap-6 lg:h-20')}>
        {/* Sin aria-label: el nombre parte del texto visible de la marca (2.5.3) y suma el destino oculto */}
        <a href={homeHref} className="shrink-0 rounded-sm">
          {brand}
          <VisuallyHidden>{homeLabel}</VisuallyHidden>
        </a>

        <nav aria-label={navLabel} className="hidden xl:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-xs font-sans text-label-md tracking-wide text-text-muted transition-surface hover:text-accent"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-4 lg:gap-6">
          <TextLink
            href={phone.href}
            variant="subtle"
            className="hidden text-text lg:inline-flex"
            iconStart={<Icon name="call" className="text-accent" />}
          >
            {phone.display}
          </TextLink>
          <ButtonLink href={cta.href} className="hidden sm:inline-flex">
            {cta.label}
          </ButtonLink>
          <IconButton
            label={menuOpenLabel}
            variant="soft"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="xl:hidden"
          >
            <Icon name="menu" size="xl" />
          </IconButton>
        </div>
      </div>
      {renderMenu({ open: menuOpen, onClose: closeMenu })}
    </header>
  )
}
