import { Heading } from '@/components/atoms/Heading'
import { TextLink } from '@/components/atoms/TextLink'
import { brand } from '@/content/site'
import { landingPlaceholder } from '@/content/landing'

/** Contenedor de la landing. Fase 2: marcador temporal; las secciones llegan en la Fase 3. */
export function LandingPage() {
  return (
    <main id="main" className="mx-auto flex min-h-dvh max-w-page flex-col items-start justify-center gap-6 px-margin-mobile lg:px-12">
      <Heading as="h1" size="display">
        {brand.name}
      </Heading>
      <p className="font-sans text-body-lg text-text-muted">{landingPlaceholder.status}</p>
      <TextLink href="/design-system">{landingPlaceholder.designSystemLink}</TextLink>
    </main>
  )
}
