import { useCallback, useSyncExternalStore } from 'react'

/** true cuando la media query coincide (se actualiza al cambiar el viewport). */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', callback)
      return () => media.removeEventListener('change', callback)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Breakpoint md de Tailwind (48rem). */
export const MEDIA_MD = '(min-width: 48rem)'
