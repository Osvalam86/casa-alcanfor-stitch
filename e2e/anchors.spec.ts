import { expect, test, type Page } from '@playwright/test'
import { isMobile, offsetBelowHeader, waitForScrollEnd, waitForStableLayout } from './helpers.ts'

/**
 * Cada enlace del header deja su sección justo bajo el header (±1 px),
 * partiendo de la página arriba y ya desplazada.
 */
const NAV = [
  { label: 'Eventos', id: 'eventos' },
  { label: 'Espacios', id: 'espacios' },
  { label: 'Paquetes', id: 'paquetes' },
  { label: 'Galería', id: 'galeria' },
  { label: 'Preguntas', id: 'preguntas' },
] as const

const STARTS = ['arriba', 'desplazada'] as const

async function prepare(page: Page, start: (typeof STARTS)[number]) {
  await page.goto('/')
  await waitForStableLayout(page)
  if (start === 'desplazada') {
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight * 0.6, behavior: 'instant' }))
    await waitForStableLayout(page)
  }
}

/** Activa un enlace del header con teclado: en móvil, a través del menú. */
async function activateHeaderLink(page: Page, label: string) {
  if (isMobile(page)) {
    await page.getByRole('button', { name: 'Abrir menú' }).press('Enter')
    const link = page.getByRole('dialog', { name: 'Menú' }).getByRole('link', { name: label, exact: true })
    await link.press('Enter')
    await expect(page.getByRole('dialog', { name: 'Menú' })).toBeHidden()
  } else {
    await page.locator('header nav').getByRole('link', { name: label, exact: true }).press('Enter')
  }
  await waitForScrollEnd(page)
}

for (const start of STARTS) {
  for (const item of NAV) {
    test(`${item.label} (página ${start})`, async ({ page }) => {
      await prepare(page, start)
      await activateHeaderLink(page, item.label)
      await expect(page).toHaveURL(new RegExp(`#${item.id}$`))
      expect(Math.abs(await offsetBelowHeader(page.locator(`#${item.id}`)))).toBeLessThanOrEqual(1)
    })
  }

  test(`CTA "Agenda tu visita" → contacto (página ${start})`, async ({ page }) => {
    await prepare(page, start)
    const cta = isMobile(page)
      ? (await page.getByRole('button', { name: 'Abrir menú' }).press('Enter'), page.getByRole('dialog').getByRole('link', { name: 'Agenda tu visita' }))
      : page.locator('header').getByRole('link', { name: 'Agenda tu visita' })
    await cta.press('Enter')
    await waitForScrollEnd(page)
    expect(Math.abs(await offsetBelowHeader(page.locator('#contacto')))).toBeLessThanOrEqual(1)
  })

  test(`marca → inicio (página ${start})`, async ({ page }) => {
    await prepare(page, start)
    await page.getByRole('link', { name: /^Casa Alcanfor.*ir al inicio$/ }).press('Enter')
    await waitForScrollEnd(page)
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
    expect(Math.abs(await offsetBelowHeader(page.locator('#inicio')))).toBeLessThanOrEqual(1)
  })

  test(`"Ver detalles y fotos" filtra la galería y la deja bajo el header (página ${start})`, async ({ page }) => {
    await prepare(page, start)
    const link = page.getByRole('link', { name: /Ver detalles y fotos de XV años/ })
    await link.press('Enter')
    await waitForScrollEnd(page)
    await expect(page).toHaveURL(/\?galeria=xv#galeria$/)
    await expect(page.getByRole('button', { name: 'XV años', exact: true, pressed: true })).toBeVisible()
    await expect(page.locator('#galeria')).toBeFocused()
    expect(Math.abs(await offsetBelowHeader(page.locator('#galeria')))).toBeLessThanOrEqual(1)
  })
}

test('carga directa con hash y filtro (?galeria=bodas#galeria)', async ({ page }) => {
  await page.goto('/?galeria=bodas#galeria')
  await waitForStableLayout(page)
  await expect(page.getByRole('button', { name: 'Bodas', pressed: true })).toBeVisible()
  expect(Math.abs(await offsetBelowHeader(page.locator('#galeria')))).toBeLessThanOrEqual(1)
})
