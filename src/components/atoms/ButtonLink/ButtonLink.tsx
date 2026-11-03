import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { buttonVariants, type ButtonVariantProps } from '@/components/atoms/Button/buttonVariants'

export type ButtonLinkProps = Omit<ComponentProps<'a'>, 'target' | 'rel'> &
  ButtonVariantProps & {
    href: string
    children: ReactNode
    iconStart?: ReactNode
    iconEnd?: ReactNode
    /** Contexto extra solo para lectores de pantalla cuando el texto visible se repite */
    srContext?: string
    /** Si se indica, abre en pestaña nueva y anuncia este texto solo a lectores de pantalla */
    newTabHint?: string
  }

/** Enlace con apariencia de botón: navega (ancla, WhatsApp, teléfono); no ejecuta acciones. */
export function ButtonLink({
  href,
  variant,
  size,
  fullWidth,
  iconStart,
  iconEnd,
  srContext,
  newTabHint,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const external = newTabHint !== undefined

  return (
    <a
      href={href}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {iconStart}
      <span>
        {children}
        {srContext ? <span className="sr-only"> {srContext}</span> : null}
        {external ? <span className="sr-only"> {newTabHint}</span> : null}
      </span>
      {iconEnd}
    </a>
  )
}
