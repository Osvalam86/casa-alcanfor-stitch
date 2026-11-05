import { expect, test, type Page } from '@playwright/test'

/**
 * El sizes de cada foto visible cubre el ancho con que se dibuja (el navegador elige
 * la variante del srcset a partir de sizes, antes de conocer el layout).
 * Con object-cover, la foto se escala hasta cubrir la caja: si la caja es más alta que la
 * proporción de la foto, se dibuja más ancha que la caja → ancho dibujado = max(caja, alto × proporción),
 * con la proporción de los atributos width/height (la del archivo, ya recortado).
 * Además no sobra más de un 25 %: un sizes muy holgado descarga variantes de más.
 * Se resuelve como el navegador: primera condición de media que cumple y su longitud en px.
 *
 * Recorte en origen (pnpm images): las fotos de celdas cuadradas llegan ya en 1:1, así que
 * se dibujan exactamente al ancho de la caja y su sizes es el ancho de la caja.
 */

const PAGES = ['/', '/design-system'] as const
const WIDTHS = [
  { width: 360, height: 800 },
  { width: 1440, height: 900 },
] as const

async function sizesReport(page: Page) {
  return page.evaluate(() => {
    const toPx = (length: string) => {
      const probe = document.createElement('div')
      probe.style.cssText = `position:absolute;visibility:hidden;width:${length}`
      document.body.append(probe)
      const px = probe.getBoundingClientRect().width
      probe.remove()
      return px
    }
    const resolve = (sizes: string) => {
      // Separa por comas que no estén dentro de paréntesis (calc, condiciones de media)
      for (const raw of sizes.split(/,(?![^(]*\))/)) {
        const entry = raw.trim()
        if (!entry.startsWith('(')) return toPx(entry)
        let depth = 0
        let end = 0
        for (; end < entry.length; end += 1) {
          if (entry[end] === '(') depth += 1
          if (entry[end] === ')') depth -= 1
          if (depth === 0) break
        }
        if (matchMedia(entry.slice(0, end + 1)).matches) return toPx(entry.slice(end + 1).trim())
      }
      return window.innerWidth
    }
    return Array.from(document.images)
      .filter((img) => img.checkVisibility())
      .map((img) => {
        const box = img.getBoundingClientRect()
        const ratio = Number(img.getAttribute('width')) / Number(img.getAttribute('height'))
        const cover = getComputedStyle(img).objectFit === 'cover' && Number.isFinite(ratio) && ratio > 0
        return {
          name: img.alt.slice(0, 40) || img.getAttribute('src')!,
          hasSrcset: Boolean(img.getAttribute('srcset')),
          hasDimensions: Number.isFinite(ratio) && ratio > 0,
          sizes: img.getAttribute('sizes'),
          // Celda cuadrada (aspect-ratio 1 / 1 en la caja que la contiene)
          squareCell: getComputedStyle(img.parentElement!).aspectRatio === '1 / 1',
          box: box.width,
          drawn: cover ? Math.max(box.width, box.height * ratio) : box.width,
          resolved: img.getAttribute('sizes') ? resolve(img.getAttribute('sizes')!) : null,
        }
      })
  })
}

for (const viewport of WIDTHS) {
  test.describe(`sizes a ${viewport.width} px`, () => {
    test.use({ viewport })
    for (const path of PAGES) {
      test(`cubre el ancho pintado en ${path}`, async ({ page }, testInfo) => {
        // El viewport lo fija este bloque: basta con un proyecto
        test.skip(testInfo.project.name !== 'desktop-1440', 'El viewport lo define la prueba')
        await page.goto(path)
        const report = await sizesReport(page)
        expect(report.length).toBeGreaterThan(0)
        for (const image of report) {
          expect.soft(image.hasSrcset, `${image.name}: srcset`).toBe(true)
          expect.soft(image.hasDimensions, `${image.name}: width y height`).toBe(true)
          expect.soft(image.sizes, `${image.name}: sizes`).not.toBeNull()
          if (image.squareCell) {
            expect.soft(image.drawn, `${image.name}: celda cuadrada, foto recortada a 1:1 (se dibuja al ancho de la caja)`).toBeLessThanOrEqual(image.box + 1)
          }
          if (image.resolved === null) continue
          expect.soft(image.resolved, `${image.name}: sizes (${image.sizes}) cubre ${image.drawn.toFixed(1)} px dibujados`).toBeGreaterThanOrEqual(image.drawn - 1)
          expect.soft(image.resolved, `${image.name}: sizes no sobra más del 25 % sobre ${image.drawn.toFixed(1)} px`).toBeLessThanOrEqual(image.drawn * 1.25)
        }
      })
    }
  })
}
