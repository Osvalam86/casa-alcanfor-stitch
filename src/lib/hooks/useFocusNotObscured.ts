import { useEffect } from 'react'

/**
 * WCAG 2.4.11: el foco no queda tapado por lo fijo (header, botón de WhatsApp, barra móvil).
 *
 * El navegador solo desplaza al enfocar si el elemento está fuera de la pantalla; si ya asoma
 * por debajo del header no lo mueve y lo deja tapado. scrollIntoView({ block: 'nearest' }) sí
 * respeta scroll-padding-top/bottom (alturas de lo fijo) y no hace nada si ya está libre.
 *
 * Solo actúa con foco de teclado (:focus-visible), fuera de lo fijo y de los <dialog>,
 * y si el elemento cabe en el espacio libre (los destinos grandes, como <main>, se ignoran).
 */
export function useFocusNotObscured() {
  useEffect(() => {
    function isInsideFixed(element: Element) {
      for (let node: Element | null = element; node && node !== document.body; node = node.parentElement) {
        if (getComputedStyle(node).position === 'fixed') return true
      }
      return false
    }

    function handleFocusIn(event: FocusEvent) {
      const target = event.target
      if (!(target instanceof HTMLElement) || !target.matches(':focus-visible')) return
      if (target.closest('dialog') || isInsideFixed(target)) return

      const root = getComputedStyle(document.documentElement)
      const free = window.innerHeight - parseFloat(root.scrollPaddingTop || '0') - parseFloat(root.scrollPaddingBottom || '0')
      if (target.getBoundingClientRect().height > free) return

      target.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }

    document.addEventListener('focusin', handleFocusIn)
    return () => document.removeEventListener('focusin', handleFocusIn)
  }, [])
}
