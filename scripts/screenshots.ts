/**
 * pnpm screens — capturas del README contra el build (dist/), servido con la API de vite preview.
 * Salida: docs/screens/, 4 recortes de sección de la landing en JPEG calidad 92 (sharp con mozjpeg), a 2×:
 * - Escritorio (1440 px): hero y eventos.
 * - Móvil (360 px): hero y galería.
 * El directorio se vacía antes de generar, para que no queden capturas viejas.
 * Cada recorte sale de la página con el scroll arriba (el header sticky queda en su sitio y no se
 * encima) y sin lo fijo (botón de WhatsApp, barra móvil), que si no aparecería sobre el hero.
 * Con prefers-reduced-motion: reduce, para que ninguna transición quede a medias.
 */
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium, type Browser, type Page } from '@playwright/test'
import sharp from 'sharp'
import { preview } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const OUT_DIR = `${root}docs/screens/`
const PORT = 4175
const JPEG = { quality: 92, mozjpeg: true } as const
const DEVICE_SCALE_FACTOR = 2

/** Por ancho: las secciones de la landing (id del ancla → nombre del archivo) */
const SHOTS = [
  {
    name: '1440',
    viewport: { width: 1440, height: 900 },
    isMobile: false,
    sections: [
      { id: 'inicio', name: 'hero' },
      { id: 'eventos', name: 'events' },
    ],
  },
  {
    name: '360',
    viewport: { width: 360, height: 800 },
    isMobile: true,
    sections: [
      { id: 'inicio', name: 'hero' },
      { id: 'galeria', name: 'gallery' },
    ],
  },
] as const

/** Recorre la página para que carguen las fotos diferidas, espera a que decodifiquen, oculta lo fijo y vuelve arriba. */
async function settle(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    const step = window.innerHeight * 0.8
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' })
      await new Promise((resolve) => setTimeout(resolve, 120))
    }
    // Solo las visibles: una foto diferida dentro de un panel oculto (pestañas) nunca carga y su
    // decode() no termina. Cada espera tiene además un tope, para no colgar el script.
    const visible = Array.from(document.images).filter((image) => image.getClientRects().length > 0)
    const withTimeout = (promise: Promise<unknown>) => Promise.race([promise, new Promise((resolve) => setTimeout(resolve, 5000))])
    await Promise.all(visible.map((image) => withTimeout(image.decode().catch(() => undefined))))
    for (const element of document.querySelectorAll<HTMLElement>('body *')) {
      if (getComputedStyle(element).position === 'fixed') element.style.visibility = 'hidden'
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  })
}

async function capture(browser: Browser, baseUrl: string) {
  let total = 0
  for (const { name: viewportName, viewport, isMobile, sections } of SHOTS) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: DEVICE_SCALE_FACTOR,
      isMobile,
      hasTouch: isMobile,
      locale: 'es-MX',
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    await page.goto(baseUrl, { waitUntil: 'networkidle' })
    await settle(page)

    for (const section of sections) {
      // Caja en coordenadas del documento (scroll arriba), en px CSS: con fullPage, clip las usa tal cual
      const clip = await page.locator(`#${section.id}`).evaluate((element) => {
        const rect = element.getBoundingClientRect()
        return { x: rect.left + window.scrollX, y: rect.top + window.scrollY, width: rect.width, height: rect.height }
      })
      const png = await page.screenshot({ fullPage: true, clip, type: 'png' })
      const jpeg = await sharp(png).jpeg(JPEG).toBuffer()
      const file = `landing-${section.name}-${viewportName}.jpg`
      await writeFile(`${OUT_DIR}${file}`, jpeg)
      total += jpeg.length
      console.log(`✓ docs/screens/${file} (${Math.round(jpeg.length / 1024)} KB)`)
    }

    await context.close()
  }
  console.log(`Total: ${Math.round(total / 1024)} KB`)
}

await rm(OUT_DIR, { recursive: true, force: true })
await mkdir(OUT_DIR, { recursive: true })
const server = await preview({ preview: { port: PORT, strictPort: true, open: false }, logLevel: 'warn' })
const browser = await chromium.launch()
try {
  await capture(browser, `http://localhost:${PORT}`)
} finally {
  await browser.close()
  await server.close()
}
