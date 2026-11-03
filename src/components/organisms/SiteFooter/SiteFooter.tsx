import type { ReactNode } from 'react'
import { Icon } from '@/components/atoms/Icon'
import { TextLink } from '@/components/atoms/TextLink'
import { cn } from '@/lib/cn'
import type { IconName } from '@/lib/icons'
import { containerClasses } from '@/lib/styles/layout'

type MaybeLink = { label: string; href: string | null }

export type SiteFooterProps = {
  brand: ReactNode
  description: string
  headings: { location: string; hours: string; social: string }
  address: string
  phone: { display: string; href: string }
  hours: string
  hoursNote: string
  /** D7: los enlaces sin URL no se renderizan */
  social: readonly (MaybeLink & { icon: IconName })[]
  legal: readonly MaybeLink[]
  copyright: string
}

const headingClasses = 'font-sans text-label-caps uppercase text-accent-on-inverse'

export function SiteFooter({
  brand,
  description,
  headings,
  address,
  phone,
  hours,
  hoursNote,
  social,
  legal,
  copyright,
}: SiteFooterProps) {
  const socialLinks = social.filter((item): item is typeof item & { href: string } => item.href !== null)
  const legalLinks = legal.filter((item): item is MaybeLink & { href: string } => item.href !== null)

  return (
    <footer data-surface="inverse" className="bg-surface-inverse pt-space-xl pb-space-lg text-text-on-inverse-muted md:pt-space-2xl">
      <div className={containerClasses}>
        <div
          className={cn(
            'grid grid-cols-1 gap-10 border-b border-text-on-inverse/20 pb-space-xl md:grid-cols-2 lg:gap-12',
            socialLinks.length > 0 ? 'lg:grid-cols-12' : 'lg:grid-cols-10',
          )}
        >
          <div className="flex flex-col gap-4 lg:col-span-4">
            {brand}
            <p className="max-w-sm font-sans text-body-md">{description}</p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-3">
            <h2 className={headingClasses}>{headings.location}</h2>
            <p className="font-sans text-body-sm">{address}</p>
            <TextLink href={phone.href} variant="onInverse" iconStart={<Icon name="call" size="sm" />}>
              {phone.display}
            </TextLink>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-3">
            <h2 className={headingClasses}>{headings.hours}</h2>
            <p className="font-sans text-body-sm">
              {hours}
              <span className="block">{hoursNote}</span>
            </p>
          </div>
          {socialLinks.length > 0 ? (
            <div className="flex flex-col gap-3 lg:col-span-2">
              <h2 className={headingClasses}>{headings.social}</h2>
              <ul className="flex flex-col gap-2">
                {socialLinks.map((item) => (
                  <li key={item.label}>
                    <TextLink href={item.href} variant="onInverse" iconStart={<Icon name={item.icon} size="sm" />}>
                      {item.label}
                    </TextLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center font-sans text-body-sm md:flex-row md:text-start">
          <p>{copyright}</p>
          {legalLinks.length > 0 ? (
            <ul className="flex items-center gap-6">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <TextLink href={item.href} variant="onInverse">
                    {item.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
