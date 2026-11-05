import { useEffect, type RefObject } from 'react'

/**
 * Mide la altura real de un elemento y la publica en una custom property de :root.
 * - --header-height (header sticky): la usa scroll-padding-top para dejar las anclas justo debajo.
 * - --notice-height (franja de aviso): la usa el hero para que "inicio" vuelva al tope de la página.
 */
export function useMeasuredHeight(ref: RefObject<HTMLElement | null>, property: `--${string}`) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const root = document.documentElement
    const update = () => {
      root.style.setProperty(property, `${Math.round(element.getBoundingClientRect().height)}px`)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => {
      observer.disconnect()
      root.style.removeProperty(property)
    }
  }, [ref, property])
}
