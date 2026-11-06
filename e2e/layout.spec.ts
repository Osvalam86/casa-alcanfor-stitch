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
    // Arranque corto: la mayoría de los Tab no desplazan y se recorren cientos de elementos
    const moved = await waitForScrollEnd(page, { startTimeoutMs: 150, quietMs: 150 })
    // Si hubo scroll, la barra móvil pudo cambiar de estado a mitad de camino: useActionBar corrige
    // el foco 150 ms después de que el scroll se detiene. Se mide el estado ya asentado.
    if (moved) await waitForScrollEnd(page, { startTimeoutMs: 400, quietMs: 150 })
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

/**
 * Franja de aviso + header sticky, con la página arriba (cuando ambos se ven juntos):
 * no ocupan más de un tercio de la altura del viewport.
 */
async function expectTopChromeWithinThird(page: Page) {
  await page.goto('/')
  const { stacked, viewport } = await page.evaluate(() => ({
    stacked: document.querySelector('header')!.getBoundingClientRect().bottom - document.querySelector('aside')!.getBoundingClientRect().top,
    viewport: window.innerHeight,
  }))
  expect(stacked).toBeLessThanOrEqual(viewport / 3)
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
  test('franja de aviso + header: máximo un tercio de la pantalla', async ({ page }) => {
    await expectTopChromeWithinThird(page)
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
  test('franja de aviso + header: máximo un tercio de la pantalla', async ({ page }) => {
    await expectTopChromeWithinThird(page)
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

test('aviso de proyecto conceptual: estático arriba del header, que queda pegado al desplazar', async ({ page }) => {
  await page.goto('/')
  const notice = page.getByRole('complementary', { name: 'Aviso' })
  await expect(notice).toHaveText('Proyecto conceptual · Negocio, datos y reseñas ficticios')

  // Arriba: la franja ocupa el borde superior y el header empieza justo debajo
  const top = await page.evaluate(() => {
    const aside = document.querySelector('aside')!.getBoundingClientRect()
    const header = document.querySelector('header')!.getBoundingClientRect()
    return { asideTop: aside.top, gap: header.top - aside.bottom }
  })
  expect(top.asideTop).toBe(0)
  expect(Math.abs(top.gap)).toBeLessThanOrEqual(1)

  // Desplazada: la franja se va con el scroll (no es fija) y el header queda en el borde
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }))
  await waitForScrollEnd(page, { startTimeoutMs: 300 })
  const scrolled = await page.evaluate(() => ({
    asideBottom: document.querySelector('aside')!.getBoundingClientRect().bottom,
    headerTop: document.querySelector('header')!.getBoundingClientRect().top,
  }))
  expect(scrolled.asideBottom).toBeLessThanOrEqual(0)
  expect(Math.abs(scrolled.headerTop)).toBeLessThanOrEqual(1)
})

test.describe('píldora del hero', () => {
  for (const width of [360, 390]) {
    test(`en una línea a ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto('/')
      await page.evaluate(() => document.fonts.ready)
      const badge = page.locator('#inicio').getByText('Jardín & salón de eventos en Zapopan')
      // Solo el nodo de texto (el punto decorativo es otra caja, centrada en vertical)
      const lines = await badge.evaluate((element) => {
        const text = Array.from(element.childNodes).find((node) => node.nodeType === Node.TEXT_NODE)!
        const range = document.createRange()
        range.selectNodeContents(text)
        return new Set(Array.from(range.getClientRects()).map((rect) => Math.round(rect.top))).size
      })
      expect(lines).toBe(1)
    })
  }
})

test.describe('Momentos memorables', () => {
  for (const { width, layout } of [
    { width: 320, layout: 'compact' },
    { width: 360, layout: 'compact' },
    { width: 595, layout: 'compact' },
    { width: 640, layout: 'vertical' },
    { width: 1440, layout: 'vertical' },
  ] as const) {
    test(`${width} px: tarjetas ${layout === 'compact' ? 'compactas en una columna, sin carrusel' : 'verticales en rejilla'}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      const section = page.locator('#eventos')
      // Sin región desplazable horizontal
      await expect(section.getByRole('region')).toHaveCount(0)
      const cards = section.locator('article')
      await expect(cards).toHaveCount(6)
      const info = await cards.evaluateAll((articles) =>
        articles.map((article) => {
          const card = article.getBoundingClientRect()
          const styles = getComputedStyle(article)
          const inner = card.width - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight)
          const thumb = Array.from(article.querySelectorAll('img')).find((img) => img.checkVisibility())!.getBoundingClientRect()
          const title = article.querySelector('h3, h4')!.getBoundingClientRect()
          const description = Array.from(article.querySelectorAll('p')).find((p) => p.checkVisibility() && (p.textContent ?? '').length > 60)!
          const text = description.getBoundingClientRect()
          return {
            display: styles.display,
            direction: styles.flexDirection,
            left: Math.round(card.left),
            right: card.right,
            // Compacta: título al lado de la miniatura y descripción debajo, a todo el ancho interior
            titleBesideThumb: title.left >= thumb.right && title.top < thumb.bottom,
            descriptionBelowThumb: text.top >= thumb.bottom,
            descriptionFullWidth: Math.abs(text.width - inner) <= 1,
          }
        }),
      )
      for (const card of info) {
        // Ninguna tarjeta se sale del ancho de la pantalla
        expect(card.right).toBeLessThanOrEqual(width)
        if (layout === 'compact') {
          expect(card.display).toBe('grid')
          expect(card.titleBesideThumb, 'título junto a la miniatura').toBe(true)
          expect(card.descriptionBelowThumb, 'descripción debajo de la fila de la miniatura').toBe(true)
          expect(card.descriptionFullWidth, 'descripción a todo el ancho de la tarjeta').toBe(true)
        } else {
          expect(card.display).toBe('flex')
          expect(card.direction).toBe('column')
        }
      }
      const columns = new Set(info.map((card) => card.left)).size
      if (layout === 'compact') expect(columns).toBe(1)
      else expect(columns).toBeGreaterThan(1)
    })
  }
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
