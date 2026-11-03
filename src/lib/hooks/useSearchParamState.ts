import { useCallback, useSyncExternalStore } from 'react'

const URL_CHANGE_EVENT = 'app:urlchange'

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback)
  window.addEventListener(URL_CHANGE_EVENT, callback)
  return () => {
    window.removeEventListener('popstate', callback)
    window.removeEventListener(URL_CHANGE_EVENT, callback)
  }
}

/** Cambia la URL sin recargar y avisa a los suscriptores. */
export function updateUrl(url: URL, mode: 'replace' | 'push' = 'replace') {
  if (mode === 'push') window.history.pushState(null, '', url)
  else window.history.replaceState(null, '', url)
  window.dispatchEvent(new Event(URL_CHANGE_EVENT))
}

/**
 * Estado compartible en la URL (?clave=valor) con replaceState.
 * Valores fuera de la lista permitida caen al valor por defecto.
 */
export function useSearchParamState<T extends string>(key: string, allowed: readonly T[], fallback: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(key),
    () => null,
  )
  const value = raw !== null && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback

  const setValue = useCallback(
    (next: T) => {
      const url = new URL(window.location.href)
      if (next === fallback) url.searchParams.delete(key)
      else url.searchParams.set(key, next)
      updateUrl(url)
    },
    [key, fallback],
  )

  return [value, setValue] as const
}
