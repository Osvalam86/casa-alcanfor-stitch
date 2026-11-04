import { useEffect } from 'react'

/**
 * Con un enlace compartido (p. ej. ?galeria=bodas#galeria) el navegador intenta saltar
 * al ancla antes de que React pinte la página, así que no encuentra el destino.
 * Al montar se repite el salto; y otra vez cuando cargan las fuentes, que cambian alturas.
 */
export function useInitialHashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return

    let cancelled = false
    const jump = () => {
      if (cancelled) return
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }

    const frame = requestAnimationFrame(jump)
    void document.fonts.ready.then(() => requestAnimationFrame(jump))

    // Si la persona se desplaza antes, no se le mueve la página
    const stop = () => {
      cancelled = true
    }
    window.addEventListener('wheel', stop, { once: true, passive: true })
    window.addEventListener('touchstart', stop, { once: true, passive: true })
    window.addEventListener('keydown', stop, { once: true })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
      window.removeEventListener('keydown', stop)
    }
  }, [])
}
