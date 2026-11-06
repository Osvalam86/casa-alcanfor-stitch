/**
 * pnpm screens — capturas del README contra el build (dist/), servido con la API de vite preview.
 * Salida: docs/screens/ en JPEG (sharp con mozjpeg), a 360 px y 1440 px:
 * - Páginas completas, a 1×: la landing, /design-system y la 404.
 * - Secciones clave de la landing, a la densidad del viewport (2× en 360, 1× en 1440):
 *   hero, eventos, espacios, galería y contacto.
 * Las secciones se recortan de la captura de página completa (con el scroll arriba), así que el
 * header sticky queda en su sitio y no se encima sobre ellas.
 * Con prefers-reduced-motion: reduce, para que ninguna transición quede a medias.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium, type Browser, type Page } from '@playwright/test'
import sharp from 'sharp'
import { preview } from 'vite'

const root = fileURLToPath(new URL('..', import.meta.url))
const OUT_DIR = `${root}docs/screens/`
const PORT = 4175
// JPEG y no WebP: WebP no pasa de 16 383 px de alto y la landing móvil mide más incluso a 1×
const JPEG = { quality: 82, mozjpeg: true } as const

const VIEWPORTS = [
  { name: '360', width: 360, height: 800, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: '1440', width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
] as const

const PAGES = [
  { name: 'landing', path: '/' },
  { name: 'design-system', path: '/design-system' },
  { name: '404', path: '/404.html' },
] as const

/** Secciones de la landing (id del ancla → nombre del archivo) */
const SECTIONS = [
  { id: 'inicio', name: 'hero' },
  { id: 'eventos', name: 'events' },
  { id: 'espacios', name: 'spaces' },
  { id: 'galeria', name: 'gallery' },
  { id: 'contacto', name: 'contact' },
] as const

/** Recorre la página para que carguen las fotos diferidas, espera a que todas decodifiquen y vuelve arriba. */
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
    window.scrollTo({ top: 0, behavior: 'instant' })
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  })
}

async function save(name: string, png: Buffer) {
  const jpeg = await sharp(png).jpeg(JPEG).toBuffer()
  await writeFile(`${OUT_DIR}${name}.jpg`, jpeg)
  console.log(`✓ docs/screens/${name}.jpg (${Math.round(jpeg.length / 1024)} KB)`)
}

async function capture(browser: Browser, baseUrl: string) {
  for (const { name: viewportName, width, height, deviceScaleFactor, isMobile, hasTouch } of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor,
      isMobile,
      hasTouch,
      locale: 'es-MX',
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()

    for (const { name, path } of PAGES) {
      await page.goto(`${baseUrl}${path}`, { waitUntil: 'networkidle' })
      await settle(page)
      const full = await page.screenshot({ fullPage: true, type: 'png' })
      // Página completa a 1× (ancho en px CSS), para que pese poco en el repo.
      // Las secciones sí conservan la densidad del viewport.
      await save(`${name}-${viewportName}`, await sharp(full).resize({ width }).png().toBuffer())

      if (name !== 'landing') continue
      // Los recortes de sección van sin lo fijo (botón de WhatsApp, barra móvil): en la captura de
      // página completa quedan donde estaban en la primera pantalla y se encimarían sobre el hero
      await page.evaluate(() => {
        for (const element of document.querySelectorAll<HTMLElement>('body *')) {
          if (getComputedStyle(element).position === 'fixed') element.style.visibility = 'hidden'
        }
      })
      const clean = await page.screenshot({ fullPage: true, type: 'png' })
      for (const section of SECTIONS) {
        // Caja en coordenadas del documento (scroll arriba), en píxeles CSS
        const box = await page.locator(`#${section.id}`).evaluate((element) => {
          const rect = element.getBoundingClientRect()
          return { left: rect.left + window.scrollX, top: rect.top + window.scrollY, width: rect.width, height: rect.height }
        })
        const crop = {
          left: Math.round(box.left * deviceScaleFactor),
          top: Math.round(box.top * deviceScaleFactor),
          width: Math.round(box.width * deviceScaleFactor),
          height: Math.round(box.height * deviceScaleFactor),
        }
        await save(`landing-${section.name}-${viewportName}`, await sharp(clean).extract(crop).png().toBuffer())
      }
    }

    await context.close()
  }
}

await mkdir(OUT_DIR, { recursive: true })
const server = await preview({ preview: { port: PORT, strictPort: true, open: false }, logLevel: 'warn' })
const browser = await chromium.launch()
try {
  await capture(browser, `http://localhost:${PORT}`)
} finally {
  await browser.close()
  await server.close()
}
