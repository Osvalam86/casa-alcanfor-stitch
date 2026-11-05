import { expect, test, type Page } from '@playwright/test'
import { obscuringReport, waitForScrollEnd, waitForStableLayout } from './helpers.ts'

/**
 * Barra inferior móvil (< 768 px):
 * - inicial: sin fondo; solo WhatsApp a la derecha; «Consulta disponibilidad» oculto e inert
 * - al pasar el CTA del hero: fondo + CTA; con contacto a la vista, vuelve al estado inicial
 * - WhatsApp no se mueve entre estados y el espacio reservado (scroll-padding-bottom) sigue a lo visible
 * Desde md no hay barra: botón flotante con burbuja, que no tapa el foco.
 */

const bar = (page: Page) => page.locator('[data-state]').filter({ has: page.getByRole('link', { name: /Contacto por WhatsApp/ }) })
const barCta = (page: Page) => bar(page).getByRole('link', { name: 'Consulta disponibilidad', includeHidden: true })
const whatsapp = (page: Page) => bar(page).getByRole('link', { name: /Contacto por WhatsApp/ })

async function scrollToY(page: Page, y: number) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
  await waitForScrollEnd(page, { startTimeoutMs: 300 })
}

async function scrollPastHeroCta(page: Page) {
  const ctaBottom = await page.locator('#hero-cta').evaluate((cta) => cta.getBoundingClientRect().bottom + window.scrollY)
  await scrollToY(page, ctaBottom + 200)
}

/** Lo que la barra deja ver arriba del borde inferior y el espacio reservado para el foco. */
async function footprint(page: Page) {
  return page.evaluate(() => {
    const state = document.querySelector<HTMLElement>('[data-state]')!
    const open = state.dataset.state === 'open'
    // Abierta: el fondo de la barra; cerrada: solo el botón de WhatsApp
    const visible = open ? state.getBoundingClientRect() : state.querySelector('a[target="_blank"]')!.getBoundingClientRect()
    return {
      open,
      visibleHeight: window.innerHeight - visible.top,
      reserved: parseFloat(getComputedStyle(document.documentElement).scrollPaddingBottom),
      htmlState: document.documentElement.dataset.actionBar,
    }
  })
}

test.describe('barra inferior móvil', () => {
  test.use({ viewport: { width: 390, height: 844 } })
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-390', 'El viewport lo define la prueba')
    await page.goto('/')
    await waitForStableLayout(page)
  })

  test('estado inicial: solo WhatsApp, sin fondo; el CTA oculto es inert', async ({ page }) => {
    await expect(bar(page)).toHaveAttribute('data-state', 'closed')
    await expect(whatsapp(page)).toBeVisible()
    const background = bar(page).locator('[aria-hidden="true"]').first()
    await expect(background).toHaveCSS('opacity', '0')
    const wrapper = barCta(page).locator('xpath=..')
    expect(await wrapper.evaluate((element) => (element as HTMLElement).inert)).toBe(true)
    await expect(wrapper).toHaveCSS('opacity', '0')
    // inert lo saca del orden de foco y del árbol accesible (el motor de roles de Playwright no aplica
    // inert, así que se comprueba el atributo y, en otra prueba, el teclado)
    await expect(wrapper).toHaveAttribute('inert', '')
  })

  test('al pasar el CTA del hero aparecen el fondo y «Consulta disponibilidad»', async ({ page }) => {
    await scrollPastHeroCta(page)
    await expect(bar(page)).toHaveAttribute('data-state', 'open')
    await expect(barCta(page)).toBeVisible()
    expect(await barCta(page).locator('xpath=..').evaluate((element) => (element as HTMLElement).inert)).toBe(false)
    await expect(bar(page).locator('[aria-hidden="true"]').first()).toHaveCSS('opacity', '1')
  })

  test('con la sección de contacto a la vista vuelve al estado inicial', async ({ page }) => {
    await scrollPastHeroCta(page)
    await expect(bar(page)).toHaveAttribute('data-state', 'open')
    const contactTop = await page.locator('#contacto').evaluate((section) => section.getBoundingClientRect().top + window.scrollY)
    await scrollToY(page, contactTop)
    await expect(bar(page)).toHaveAttribute('data-state', 'closed')
  })

  test('WhatsApp queda en la misma posición en los dos estados', async ({ page }) => {
    const closed = await whatsapp(page).boundingBox()
    await scrollPastHeroCta(page)
    await expect(bar(page)).toHaveAttribute('data-state', 'open')
    const open = await whatsapp(page).boundingBox()
    expect(open).toEqual(closed)
  })

  test('el espacio reservado corresponde a lo visible en cada estado', async ({ page }) => {
    const closed = await footprint(page)
    expect(closed).toMatchObject({ open: false, htmlState: 'closed' })
    await scrollPastHeroCta(page)
    await expect(bar(page)).toHaveAttribute('data-state', 'open')
    const open = await footprint(page)
    expect(open).toMatchObject({ open: true, htmlState: 'open' })
    for (const state of [closed, open]) {
      // Cubre lo visible sin reservar de más (margen de 8 px)
      expect(state.reserved).toBeGreaterThanOrEqual(state.visibleHeight)
      expect(state.reserved).toBeLessThanOrEqual(state.visibleHeight + 8)
    }
    expect(open.reserved).toBeGreaterThan(closed.reserved)
  })

  test('oculto, el CTA no recibe foco con el teclado', async ({ page }) => {
    await expect(bar(page)).toHaveAttribute('data-state', 'closed')
    // Desde el inicio, Shift+Tab va a lo último del documento: la barra
    await page.keyboard.press('Shift+Tab')
    await expect(whatsapp(page)).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(barCta(page)).not.toBeFocused()
    expect(await page.evaluate(() => Boolean(document.activeElement?.closest('[data-state]')))).toBe(false)
  })

  test('foco no tapado (2.4.11) en los dos estados', async ({ page }) => {
    for (const open of [false, true]) {
      if (open) {
        await scrollPastHeroCta(page)
        await expect(bar(page)).toHaveAttribute('data-state', 'open')
      }
      // Diez paradas de Tab desde la posición actual; el estado no debe cambiar a mitad del recorrido
      await page.locator(open ? '#eventos' : '#inicio').evaluate((section) => (section as HTMLElement).focus())
      for (let i = 0; i < 10; i += 1) {
        await page.keyboard.press('Tab')
        const moved = await waitForScrollEnd(page, { startTimeoutMs: 150, quietMs: 150 })
        if (moved) await waitForScrollEnd(page, { startTimeoutMs: 400, quietMs: 150 })
        const report = await obscuringReport(page)
        if (!report) continue
        expect(report.ratio, `${report.name} tapado por ${report.by}`).toBe(0)
      }
    }
  })

  test('el CTA lleva el mismo ícono que en el hero', async ({ page }) => {
    const iconOf = (selector: ReturnType<typeof barCta>) => selector.locator('svg use').getAttribute('href')
    expect(await iconOf(barCta(page))).toBe(await iconOf(page.locator('#hero-cta')))
  })

  test('con prefers-reduced-motion el cambio es instantáneo', async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
    await page.goto('/')
    const durations = await bar(page).evaluate((element) =>
      Array.from(element.querySelectorAll<HTMLElement>('[aria-hidden="true"], [inert]')).map((node) => getComputedStyle(node).transitionDuration),
    )
    expect(durations.length).toBeGreaterThan(0)
    for (const duration of durations) expect(parseFloat(duration)).toBeLessThanOrEqual(0.00001)
    await page.close()
  })
})

test.describe('botón flotante desde md', () => {
  for (const viewport of [
    { width: 768, height: 900 },
    { width: 1440, height: 900 },
  ]) {
    test.describe(`${viewport.width} px`, () => {
      test.use({ viewport })
      test('sin barra; la burbuja no tapa el foco', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'desktop-1440', 'El viewport lo define la prueba')
        await page.goto('/')
        await waitForStableLayout(page)
        await expect(bar(page)).toBeHidden()
        const bubble = page.getByText('¿Tienes dudas? Escríbenos')
        await expect(bubble).toBeVisible()
        // La burbuja no recibe clics (pointer-events: none), así que se compara su caja con la del foco
        let checked = 0
        for (let i = 0; i < 400; i += 1) {
          await page.keyboard.press('Tab')
          await waitForScrollEnd(page, { startTimeoutMs: 150, quietMs: 150 })
          const overlap = await page.evaluate(() => {
            const active = document.activeElement as HTMLElement | null
            const bubbleEl = Array.from(document.querySelectorAll('span')).find((span) => span.textContent === '¿Tienes dudas? Escríbenos')!
            if (!active || active === document.body || active.closest('.fixed')) return null
            const a = active.getBoundingClientRect()
            const b = bubbleEl.getBoundingClientRect()
            const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
            const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
            return { name: (active.textContent || active.tagName).trim().slice(0, 40), area: x * y, back: active.textContent?.includes('Saltar al contenido') }
          })
          if (!overlap) continue
          checked += 1
          expect(overlap.area, `${overlap.name} bajo la burbuja`).toBe(0)
          if (overlap.back && i > 0) break
        }
        expect(checked).toBeGreaterThan(50)
      })
    })
  }

  test('en móvil la burbuja no aparece (ni encima de la barra)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-390', 'Solo móvil')
    await page.goto('/')
    await expect(page.getByText('¿Tienes dudas? Escríbenos')).toBeHidden()
  })
})
