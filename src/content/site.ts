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

// DEMO: dirección, teléfono y horario del bloque "Ven a conocernos" (desktop)
export const contact = {
  address: 'Zapopan, Jalisco',
  addressNote: '(A sólo 12 min de Periférico Norte y Valle Real)',
  phoneDisplay: '33 0000 0000',
  phoneHref: 'tel:+523300000000',
  whatsappDisplay: '+52 33 0000 0000',
  whatsappHref: 'https://wa.me/523300000000',
  visitHours: 'Lunes a Sábado: 10:00 a 19:00 hrs',
  visitHoursNote: '(Previa cita para atención personalizada con café de la casa)',
} as const

/** Textos de interfaz que no son contenido editorial (accesibilidad y estados). */
export const ui = {
  skipLink: 'Saltar al contenido principal',
  newTabHint: '(se abre en una pestaña nueva)',
  requiredText: 'Requerido',
  // Del estado loading del sistema de diseño de Stitch
  loading: 'Procesando...',
} as const
