import { expect, test, type Page } from '@playwright/test'
import { isMobile, tabTo } from './helpers.ts'

/**
 * Teclado real: solo keyboard.press / keyboard.type. Nunca showModal(), close() ni focus() por script.
 * Para llegar a cada control se tabula desde el inicio de la página.
 */

const quote = (page: Page) => page.getByRole('form', { name: 'Solicita tu cotización' })

test('skip link: primer Tab, visible y salta al <main>', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Saltar al contenido principal' })
  await expect(skip).toBeFocused()
  const box = await skip.boundingBox()
  expect(box && box.width > 40 && box.height >= 24).toBeTruthy()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  // El siguiente Tab cae dentro del <main>, no en el header
  await page.keyboard.press('Tab')
  const inMain = await page.evaluate(() => document.querySelector('main')!.contains(document.activeElement))
  expect(inMain).toBe(true)
})

test('menú móvil: abre con Enter, atrapa el foco, Escape cierra y el foco regresa', async ({ page }) => {
  test.skip(!isMobile(page), 'El menú solo existe por debajo de xl')
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Abrir menú' })
  await tabTo(page, trigger)
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Menú' })
  await expect(dialog).toBeVisible()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')

  // El foco queda dentro del diálogo aunque se tabule de más
  for (let i = 0; i < 12; i += 1) {
    await page.keyboard.press('Tab')
    const inside = await page.evaluate(() => {
      const active = document.activeElement
      return !active || active === document.body || Boolean(active.closest('dialog'))
    })
    expect(inside).toBe(true)
  }

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveAttribute('aria-expanded', 'false')

  // El botón de cerrar también devuelve el foco
  await page.keyboard.press('Enter')
  await expect(dialog).toBeVisible()
  await tabTo(page, page.getByRole('button', { name: 'Cerrar menú' }))
  await page.keyboard.press('Enter')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('pestañas de espacios: flechas, Home/End y URL', async ({ page }) => {
  await page.goto('/')
  const tabs = page.getByRole('tablist', { name: 'Espacios de Casa Alcanfor' }).getByRole('tab')
  await tabTo(page, tabs.first())
  await expect(tabs.first()).toHaveAttribute('aria-selected', 'true')

  await page.keyboard.press('ArrowRight')
  await expect(tabs.nth(1)).toBeFocused()
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel', { name: 'Jardín Los Fresnos' })).toBeVisible()
  await expect(page).toHaveURL(/espacio=jardin/)

  await page.keyboard.press('End')
  await expect(tabs.nth(2)).toBeFocused()
  await expect(page.getByRole('tabpanel', { name: 'Terraza Mirador' })).toBeVisible()

  await page.keyboard.press('ArrowRight')
  await expect(tabs.first()).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(tabs.nth(2)).toBeFocused()
  await page.keyboard.press('Home')
  await expect(tabs.first()).toBeFocused()
  await expect(page).not.toHaveURL(/espacio=/)

  // Un solo tab stop: Tab sale del tablist hacia el panel
  await page.keyboard.press('Tab')
  const inPanel = await page.evaluate(() => Boolean(document.activeElement?.closest('[role="tabpanel"]')))
  expect(inPanel).toBe(true)
})

test('filtros de galería: Enter y Espacio, aria-pressed, anuncio y URL', async ({ page }) => {
  await page.goto('/')
  const group = page.getByRole('group', { name: 'Filtrar fotos' })
  const bodas = group.getByRole('button', { name: 'Bodas' })
  const photos = page.locator('#galeria li:visible')
  await expect(photos).toHaveCount(6)

  await tabTo(page, bodas)
  await page.keyboard.press('Enter')
  await expect(bodas).toHaveAttribute('aria-pressed', 'true')
  await expect(photos).toHaveCount(2)
  await expect(page.locator('#galeria [role="status"]')).toHaveText('Mostrando 2 fotos')
  await expect(page).toHaveURL(/galeria=bodas/)

  const xv = group.getByRole('button', { name: 'XV Años' })
  await tabTo(page, xv)
  await page.keyboard.press('Space')
  await expect(xv).toHaveAttribute('aria-pressed', 'true')
  await expect(bodas).toHaveAttribute('aria-pressed', 'false')
  await expect(photos).toHaveCount(1)

  const all = group.getByRole('button', { name: 'Todos' })
  await tabTo(page, all, { reverse: true })
  await page.keyboard.press('Enter')
  await expect(photos).toHaveCount(6)
  await expect(page).not.toHaveURL(/galeria=/)
})

test('FAQ: Enter abre, Espacio abre otra y cierra la anterior', async ({ page }) => {
  await page.goto('/')
  const first = page.getByRole('button', { name: /anticipación debo reservar/ })
  const second = page.getByRole('button', { name: /Qué incluye cada paquete/ })
  await tabTo(page, first)
  await expect(first).toHaveAttribute('aria-expanded', 'false')
  await page.keyboard.press('Enter')
  await expect(first).toHaveAttribute('aria-expanded', 'true')
  const panelId = await first.getAttribute('aria-controls')
  await expect(page.locator(`[id="${panelId}"]`)).toBeVisible()

  await page.keyboard.press('Tab')
  await expect(second).toBeFocused()
  await page.keyboard.press('Space')
  await expect(second).toHaveAttribute('aria-expanded', 'true')
  await expect(first).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator(`[id="${panelId}"]`)).toBeHidden()

  await page.keyboard.press('Enter')
  await expect(second).toHaveAttribute('aria-expanded', 'false')
})

test('calculador: precarga el formulario, lleva el foco y anuncia', async ({ page }) => {
  await page.goto('/')
  const checker = page.getByRole('form', { name: 'Calculador Exprés de Disponibilidad' })
  const eventType = checker.getByLabel('¿Qué celebras?')
  await tabTo(page, eventType)
  await page.keyboard.press('ArrowDown') // XV Años
  await expect(eventType).toHaveValue('XV Años')

  await page.keyboard.press('Tab')
  await expect(checker.getByLabel('Fecha tentativa')).toBeFocused()
  await page.keyboard.type('15062030') // dd/mm/aaaa (es-MX)
  await expect(checker.getByLabel('Fecha tentativa')).toHaveValue('2030-06-15')

  // El input date nativo de Chromium consume Tabs entre sus segmentos: se tabula hasta salir
  await tabTo(page, checker.getByLabel('Núm. de invitados'))
  await page.keyboard.press('ArrowDown') // 251 a 450
  await page.keyboard.press('Tab')
  await expect(checker.getByRole('button', { name: 'Ver fechas libres' })).toBeFocused()
  await page.keyboard.press('Enter')

  const form = quote(page)
  await expect(form.getByLabel('Nombre completo')).toBeFocused()
  await expect(form.getByLabel('Tipo de evento')).toHaveValue('XV Años')
  await expect(form.getByLabel('Fecha tentativa')).toHaveValue('2030-06-15')
  await expect(form.getByLabel('Cuéntanos tu idea')).toHaveValue('Invitados estimados: 251 a 450 invitados')
  await expect(page.getByRole('status').filter({ hasText: 'Completa tus datos' })).toBeVisible()
})

test('formulario vacío: el foco va al resumen y los errores quedan ligados', async ({ page }) => {
  await page.goto('/')
  const form = quote(page)
  await tabTo(page, form.getByRole('button', { name: 'Enviar solicitud' }))
  await page.keyboard.press('Enter')

  const summary = form.locator('[aria-labelledby$="-errors"]')
  await expect(summary).toBeFocused()
  await expect(summary).toContainText('Hay 6 campos por corregir')
  await expect(summary.getByRole('link')).toHaveCount(6)

  for (const [label, error] of [
    ['Nombre completo', 'Escribe tu nombre completo.'],
    ['WhatsApp', 'Escribe un número de WhatsApp de 10 dígitos.'],
    ['Correo', 'Escribe un correo válido'],
    ['Tipo de evento', 'Selecciona el tipo de evento.'],
    ['Fecha tentativa', 'Elige una fecha tentativa'],
  ] as const) {
    const control = form.getByLabel(label, { exact: false }).first()
    await expect(control).toHaveAttribute('aria-invalid', 'true')
    await expect(control).toHaveAccessibleDescription(new RegExp(error.replace(/[.?]/g, '\\$&')))
  }
  const privacy = form.getByRole('checkbox')
  await expect(privacy).toHaveAttribute('aria-invalid', 'true')
  await expect(privacy).toHaveAccessibleDescription('Acepta el aviso de privacidad para continuar.')

  // Los enlaces del resumen llevan al campo
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  await expect(form.getByLabel('Nombre completo')).toBeFocused()
})

test('formulario válido: se envía con teclado y el foco pasa al mensaje de éxito', async ({ page }) => {
  await page.goto('/')
  const form = quote(page)
  await tabTo(page, form.getByLabel('Nombre completo'))
  await page.keyboard.type('Mariana González')
  await page.keyboard.press('Tab')
  await page.keyboard.type('33 0000 0000')
  await page.keyboard.press('Tab')
  await page.keyboard.type('mariana@correo.example')
  await page.keyboard.press('Tab')
  await page.keyboard.press('ArrowDown') // Boda
  await expect(form.getByLabel('Tipo de evento')).toHaveValue('Boda')
  await page.keyboard.press('Tab')
  await page.keyboard.type('20112030')
  await expect(form.getByLabel('Fecha tentativa')).toHaveValue('2030-11-20')
  await tabTo(page, form.getByLabel('Número de invitados'))
  await page.keyboard.type('180')
  await page.keyboard.press('Tab')
  await page.keyboard.type('Ceremonia civil en el jardín')
  await page.keyboard.press('Tab')
  await expect(form.getByRole('checkbox')).toBeFocused()
  await page.keyboard.press('Space')
  await expect(form.getByRole('checkbox')).toBeChecked()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')

  const success = page.getByRole('status').filter({ hasText: '¡Solicitud recibida con éxito!' })
  await expect(success).toBeFocused({ timeout: 5_000 })
})
