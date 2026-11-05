import type { IconName } from '@/lib/icons'

/** Foto con variantes (de src/assets/images/generated/manifest.ts, pnpm images) */
export type ResponsiveImage = {
  src: string
  /** Variantes AVIF por ancho; el `sizes` lo decide el organismo según su rejilla */
  srcSet: string
  width: number
  height: number
}

export type ImageContent = ResponsiveImage & {
  /** Descriptivo en imágenes de contenido; "" en decorativas */
  alt: string
}

export type LinkContent = {
  label: string
  href: string
}

/** Texto con un fragmento en negritas (p. ej. "Renta por <strong>8 horas</strong>") */
export type RichText = string | { before: string; strong: string; after?: string }

export type GalleryFilterId = 'todos' | 'bodas' | 'jardin' | 'detalles' | 'xv'
export type SpaceId = 'salon' | 'jardin' | 'terraza'

export type NavItem = { label: string; href: string }

export type EventItem = {
  title: string
  description: string
  badge: string
  image: ImageContent
  /** Filtro de galería al que lleva "Ver detalles y fotos" */
  galleryFilter: GalleryFilterId
  /** Contexto oculto del enlace (no promete fotos del evento si no hay filtro) */
  linkContext: string
}

export type IconFeatureItem = { icon: IconName; title: string; description: string }

export type SpaceItem = {
  id: SpaceId
  tab: { label: string; icon: IconName }
  imageBadge: string
  image: ImageContent
  chips: { capacity: string; area: string }
  title: string
  description: string
  specs: { icon: IconName; label: string; value: string }[]
  cta: LinkContent
}

export type PricingPlan = {
  eyebrow: string
  title: string
  description: string
  price: { prefix: string; amount: string; unit: string }
  features: RichText[]
  cta: LinkContent
  featured?: boolean
}

export type ProcessStepItem = {
  number: string
  icon: IconName
  title: string
  description: string
  tag: string
}

export type GalleryPhoto = {
  category: Exclude<GalleryFilterId, 'todos'>
  caption: string
  image: ImageContent
  aspect: 'portrait' | 'square'
  wide?: boolean
}

export type Testimonial = { quote: string; author: string; meta: string; rating: number }

export type FaqItem = { question: string; answer: string }

export type SelectOption = { value: string; label: string }
