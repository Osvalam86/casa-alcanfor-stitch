import { useRef, type KeyboardEvent } from 'react'

/**
 * Teclado del patrón APG de pestañas con activación automática:
 * flechas izquierda/derecha (circulares), Home y End. Solo la pestaña activa es tabulable.
 */
export function useRovingTabs(count: number, selectedIndex: number, onSelect: (index: number) => void) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function select(index: number) {
    onSelect(index)
    tabRefs.current[index]?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const keyMap: Record<string, number> = {
      ArrowRight: (selectedIndex + 1) % count,
      ArrowLeft: (selectedIndex - 1 + count) % count,
      Home: 0,
      End: count - 1,
    }
    const next = keyMap[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(next)
  }

  function registerTab(index: number) {
    return (element: HTMLButtonElement | null) => {
      tabRefs.current[index] = element
    }
  }

  return { onKeyDown, registerTab }
}
