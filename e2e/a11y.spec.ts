import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { isMobile, tabTo, waitForScrollEnd, waitForStableLayout } from './helpers.ts'

/** Cero violaciones serious o critical (CLAUDE.md §10). */
async function expectNoSeriousViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze()
  const serious = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
  const summary = serious.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    targets: violation.nodes.map((node) => node.target.join(' ')).slice(0, 5),
  }))
  expect(summary).toEqual([])
}

test.describe('axe', () => {
  test('landing (/)', async ({ page }) => {
    await page.goto('/')
    await expectNoSeriousViolations(page)
  })

  test('landing con errores en el formulario', async ({ page }) => {
    await page.goto('/#contacto')
    await waitForStableLayout(page)
    // Teclado real: Tab hasta el botón y Enter cuando terminó el scroll que provoca el foco
    // (locator.press enfoca y pulsa a la vez y deja dos scrolls suaves encimados)
    await tabTo(page, page.getByRole('button', { name: 'Enviar solicitud' }))
    await waitForScrollEnd(page)
    await page.keyboard.press('Enter')
    await expect(page.getByText('Revisa los campos marcados')).toBeVisible()
    // El foco va al resumen con scroll suave: axe mide target-size solo con la página quieta
    await waitForScrollEnd(page)
    await expectNoSeriousViolations(page)
  })

  test('landing con el menú móvil abierto', async ({ page }) => {
    test.skip(!isMobile(page), 'El menú solo existe por debajo de xl; se prueba a 390 px')
    await page.goto('/')
    await page.getByRole('button', { name: 'Abrir menú' }).press('Enter')
    await expect(page.getByRole('dialog', { name: 'Menú' })).toBeVisible()
    await expectNoSeriousViolations(page)
  })

  test('design system (/design-system)', async ({ page }) => {
    await page.goto('/design-system')
    await expectNoSeriousViolations(page)
  })
})

for (const path of ['/', '/design-system']) {
  test(`<dl> válidas en ${path}: cada <div> agrupa solo <dt> y <dd>`, async ({ page }) => {
    await page.goto(path)
    // axe ignora los <svg aria-hidden>, pero el modelo de contenido de <dl> tampoco los admite
    const invalid = await page.evaluate(() =>
      Array.from(document.querySelectorAll('dl > div'))
        .filter((group) => Array.from(group.children).some((child) => child.tagName !== 'DT' && child.tagName !== 'DD'))
        .map((group) => group.textContent?.slice(0, 40)),
    )
    expect(invalid).toEqual([])
  })
}

test('imágenes de contenido: alt presente y distinto del texto que las rodea', async ({ page }) => {
  await page.goto('/')
  const images = await page.locator('main img').evaluateAll((elements) =>
    elements.map((element) => {
      const img = element as HTMLImageElement
      const figure = img.closest('figure, li, article, [role="tabpanel"]')
      const around = (figure?.textContent ?? '').replace(/\s+/g, ' ').trim().toLowerCase()
      return { file: img.src.split('/').pop(), alt: img.alt, around }
    }),
  )
  // 16 fotos de contenido + el mapa decorativo (alt="")
  expect(images.filter((image) => image.alt !== '')).toHaveLength(16)
  for (const image of images.filter((item) => item.alt !== '')) {
    expect(image.alt.length, image.file).toBeGreaterThan(40)
    expect(image.around.includes(image.alt.toLowerCase()), image.file).toBe(false)
  }
})
