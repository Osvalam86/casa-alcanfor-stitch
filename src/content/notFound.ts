/**
 * Copy de la página 404 (dist/404.html, la sirve Netlify en cualquier ruta inexistente).
 * NUEVO: no está en el diseño de Stitch; aprobado para el bloque 4.
 */
export const notFound = {
  meta: {
    title: 'Página no encontrada · Casa Alcanfor',
  },
  // Complemento oculto del nombre del enlace de la marca (mismo patrón que en la landing, 2.5.3)
  homeLabel: ', ir al inicio',
  title: 'No encontramos esta página',
  description: 'Puede que el enlace esté incompleto o que la página ya no exista.',
  primaryLink: { label: 'Volver al inicio', href: '/' },
  secondaryLink: { label: 'Agenda tu visita', href: '/#contacto' },
} as const
