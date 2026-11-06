import { ButtonLink } from '@/components/atoms/ButtonLink'
import { Heading } from '@/components/atoms/Heading'
import { Icon } from '@/components/atoms/Icon'
import { SkipLink } from '@/components/atoms/SkipLink'
import { Text } from '@/components/atoms/Text'
import { VisuallyHidden } from '@/components/atoms/VisuallyHidden'
import { BrandLockup } from '@/components/molecules/BrandLockup'
import { ConceptBanner } from '@/components/organisms/ConceptBanner'
import { notFound } from '@/content/notFound'
import { brand, conceptNotice, ui } from '@/content/site'
import { cn } from '@/lib/cn'
import { containerClasses, sectionClasses } from '@/lib/styles/layout'

/**
 * Página 404 (dist/404.html). Netlify la sirve con estado 404 en cualquier ruta inexistente,
 * así que todas sus URL son absolutas (/ y /#contacto). Lleva noindex (lo inyecta el plugin de SEO).
 * Landmarks: aviso (aside), header con la marca, main con un único h1.
 */
export function NotFoundPage() {
  return (
    <>
      <SkipLink targetId="main">{ui.skipLink}</SkipLink>
      <ConceptBanner label={conceptNotice.label} text={conceptNotice.text} />
      <header className="border-b border-border bg-surface-header">
        <div className={cn(containerClasses, 'flex h-16 items-center lg:h-20')}>
          {/* Sin aria-label: el nombre parte del texto visible de la marca (2.5.3) y suma el destino oculto */}
          <a href={notFound.primaryLink.href} className="shrink-0 rounded-sm">
            <BrandLockup name={brand.name} tagline={brand.tagline} monogram={brand.monogram} />
            <VisuallyHidden>{notFound.homeLabel}</VisuallyHidden>
          </a>
        </div>
      </header>
      <main id="main" tabIndex={-1} className={cn(sectionClasses, 'bg-surface')}>
        <div className={cn(containerClasses, 'flex flex-col items-start gap-6')}>
          <Heading as="h1" size="display">
            {notFound.title}
          </Heading>
          <Text size="subheading" tone="muted" className="max-w-xl">
            {notFound.description}
          </Text>
          <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <ButtonLink href={notFound.primaryLink.href} size="lg" iconEnd={<Icon name="arrow-forward" />}>
              {notFound.primaryLink.label}
            </ButtonLink>
            <ButtonLink href={notFound.secondaryLink.href} variant="outline" size="lg" iconEnd={<Icon name="calendar-month" />}>
              {notFound.secondaryLink.label}
            </ButtonLink>
          </div>
        </div>
      </main>
    </>
  )
}
