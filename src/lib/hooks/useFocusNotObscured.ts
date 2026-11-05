import { useEffect } from 'react'

// El header es sticky: cuenta como fijo (desplazar la página no lo mueve mientras está pegado)
function isInsideFixed(element: Element) {
  for (let node: Element | null = element; node && node !== document.body; node = node.parentElement) {
    const { position } = getComputedStyle(node)
    if (position === 'fixed' || position === 'sticky') return true
  }
  return false
}

/**
 * Lleva el elemento enfocado con teclado a la zona libre entre lo fijo de arriba y de abajo
 * (scroll-padding-top/bottom). scrollIntoView({ block: 'nearest' }) no hace nada si ya está libre.
 * Solo con foco de teclado (:focus-visible), fuera de lo fijo y de los <dialog>, y si el elemento
 * cabe en el espacio libre (los destinos grandes, como <main>, se ignoran).
 */
export function revealFocused(target: Element | null = document.activeElement) {
  if (!(target instanceof HTMLElement) || !target.matches(':focus-visible')) return
  if (target.closest('dialog') || isInsideFixed(target)) return

  const root = getComputedStyle(document.documentElement)
  const top = parseFloat(root.scrollPaddingTop || '0')
  const bottom = window.innerHeight - parseFloat(root.scrollPaddingBottom || '0')
  const rect = target.getBoundingClientRect()
  if (rect.height > bottom - top) return
  // Ya libre: no se llama a scrollIntoView, que aun sin mover nada cancela un scroll suave en curso
  if (rect.top >= top && rect.bottom <= bottom) return

  target.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}

/**
 * WCAG 2.4.11: el foco no queda tapado por lo fijo (header, botón de WhatsApp, barra móvil).
 *
 * El navegador solo desplaza al enfocar si el elemento está fuera de la pantalla; si ya asoma
 * por debajo del header no lo mueve y lo deja tapado. Por eso cada foco pasa por revealFocused.
 * Si lo fijo cambia de tamaño con el foco puesto (la barra móvil al aparecer), quien lo cambia
 * vuelve a llamar a revealFocused (ver useActionBar).
 */
export function useFocusNotObscured() {
  useEffect(() => {
    function handleFocusIn(event: FocusEvent) {
      revealFocused(event.target as Element)
    }

    document.addEventListener('focusin', handleFocusIn)
    return () => document.removeEventListener('focusin', handleFocusIn)
  }, [])
}
