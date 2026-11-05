import { expect, type Locator, type Page } from '@playwright/test'

export const isMobile = (page: Page) => (page.viewportSize()?.width ?? 0) < 768

/**
 * Espera a que el desplazamiento (incluido el suave) termine antes de medir.
 *
 * Con varios workers la CPU va cargada: el scroll suave puede tardar en arrancar o detenerse
 * unos cientos de ms a mitad de camino. Si solo se esperaba silencio, la espera terminaba antes
 * de tiempo (la causa de la intermitencia). Ahora hay dos fases:
 * 1. Arranque: hasta `startTimeoutMs` para ver el primer movimiento. Si no hay ninguno,
 *    no hacía falta desplazar y termina.
 * 2. Final: una vez que se movió, la señal es scrollend (el navegador lo dispara al terminar
 *    el scroll suave). El silencio de `quietMs` queda solo como respaldo, largo a propósito.
 *    Luego espera dos cuadros para que el layout quede asentado.
 * Un scrollend de un desplazamiento anterior se ignora porque llega antes del primer movimiento.
 * Devuelve si hubo desplazamiento.
 */
export async function waitForScrollEnd(page: Page, { startTimeoutMs = 1500, quietMs = 1000 } = {}) {
  return page.evaluate(
    ({ startTimeout, quiet }) =>
      new Promise<boolean>((resolve) => {
        const start = performance.now()
        let last = window.scrollY
        let lastChange = start
        let moved = false
        const finish = () => {
          window.removeEventListener('scrollend', onScrollEnd)
          clearInterval(timer)
          requestAnimationFrame(() => requestAnimationFrame(() => resolve(moved)))
        }
        const onScrollEnd = () => {
          if (moved) finish()
        }
        const timer = setInterval(() => {
          const now = performance.now()
          if (Math.abs(window.scrollY - last) >= 0.5) {
            last = window.scrollY
            lastChange = now
            moved = true
          } else if (moved ? now - lastChange >= quiet : now - start >= startTimeout) {
            finish()
          }
        }, 25)
        window.addEventListener('scrollend', onScrollEnd)
      }),
    { startTimeout: startTimeoutMs, quiet: quietMs },
  )
}

/**
 * Página lista para medir posiciones: fuentes cargadas (el cambio de fuente reacomoda el texto
 * y mueve las secciones) y sin desplazamiento pendiente.
 */
export async function waitForStableLayout(page: Page) {
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
  await waitForScrollEnd(page, { startTimeoutMs: 100 })
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
    // El header es sticky: tapa igual que lo fijo cuando está pegado arriba
    const isPinned = (element: Element) => ['fixed', 'sticky'].includes(getComputedStyle(element).position)
    const fixedAncestor = (element: Element | null) => {
      for (let node = element; node && node !== document.body; node = node.parentElement) {
        if (isPinned(node)) return node as HTMLElement
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
    const pinned = Array.from(document.querySelectorAll<HTMLElement>('body *')).filter(
      (element) => isPinned(element) && !element.contains(active) && element.tagName !== 'DIALOG',
    )
    const fixedRects = pinned.map((element) => element.getBoundingClientRect()).filter((r) => r.width > 0 && r.height > 0)
    // Lo sticky siempre acota arriba (aunque la franja de aviso aún lo empuje hacia abajo)
    const stickyBottoms = pinned
      .filter((element) => getComputedStyle(element).position === 'sticky')
      .map((element) => element.getBoundingClientRect().bottom)
    const topEdge = Math.max(0, ...fixedRects.filter((r) => r.top <= 0).map((r) => r.bottom), ...stickyBottoms)
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
