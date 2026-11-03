import type { ComponentProps, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const textLinkVariants = cva(
  'group/link inline-flex min-h-6 items-center gap-1 rounded-xs font-sans transition-colors duration-200',
  {
    variants: {
      variant: {
        /** Acción de texto dorada con flecha (DESIGN.md "Text Action") */
        arrow: 'text-label-md font-semibold text-accent hover:text-text-strong',
        inline: 'text-accent underline decoration-1 underline-offset-4 hover:text-text-strong',
        subtle: 'text-label-md text-text-muted hover:text-accent',
        onInverse: 'text-label-md text-text-on-inverse-muted hover:text-accent-on-inverse',
        caps: 'text-label-caps font-bold uppercase text-accent hover:underline hover:underline-offset-4',
      },
    },
    defaultVariants: { variant: 'arrow' },
  },
)

export type TextLinkProps = Omit<ComponentProps<'a'>, 'target' | 'rel'> &
  VariantProps<typeof textLinkVariants> & {
    href: string
    children: ReactNode
    iconStart?: ReactNode
    iconEnd?: ReactNode
    /** Contexto extra solo para lectores de pantalla (p. ej. "de Bodas de Ensueño") */
    srContext?: string
    /** Si se indica, abre en pestaña nueva y lo anuncia a lectores de pantalla */
    newTabHint?: string
  }

export function TextLink({
  href,
  variant,
  iconStart,
  iconEnd,
  srContext,
  newTabHint,
  className,
  children,
  ...props
}: TextLinkProps) {
  const external = newTabHint !== undefined

  return (
    <a
      href={href}
      className={cn(textLinkVariants({ variant }), className)}
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
      {iconEnd ? (
        <span className="inline-flex motion-safe:transition-transform motion-safe:group-hover/link:translate-x-1">
          {iconEnd}
        </span>
      ) : null}
    </a>
  )
}
