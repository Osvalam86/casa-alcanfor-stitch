/**
 * Espacio de no separación (U+00A0).
 * - En el copy: une una palabra corta con la siguiente para que no quede sola al final de línea.
 * - Como separador en el borde de un texto oculto (sr-only): el texto oculto va en posición absoluta,
 *   así que un espacio normal al inicio o al final se colapsa y el árbol de accesibilidad lo pierde
 *   (NVDA en modo exploración junta las palabras: «Ver detalles y fotosde bodas»). El NBSP no se colapsa.
 */
export const NBSP = String.fromCharCode(160)
