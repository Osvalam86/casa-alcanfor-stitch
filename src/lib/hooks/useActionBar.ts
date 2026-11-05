import { useEffect, useState } from 'react'
import { revealFocused } from '@/lib/hooks/useFocusNotObscured'

type ActionBarOptions = {
  /** id del elemento que, al salir de pantalla por arriba, muestra la barra (el CTA principal del hero) */
  showAfterId: string
  /** id de la sección con la que la barra vuelve al estado inicial mientras está a la vista (contacto) */
  hideWhileVisibleId: string
}

/**
 * Estado de la barra inferior móvil con IntersectionObserver:
 * abierta cuando el CTA del hero quedó arriba de la pantalla (bajo el header) y la sección de
 * contacto no está a la vista. Publica el estado en <html data-action-bar> para que el espacio
 * reservado a lo fijo (--floating-offset, scroll-padding-bottom) corresponda a lo visible.
 */
export function useActionBar({ showAfterId, hideWhileVisibleId }: ActionBarOptions) {
  const [ctaPassed, setCtaPassed] = useState(false)
  const [targetVisible, setTargetVisible] = useState(false)
  const open = ctaPassed && !targetVisible

  useEffect(() => {
    const cta = document.getElementById(showAfterId)
    const target = document.getElementById(hideWhileVisibleId)
    if (!cta || !target) return

    // El CTA tapado por el header sticky cuenta como fuera de pantalla
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0
    const ctaObserver = new IntersectionObserver(
      ([entry]) => setCtaPassed(!entry.isIntersecting && entry.boundingClientRect.top < headerHeight),
      { rootMargin: `-${Math.round(headerHeight)}px 0px 0px 0px` },
    )
    const targetObserver = new IntersectionObserver(([entry]) => setTargetVisible(entry.isIntersecting))
    ctaObserver.observe(cta)
    targetObserver.observe(target)
    return () => {
      ctaObserver.disconnect()
      targetObserver.disconnect()
    }
  }, [showAfterId, hideWhileVisibleId])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.actionBar = open ? 'open' : 'closed'

    // Con el foco puesto, la barra que aparece podría taparlo (2.4.11): si el elemento enfocado está
    // en la franja inferior que ahora ocupa lo fijo, se lleva a la zona libre. Fuera de esa franja no
    // se toca (p. ej. una sección enfocada hacia la que hay un scroll suave en curso).
    function keepFocusClear() {
      const active = document.activeElement
      if (!(active instanceof HTMLElement) || active === document.body) return
      const reserved = parseFloat(getComputedStyle(root).scrollPaddingBottom || '0')
      const rect = active.getBoundingClientRect()
      const inBottomStrip = rect.bottom > window.innerHeight - reserved && rect.top < window.innerHeight
      if (inBottomStrip) revealFocused(active)
    }
    keepFocusClear()

    // El cambio de estado suele ocurrir a mitad de un scroll (el que llevó el foco a su sitio con el
    // espacio anterior): se vuelve a revisar cuando ese scroll se detiene. Se detecta con 150 ms sin
    // eventos scroll (scrollend aún no es Baseline amplio); tope de 2 s.
    let idle = 0
    const onScroll = () => {
      window.clearTimeout(idle)
      idle = window.setTimeout(stop, 150)
    }
    const stop = () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(idle)
      window.clearTimeout(cap)
      keepFocusClear()
    }
    const cap = window.setTimeout(stop, 2000)
    window.addEventListener('scroll', onScroll, { passive: true })
    idle = window.setTimeout(stop, 150)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(idle)
      window.clearTimeout(cap)
      delete root.dataset.actionBar
    }
  }, [open])

  return open
}
