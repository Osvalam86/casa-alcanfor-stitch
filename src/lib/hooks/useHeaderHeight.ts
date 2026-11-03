import { useEffect, type RefObject } from 'react'

/**
 * Mide la altura real del header fijo y la publica en --header-height,
 * que usan scroll-padding-top y el espaciado superior del <main>.
 */
export function useHeaderHeight(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const root = document.documentElement
    const update = () => {
      root.style.setProperty('--header-height', `${Math.round(element.getBoundingClientRect().height)}px`)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
}
