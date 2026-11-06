import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'

/**
 * Fuentes del hero sin salto de layout (CLS):
 * - la fuente del LCP móvil (Manrope 400) se precarga desde el HTML del build; las demás no,
 *   porque precargarlas retrasaba el FCP móvil (ver config/vite-plugin-font-preload.ts)
 * - las fuentes de respaldo con métricas ajustadas ocupan lo mismo que EB Garamond y Manrope,
 *   tanto las de escritorio (Times New Roman, Arial) como las de Android (Noto Serif, Roboto)
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

type Mode = 'web' | 'desktop' | 'android'

/** Fuentes de Android (e2e/fixtures/fonts) que sustituyen a los local() de las caras "… Fallback Android" */
const ANDROID_FONTS: Record<string, string> = {
  'Noto Serif': 'noto-serif-latin-400-normal.woff2',
  'NotoSerif-Regular': 'noto-serif-latin-400-normal.woff2',
  'Noto Serif Italic': 'noto-serif-latin-400-italic.woff2',
  'NotoSerif-Italic': 'noto-serif-latin-400-italic.woff2',
  Roboto: 'roboto-latin-400-normal.woff2',
  'Roboto-Regular': 'roboto-latin-400-normal.woff2',
  'Roboto Medium': 'roboto-latin-500-normal.woff2',
  'Roboto-Medium': 'roboto-latin-500-normal.woff2',
  'Roboto Bold': 'roboto-latin-700-normal.woff2',
  'Roboto-Bold': 'roboto-latin-700-normal.woff2',
}
/** Fuentes de escritorio que en Android no existen */
const DESKTOP_LOCALS = ['Times New Roman', 'TimesNewRomanPSMT', 'Times New Roman Italic', 'TimesNewRomanPS-ItalicMT', 'Arial', 'ArialMT', 'Arial Bold', 'Arial-BoldMT']

const localPattern = (names: string[]) => new RegExp(`local\\((["']?)(${names.map((name) => name.replace(/[-]/g, '\\-')).join('|')})\\1\\)`, 'g')

/** Posición, líneas y ancho del texto del hero con las fuentes web o con un respaldo. */
async function heroLayout(page: Page, mode: Mode) {
  if (mode !== 'web') {
    // @fontsource declara woff2 y woff: se bloquean ambos para que se pinte el respaldo
    await page.route(/\/assets\/.*\.woff2?$/, (route) => route.abort())
  }
  if (mode === 'android') {
    // Simula Android: sin Arial ni Times New Roman, con Roboto y Noto Serif "instaladas"
    await page.route(/\/assets\/.*\.css$/, async (route) => {
      const response = await route.fetch()
      const css = (await response.text())
        .replace(localPattern(DESKTOP_LOCALS), 'local(__ausente__)')
        .replace(localPattern(Object.keys(ANDROID_FONTS)), (_match, _quote, name: string) => `url(/__fixtures__/${ANDROID_FONTS[name]})`)
      await route.fulfill({ response, body: css })
    })
    await page.route('**/__fixtures__/*', (route) =>
      route.fulfill({ contentType: 'font/woff2', body: readFileSync(new URL(`./fixtures/fonts/${route.request().url().split('/').pop()}`, import.meta.url)) }),
    )
  }
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
    const loaded = Array.from(document.fonts)
      .filter((face) => face.status === 'loaded')
      .map((face) => face.family.replace(/["']/g, ''))
    return {
      loaded: [...new Set(loaded)],
      title: measure('#inicio h1'),
      description: measure('#inicio h1 + p'),
      trust: measure('main > section:nth-of-type(2)'),
    }
  })
}

async function layoutIn(browser: import('@playwright/test').Browser, mode: Mode) {
  const page = await browser.newPage()
  const layout = await heroLayout(page, mode)
  await page.close()
  return layout
}

for (const mode of ['desktop', 'android'] as const) {
  test(`el respaldo de ${mode === 'desktop' ? 'escritorio (Times New Roman, Arial)' : 'Android (Noto Serif, Roboto)'} ocupa lo mismo que las fuentes web`, async ({
    browser,
  }) => {
    const web = await layoutIn(browser, 'web')
    const fallback = await layoutIn(browser, mode)

    expect(web.loaded).toContain('Manrope')
    expect(fallback.loaded, 'con las fuentes web bloqueadas se pinta el respaldo').not.toContain('Manrope')
    const expected = mode === 'desktop' ? ['EB Garamond Fallback', 'Manrope Fallback'] : ['EB Garamond Fallback Android', 'Manrope Fallback Android']
    for (const family of expected) expect(fallback.loaded, `se usa ${family}`).toContain(family)
    if (mode === 'android') expect(fallback.loaded, 'sin Arial ni Times New Roman').not.toContain('Manrope Fallback')

    for (const key of ['title', 'description'] as const) {
      expect(fallback[key].lines, `${key}: mismas líneas`).toBe(web[key].lines)
      expect(Math.abs(fallback[key].height - web[key].height), `${key}: misma altura`).toBeLessThanOrEqual(2)
      const widthDelta = Math.abs(fallback[key].textWidth - web[key].textWidth) / web[key].textWidth
      expect(widthDelta, `${key}: ancho del texto dentro de 3 %`).toBeLessThanOrEqual(0.03)
    }
    // Lo que sigue al hero no se mueve
    expect(Math.abs(fallback.trust.top - web.trust.top)).toBeLessThanOrEqual(2)
  })
}
