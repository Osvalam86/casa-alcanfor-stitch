import { expect, test, type Page } from '@playwright/test'
import { obscuringReport, offsetBelowHeader, waitForScrollEnd } from './helpers.ts'

const PAGES = ['/', '/design-system'] as const

// Los recorridos completos con Tab esperan el fin del scroll en cada paso
test.describe.configure({ timeout: 120_000 })

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
}

/**
 * Recorre toda la página con Tab (y de regreso con Shift+Tab) y devuelve cada foco
 * que algún elemento fijo tapa (header, botón de WhatsApp, barra móvil).
 * Criterio: nunca oculto del todo (2.4.11 AA) y, si el elemento cabe entre lo fijo de arriba y de abajo,
 * sin ningún solapamiento. Solo un elemento más alto que el espacio libre puede quedar tapado en parte.
 */
async function walkFocus(page: Page, key: 'Tab' | 'Shift+Tab') {
  const problems: string[] = []
  let visited = 0
  for (let i = 0; i < 400; i += 1) {
    await page.keyboard.press(key)
    // El desplazamiento por foco es suave (scroll-behavior: smooth): se mide al terminar
    await waitForScrollEnd(page, 150)
    const report = await obscuringReport(page)
    if (!report) continue
    visited += 1
    if (report.sampled === 0) problems.push(`${report.tag} "${report.name}" fuera de la pantalla`)
    // Falla si queda oculto del todo (2.4.11 AA) o si cabía en el espacio libre y aun así se tapa
    else if (report.ratio >= 1 || (report.ratio > 0 && report.fits)) problems.push(`${report.tag} "${report.name}" tapado ${Math.round(report.ratio * 100)}% por ${report.by}`)
    const back = await page.evaluate(() => document.activeElement?.textContent?.includes('Saltar al contenido'))
    if (back && i > 0) break
  }
  return { problems, visited }
}

test.describe('320 px', () => {
  test.use({ viewport: { width: 320, height: 640 } })
  for (const path of PAGES) {
    test(`sin scroll horizontal en ${path}`, async ({ page }) => {
      await page.goto(path)
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
    })
  }
  test('foco nunca tapado por lo fijo (2.4.11)', async ({ page }) => {
    await page.goto('/')
    const forward = await walkFocus(page, 'Tab')
    expect(forward.visited).toBeGreaterThan(50)
    expect(forward.problems).toEqual([])
  })
})

// Resto de anchos de validación del CLAUDE.md (§7)
for (const width of [768, 1024, 1280]) {
  test.describe(`${width} px`, () => {
    test.use({ viewport: { width, height: 900 } })
    for (const path of PAGES) {
      test(`sin scroll horizontal en ${path}`, async ({ page }) => {
        await page.goto(path)
        expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
      })
    }
  })
}

test.describe('zoom al 200 %', () => {
  // 1440×900 al 200 % = viewport CSS de 720×450 con densidad 2 (las media queries responden igual que con zoom real)
  test.use({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 })
  for (const path of PAGES) {
    test(`sin scroll horizontal en ${path}`, async ({ page }) => {
      await page.goto(path)
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0)
    })
  }
  test('lo fijo deja espacio útil y no tapa el foco', async ({ page }) => {
    await page.goto('/')
    const headerHeight = await page.locator('header').evaluate((header) => header.getBoundingClientRect().height)
    expect(headerHeight).toBeLessThanOrEqual(450 * 0.25)
    const forward = await walkFocus(page, 'Tab')
    expect(forward.problems).toEqual([])
  })
})

test.describe('prefers-reduced-motion: reduce', () => {
  test.use({ reducedMotion: 'reduce' })
  test('sin scroll suave, transiciones anuladas y anclas exactas', async ({ page }) => {
    await page.goto('/')
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto')
    const duration = await page
      .getByRole('button', { name: 'Ver fechas libres' })
      .evaluate((element) => getComputedStyle(element).transitionDuration)
    expect(duration.split(',').every((value) => parseFloat(value) <= 0.00001)).toBe(true)
    // Nada animándose por su cuenta
    const running = await page.evaluate(() =>
      document.getAnimations().filter((animation) => animation.playState === 'running' && (animation.effect?.getTiming().iterations ?? 1) === Infinity).length,
    )
    expect(running).toBe(0)

    // El salto es instantáneo: la sección queda en su sitio sin esperar
    await page.getByRole('link', { name: /Ver detalles y fotos de XV años/ }).press('Enter')
    expect(Math.abs(await offsetBelowHeader(page.locator('#galeria')))).toBeLessThanOrEqual(1)
  })
})

test.describe('foco no tapado en todo el recorrido (2.4.11)', () => {
  test('hacia adelante (Tab)', async ({ page }) => {
    await page.goto('/')
    const { problems, visited } = await walkFocus(page, 'Tab')
    expect(visited).toBeGreaterThan(50)
    expect(problems).toEqual([])
  })

  test('hacia atrás (Shift+Tab) desde el final', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
    await waitForScrollEnd(page)
    await page.locator('footer').click({ position: { x: 5, y: 5 } })
    const { problems } = await walkFocus(page, 'Shift+Tab')
    expect(problems).toEqual([])
  })
})
