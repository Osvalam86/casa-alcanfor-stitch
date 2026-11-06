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

/**
 * web: todas las fuentes web · desktop/android: todo con respaldo ·
 * italic-only / normal-only: carga parcial (solo la itálica o solo la redonda de EB Garamond llegó),
 * el estado intermedio que provocaba el salto del título del hero
 */
type Mode = 'web' | 'desktop' | 'android' | 'italic-only' | 'normal-only'

/** Fuentes que se bloquean en cada carga parcial (woff2 y woff de @fontsource) */
const PARTIAL_BLOCK: Partial<Record<Mode, RegExp>> = {
  'italic-only': /\/assets\/eb-garamond-latin-400-normal-[^/]*\.woff2?$/,
  'normal-only': /\/assets\/eb-garamond-latin-400-italic-[^/]*\.woff2?$/,
}

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
  const partial = PARTIAL_BLOCK[mode]
  if (partial) {
    await page.route(partial, (route) => route.abort())
  } else if (mode !== 'web') {
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
    /**
     * Inicio de cada línea del elemento. Se agrupa con tolerancia de media línea: en una misma línea,
     * la itálica y la redonda (o la web y el respaldo) pintan cajas con `top` distinto por 1 px.
     */
    const lineStarts = (element: Element) => {
      const range = document.createRange()
      range.selectNodeContents(element)
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight)
      const starts: number[] = []
      for (const top of Array.from(range.getClientRects(), (rect) => rect.top).sort((a, b) => a - b)) {
        if (!starts.length || top - starts[starts.length - 1] > lineHeight / 2) starts.push(top)
      }
      return { starts, lineHeight }
    }
    const measure = (selector: string) => {
      const element = document.querySelector(selector)!
      const range = document.createRange()
      range.selectNodeContents(element)
      const rects = Array.from(range.getClientRects())
      const lines = lineStarts(element).starts.length
      // Ancho total del texto: detecta un respaldo más ancho o angosto aunque corte en las mismas líneas
      const textWidth = rects.reduce((sum, rect) => sum + rect.width, 0)
      const box = element.getBoundingClientRect()
      return { top: Math.round(box.top), height: Math.round(box.height), lines, textWidth }
    }
    /** La itálica del título: en qué línea empieza, dónde y cuánto mide */
    const emphasis = () => {
      const title = document.querySelector('#inicio h1')!
      const span = title.querySelector('span')!
      const range = document.createRange()
      range.selectNodeContents(span)
      const rects = Array.from(range.getClientRects())
      const titleTop = title.getBoundingClientRect().top
      const { starts, lineHeight } = lineStarts(title)
      return {
        line: starts.findIndex((start) => Math.abs(rects[0].top - start) <= lineHeight / 2),
        top: Math.round(rects[0].top - titleTop),
        left: Math.round(rects[0].left - title.getBoundingClientRect().left),
        width: rects.reduce((sum, rect) => sum + rect.width, 0),
      }
    }
    const loaded = Array.from(document.fonts)
      .filter((face) => face.status === 'loaded')
      .map((face) => `${face.family.replace(/["']/g, '')} ${face.style}`)
    return {
      loaded: [...new Set(loaded)],
      emphasis: emphasis(),
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

    expect(web.loaded).toContain('Manrope normal')
    expect(fallback.loaded, 'con las fuentes web bloqueadas se pinta el respaldo').not.toContain('Manrope normal')
    const expected =
      mode === 'desktop'
        ? ['EB Garamond Fallback normal', 'EB Garamond Fallback italic', 'Manrope Fallback normal']
        : ['EB Garamond Fallback Android normal', 'EB Garamond Fallback Android italic', 'Manrope Fallback Android normal']
    for (const family of expected) expect(fallback.loaded, `se usa ${family}`).toContain(family)
    if (mode === 'android') expect(fallback.loaded, 'sin Arial ni Times New Roman').not.toContain('Manrope Fallback normal')

    // La itálica del título queda en la misma línea y posición, y mide lo mismo (±1 %)
    expect(fallback.emphasis.line, 'itálica: misma línea').toBe(web.emphasis.line)
    expect(Math.abs(fallback.emphasis.top - web.emphasis.top), 'itálica: misma altura').toBeLessThanOrEqual(2)
    expect(Math.abs(fallback.emphasis.width - web.emphasis.width) / web.emphasis.width, 'itálica: mismo ancho').toBeLessThanOrEqual(0.01)

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

/*
 * Carga parcial en escritorio: si una de las dos caras de EB Garamond llega antes que la otra, el título
 * mezcla fuente web y respaldo. Con text-balance, cualquier diferencia de ancho mueve los cortes
 * (antes, con la itálica web y la redonda de respaldo, «se» subía a la segunda línea a 1440 px).
 * Corre en los dos proyectos (390 y 1440 px).
 */
for (const mode of ['italic-only', 'normal-only'] as const) {
  test(`título del hero con carga parcial (${mode === 'italic-only' ? 'solo la itálica web' : 'solo la redonda web'}): mismos cortes y misma itálica`, async ({
    browser,
  }) => {
    const web = await layoutIn(browser, 'web')
    const partial = await layoutIn(browser, mode)

    const [webFace, fallbackFace] = mode === 'italic-only' ? ['EB Garamond italic', 'EB Garamond Fallback normal'] : ['EB Garamond normal', 'EB Garamond Fallback italic']
    expect(partial.loaded, `carga ${webFace}`).toContain(webFace)
    expect(partial.loaded, `y pinta con ${fallbackFace}`).toContain(fallbackFace)

    expect(partial.title.lines, 'mismas líneas').toBe(web.title.lines)
    expect(Math.abs(partial.title.height - web.title.height), 'misma altura').toBeLessThanOrEqual(2)
    expect(partial.emphasis.line, 'la itálica empieza en la misma línea').toBe(web.emphasis.line)
    expect(Math.abs(partial.emphasis.top - web.emphasis.top), 'itálica: misma altura').toBeLessThanOrEqual(2)
    // Si empieza a media línea (390 px: «momento se vuelve…»), su posición sigue al ancho de la redonda:
    // misma tolerancia del 3 % que los anchos de arriba
    expect(Math.abs(partial.emphasis.left - web.emphasis.left), 'itálica: misma posición').toBeLessThanOrEqual(Math.max(2, (web.title.textWidth / web.title.lines) * 0.03))
  })
}
