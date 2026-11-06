/**
 * JSON-LD del negocio a partir de content/site.ts (se inyecta en el build).
 * Sin reseñas ni calificaciones (D3): solo datos del negocio.
 */

type BusinessData = {
  type: string
  name: string
  description: string
  telephone: string
  address: {
    streetAddress?: string
    addressLocality: string
    addressRegion: string
    postalCode?: string
    addressCountry: string
  }
  openingHours: { days: readonly string[]; opens: string; closes: string }
  maximumAttendeeCapacity: number
  /** Foto del lugar, con ruta relativa al sitio */
  image?: { path: string }
}

export function buildJsonLd(business: BusinessData, options: { siteUrl?: string }) {
  const siteUrl = options.siteUrl?.replace(/\/+$/, '')

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': business.type,
    name: business.name,
    description: business.description,
    telephone: business.telephone,
    address: { '@type': 'PostalAddress', ...business.address },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: business.openingHours.days,
      opens: business.openingHours.opens,
      closes: business.openingHours.closes,
    },
    maximumAttendeeCapacity: business.maximumAttendeeCapacity,
  }

  // Lo que depende del dominio solo se incluye si hay VITE_SITE_URL
  if (siteUrl) {
    data.url = `${siteUrl}/`
    if (business.image) data.image = `${siteUrl}${business.image.path}`
  }

  return data
}
