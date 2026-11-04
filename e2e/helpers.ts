import { expect, type Locator, type Page } from '@playwright/test'

export const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 768

/**
 * Espera a que el desplazamiento (incluido el suave) se detenga.
 * Se mide por tiempo y no por cuadros: con la CPU ocupada el scroll suave puede tardar en arrancar
 * o el hilo principal puede leer el mismo scrollY varios cuadros seguidos.
 * Termina con scrollend o tras `quietMs` sin cambios.
 */
export async function waitForScrollEnd(page: Page, quietMs = 350) {
  await page.evaluate(
    (quiet) =>
      new Promise<void>((resolve) => {
        let last = window.scrollY
        let lastChange = performance.now()
        const done = () => {
          window.removeEventListener('scrollend', done)
          clearInterval(timer)
          resolve()
        }
        const timer = setInterval(() => {
          if (Math.abs(window.scrollY - last) >= 0.5) {
            last = window.scrollY
            lastChange = performance.now()
          } else if (performance.now() - lastChange >= quiet) done()
        }, 25)
        window.addEventListener('scrollend', done)
      }),
    quietMs,
  )
}

/** Distancia entre el borde superior de un elemento y el borde inferior del header fijo. */
export async function offsetBelowHeader(target: Locator) {
  return target.evaluate((element) => {
    const header = document.querySelector('header')!
    return element.getBoundingClientRect().top - header.getBoundingClientRect().bottom
  })
}

/** Lleva el foco a un elemento con Tab real (máximo `limit` pulsaciones). */
export async function tabTo(page: Page, target: Locator, { limit = 400, reverse = false } = {}) {
  const handle = await target.elementHandle()
  for (let i = 0; i < limit; i += 1) {
    const reached = await page.evaluate((element) => document.activeElement === element, handle)
    if (reached) return
    await page.keyboard.press(reverse ? 'Shift+Tab' : 'Tab')
  }
  throw new Error('No se alcanzó el elemento con Tab')
}

export async function expectFocused(target: Locator) {
  await expect(target).toBeFocused()
}

/**
 * ¿Qué parte del elemento enfocado tapa algo fijo (header, botón de WhatsApp, barra móvil)?
 * Muestrea una rejilla de 5×5 puntos con elementFromPoint, que respeta el apilamiento real.
 * `ratio` = fracción de puntos visibles en pantalla cuya capa superior es un elemento fijo ajeno al foco.
 */
export async function obscuringReport(page: Page) {
  return page.evaluate(() => {
    const active = document.activeElement as HTMLElement | null
    if (!active || active === document.body || active.closest('dialog')) return null
    const rect = active.getBoundingClientRect()
    const fixedAncestor = (element: Element | null) => {
      for (let node = element; node && node !== document.body; node = node.parentElement) {
        if (getComputedStyle(node).position === 'fixed') return node as HTMLElement
      }
      return null
    }
    let sampled = 0
    let covered = 0
    let by = ''
    const steps = 5
    for (let ix = 0; ix < steps; ix += 1) {
      for (let iy = 0; iy < steps; iy += 1) {
        const x = rect.left + 1 + ((rect.width - 2) * ix) / (steps - 1)
        const y = rect.top + 1 + ((rect.height - 2) * iy) / (steps - 1)
        if (x < 0 || y < 0 || x >= window.innerWidth || y >= window.innerHeight) continue
        sampled += 1
        const top = document.elementFromPoint(x, y)
        if (!top || active.contains(top) || top.contains(active)) continue
        const fixed = fixedAncestor(top)
        if (fixed && !fixed.contains(active)) {
          covered += 1
          by = fixed.tagName.toLowerCase() + (fixed.className ? `.${String(fixed.className).split(' ')[0]}` : '')
        }
      }
    }
    // Espacio libre entre lo fijo de arriba (header) y lo fijo de abajo (barra / botón flotante)
    const fixedRects = Array.from(document.querySelectorAll<HTMLElement>('body *'))
      .filter((element) => getComputedStyle(element).position === 'fixed' && !element.contains(active) && element.tagName !== 'DIALOG')
      .map((element) => element.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.height > 0)
    const topEdge = Math.max(0, ...fixedRects.filter((r) => r.top <= 0).map((r) => r.bottom))
    const bottomEdge = Math.min(window.innerHeight, ...fixedRects.filter((r) => r.bottom >= window.innerHeight - 1).map((r) => r.top))
    const name = (active.getAttribute('aria-label') || active.textContent || active.id || active.tagName).trim().slice(0, 60)
    return {
      name,
      tag: active.tagName,
      ratio: sampled ? covered / sampled : 0,
      sampled,
      by,
      fits: rect.height <= bottomEdge - topEdge,
    }
  })
}
