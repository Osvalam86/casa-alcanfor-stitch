import { expect, test, type Page } from '@playwright/test'

/**
 * Fuentes del hero sin salto de layout (CLS):
 * - la fuente del LCP móvil (Manrope 400) se precarga desde el HTML del build; las demás no,
 *   porque precargarlas retrasaba el FCP móvil (ver config/vite-plugin-font-preload.ts)
 * - las fuentes de respaldo con métricas ajustadas ocupan lo mismo que EB Garamond y Manrope
 */

const CRITICAL = ['manrope-latin-400-normal']

test('la fuente del LCP móvil se precarga', async ({ page, request }) => {
  await page.goto('/')
  const preloads = await page.locator('head link[rel="preload"][as="font"]').evaluateAll((links) =>
    links.map((link) => ({ href: link.getAttribute('href')!, type: link.getAttribute('type'), crossorigin: link.hasAttribute('crossorigin') })),
  )
  for (const name of CRITICAL) {
    const preload = preloads.find((item) => item.href.includes(`/${name}-`))
    expect(preload, `precarga de ${name}`).toBeDefined()
    expect(preload!.type).toBe('font/woff2')
    // Sin crossorigin la precarga no se reutiliza y la fuente se descarga dos veces
    expect(preload!.crossorigin).toBe(true)
    expect((await request.get(preload!.href)).ok()).toBe(true)
  }
})

/** Posición y tamaño del contenido del hero, con o sin las fuentes web. */
async function heroLayout(page: Page, blockWebFonts: boolean) {
  // @fontsource declara woff2 y woff: se bloquean ambos para que se pinte el respaldo
  if (blockWebFonts) await page.route(/\.woff2?$/, (route) => route.abort())
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  return page.evaluate(() => {
    const measure = (selector: string) => {
      const element = document.querySelector(selector)!
      const range = document.createRange()
      range.selectNodeContents(element)
      const rects = Array.from(range.getClientRects())
      const lines = new Set(rects.map((rect) => Math.round(rect.top))).size
      // Ancho total del texto: detecta un respaldo más ancho o angosto aunque corte en las mismas líneas
      const textWidth = rects.reduce((sum, rect) => sum + rect.width, 0)
      const box = element.getBoundingClientRect()
      return { top: Math.round(box.top), height: Math.round(box.height), lines, textWidth }
    }
    const webFonts = Array.from(document.fonts).filter((face) => face.status === 'loaded' && !face.family.includes('Fallback')).length
    return { webFonts, title: measure('#inicio h1'), description: measure('#inicio h1 + p'), trust: measure('main > section:nth-of-type(2)') }
  })
}

test('el respaldo ocupa lo mismo que las fuentes web (sin salto al cargarlas)', async ({ browser }) => {
  const webPage = await browser.newPage()
  const web = await heroLayout(webPage, false)
  await webPage.close()
  const fallbackPage = await browser.newPage()
  const fallback = await heroLayout(fallbackPage, true)
  await fallbackPage.close()

  expect(web.webFonts).toBeGreaterThan(0)
  expect(fallback.webFonts, 'con las fuentes bloqueadas se pinta el respaldo').toBe(0)
  for (const key of ['title', 'description'] as const) {
    expect(fallback[key].lines, `${key}: mismas líneas`).toBe(web[key].lines)
    expect(Math.abs(fallback[key].height - web[key].height), `${key}: misma altura`).toBeLessThanOrEqual(2)
    const widthDelta = Math.abs(fallback[key].textWidth - web[key].textWidth) / web[key].textWidth
    expect(widthDelta, `${key}: ancho del texto dentro de 3 %`).toBeLessThanOrEqual(0.03)
  }
  // Lo que sigue al hero no se mueve
  expect(Math.abs(fallback.trust.top - web.trust.top)).toBeLessThanOrEqual(2)
})
