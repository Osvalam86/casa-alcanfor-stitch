import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { offsetBelowHeader, waitForStableLayout } from './helpers.ts'

/**
 * Página 404 (dist/404.html). Netlify la sirve en cualquier ruta inexistente; vite preview no
 * (responde con index.html), así que aquí se abre directo. Teclado real: solo keyboard.press.
 */

const PATH = '/404.html'

test('axe: cero violaciones serious o critical', async ({ page }) => {
  await page.goto(PATH)
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze()
  const serious = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
  expect(serious.map((violation) => violation.id)).toEqual([])
})

test('metadatos: título propio, noindex y un solo h1', async ({ page }) => {
  await page.goto(PATH)
  await expect(page).toHaveTitle('Página no encontrada · Casa Alcanfor')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
  // Sin metadatos para compartir ni datos estructurados del negocio
  await expect(page.locator('meta[property="og:title"], script[type="application/ld+json"], link[rel="canonical"]')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('No encontramos esta página')
  await expect(page.getByRole('heading')).toHaveCount(1)
  await expect(page.getByRole('complementary', { name: 'Aviso' })).toBeVisible()
})

test('foco: skip link, marca y los dos enlaces en orden, con foco visible', async ({ page }) => {
  await page.goto(PATH)
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Saltar al contenido principal' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeVisible()

  // Sin saltar: la marca va antes del contenido
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: /^Casa Alcanfor.*ir al inicio$/ })).toBeFocused()

  // El skip link lleva al <main>; el siguiente Tab cae en el enlace principal y luego en el secundario
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  const primary = page.getByRole('link', { name: 'Volver al inicio' })
  const secondary = page.getByRole('link', { name: 'Agenda tu visita' })
  await page.keyboard.press('Tab')
  await expect(primary).toBeFocused()
  // Foco visible: contorno de 2 px
  await expect(primary).toHaveCSS('outline-width', '2px')
  await page.keyboard.press('Tab')
  await expect(secondary).toBeFocused()
  await expect(secondary).toHaveCSS('outline-width', '2px')
})

test('«Volver al inicio» es el enlace principal y lleva a la landing', async ({ page }) => {
  await page.goto(PATH)
  const primary = page.getByRole('link', { name: 'Volver al inicio' })
  const secondary = page.getByRole('link', { name: 'Agenda tu visita' })
  await expect(primary).toHaveAttribute('href', '/')
  await expect(secondary).toHaveAttribute('href', '/#contacto')
  // Principal: relleno sólido y primero en el orden; secundario: contorno sobre la superficie
  const backgrounds = await Promise.all([primary, secondary].map((link) => link.evaluate((element) => getComputedStyle(element).backgroundColor)))
  const surface = await page.evaluate(() => getComputedStyle(document.querySelector('main')!).backgroundColor)
  expect(backgrounds[0]).not.toBe(surface)
  expect(backgrounds[1]).toBe(surface)
  expect(await primary.evaluate((element, other) => Boolean(element.compareDocumentPosition(other!) & Node.DOCUMENT_POSITION_FOLLOWING), await secondary.elementHandle())).toBe(true)

  await primary.press('Enter')
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Celebra donde cada momento')
})

test('respaldo: una ruta inexistente servida con index.html muestra la 404, no la landing', async ({ page }) => {
  // vite preview responde /no-existe con index.html (como un hosting con regla /* → /index.html)
  await page.goto('/no-existe')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('No encontramos esta página')
  await expect(page.getByRole('heading')).toHaveCount(1)
  await expect(page.locator('#inicio, #contacto, dialog')).toHaveCount(0)
  await expect(page).toHaveTitle('Página no encontrada · Casa Alcanfor')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
})

test('canal de la barra: solo la landing (con <dialog>) lo reserva; aviso y header llegan al borde', async ({ page }) => {
  // Ventana alta: la 404 no tiene scroll, así que no debe quedar un canal vacío a la derecha
  await page.setViewportSize({ width: page.viewportSize()!.width, height: 1600 })
  const gutter = () => page.evaluate(() => getComputedStyle(document.documentElement).scrollbarGutter)

  for (const path of [PATH, '/no-existe', '/design-system']) {
    await page.goto(path)
    expect(await gutter(), path).toBe('auto')
  }

  for (const path of [PATH, '/no-existe']) {
    await page.goto(path)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    for (const band of [page.getByRole('complementary', { name: 'Aviso' }), page.locator('header')]) {
      const box = (await band.boundingBox())!
      expect(box.x + box.width, path).toBe(viewportWidth)
    }
  }

  await page.goto('/')
  expect(await gutter()).toBe('stable')
})

test('«Agenda tu visita» lleva a la sección de contacto de la landing, bajo el header', async ({ page }) => {
  await page.goto(PATH)
  await page.getByRole('link', { name: 'Agenda tu visita' }).press('Enter')
  await expect(page).toHaveURL(/\/#contacto$/)
  await waitForStableLayout(page)
  expect(Math.abs(await offsetBelowHeader(page.locator('#contacto')))).toBeLessThanOrEqual(1)
})
