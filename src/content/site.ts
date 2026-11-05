/**
 * Datos del negocio y textos de interfaz compartidos.
 * DEMO: Casa Alcanfor es un negocio ficticio (decisión D2). Los datos salen del
 * bloque de contacto de la pantalla desktop de Stitch y se usan en todo el sitio.
 */

export const brand = {
  name: 'Casa Alcanfor',
  tagline: 'Jardín & Salón',
  // Monograma tipográfico: no hay logo en SVG (D8)
  monogram: 'CA',
} as const

// DEMO: estructura del bloque "Ven a conocernos" (desktop) con datos ficticios:
// teléfono de relleno y domicilio solo a nivel municipio, para no apuntar a nadie real
export const contact = {
  address: 'Zapopan, Jalisco',
  addressNote: '(A solo 12 min de Periférico Norte y Valle Real)',
  phoneDisplay: '33 0000 0000',
  phoneHref: 'tel:+523300000000',
  whatsappDisplay: '+52 33 0000 0000',
  whatsappHref: 'https://wa.me/523300000000',
  whatsappLabel: 'WhatsApp',
  mapsHref: 'https://maps.google.com/?q=Zapopan,+Jalisco',
  visitHours: 'lunes a sábado: 10:00 a 19:00 h',
  visitHoursNote: '(Previa cita para atención personalizada con café de la casa)',
} as const

/**
 * Datos estructurados para el JSON-LD (se genera en el build, sección 8).
 * DEMO: mismos datos del bloque de contacto. Sin reseñas ni calificaciones (D3).
 */
export const business = {
  type: 'EventVenue',
  name: 'Casa Alcanfor',
  description:
    'Hacienda contemporánea de hospitalidad artesanal y jardines centenarios en el corazón de Zapopan, Jalisco.',
  telephone: '+52 33 0000 0000',
  // Sin calle ni código postal: el negocio es ficticio
  address: {
    addressLocality: 'Zapopan',
    addressRegion: 'Jalisco',
    addressCountry: 'MX',
  },
  // Horario de visitas guiadas
  openingHours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '10:00', closes: '19:00' },
  maximumAttendeeCapacity: 450,
} as const

/** Metadatos de la página (sección 8). */
export const seo = {
  title: 'Casa Alcanfor · Jardín & salón de eventos en Zapopan',
  description:
    'Bodas, XV años, bautizos y eventos corporativos que se viven sin preocupaciones. Espacios de ensueño, un coordinador contigo de principio a fin y precio cerrado desde el primer día.',
  locale: 'es_MX',
  themeColor: '#2f3e36',
  ogImage: {
    path: '/og-image.jpg',
    width: 1200,
    height: 630,
    alt: 'Casa Alcanfor, jardín y salón de eventos en Zapopan: banquete nocturno bajo arcos de cantera.',
  },
} as const

/** Textos de interfaz que no son contenido editorial (accesibilidad y estados). */
export const ui = {
  skipLink: 'Saltar al contenido principal',
  newTabHint: '(se abre en una pestaña nueva)',
  requiredText: 'Requerido',
  optionalText: 'Opcional', // NUEVO: indicador de campo opcional, mismo estilo que "Requerido"
  // Del estado loading del sistema de diseño de Stitch
  loading: 'Procesando…',
} as const
