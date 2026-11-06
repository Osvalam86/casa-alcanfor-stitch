/**
 * pnpm icons — genera favicon e íconos (D17: con Playwright).
 * Fuentes: public/icon.svg (monograma) y EB Garamond/Manrope de @fontsource.
 * La imagen Open Graph (public/og-image.jpg, 1200×630) se diseña aparte y no la toca este script.
 * Usa el navegador del sistema (Edge por defecto; PW_CHANNEL=chrome para cambiarlo).
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium, type Page } from '@playwright/test'

const root = fileURLToPath(new URL('..', import.meta.url))
const fromRoot = (path: string) => `${root}${path}`

const toBase64 = async (path: string) => (await readFile(fromRoot(path))).toString('base64')

const garamond = await toBase64('node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-400-italic.woff2')
const garamondRegular = await toBase64('node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-400-normal.woff2')
const manrope = await toBase64('node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2')
const iconSvg = await readFile(fromRoot('public/icon.svg'), 'utf8')

const fontFaces = `
  @font-face { font-family: 'EB Garamond'; font-style: italic; font-weight: 400; src: url(data:font/woff2;base64,${garamond}) format('woff2'); }
  @font-face { font-family: 'EB Garamond'; font-style: normal; font-weight: 400; src: url(data:font/woff2;base64,${garamondRegular}) format('woff2'); }
  @font-face { font-family: 'Manrope'; font-weight: 600; src: url(data:font/woff2;base64,${manrope}) format('woff2'); }
  * { margin: 0; padding: 0; box-sizing: border-box; }
`

/** Ícono a tamaño `size`. `square`: sin esquinas redondeadas (iOS y maskable). `scale`: zona segura. */
async function renderIcon(page: Page, size: number, options: { square?: boolean; scale?: number } = {}) {
  const svg = options.square ? iconSvg.replace('rx="112"', 'rx="0"') : iconSvg
  const scale = options.scale ?? 1
  const inner = options.square && scale < 1
    ? // Fondo completo + monograma reducido al centro (zona segura del ícono maskable)
      `<div style="width:${size}px;height:${size}px;background:#2f3e36;display:grid;place-items:center">
         <div style="width:${size * scale}px;height:${size * scale}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div>
       </div>`
    : `<div style="width:${size}px;height:${size}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div>`

  await page.setViewportSize({ width: size, height: size })
  await page.setContent(`<!doctype html><html><head><style>${fontFaces} html,body{background:transparent}</style></head><body>${inner}</body></html>`)
  await page.evaluate(() => document.fonts.ready)
  return page.screenshot({ type: 'png', omitBackground: !options.square })
}

/** Empaqueta PNGs en un .ico (entradas PNG, válidas desde Windows Vista). */
function buildIco(images: { size: number; png: Buffer }[]) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)

  let offset = 6 + images.length * 16
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0)
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt8(0, 2)
    entry.writeUInt8(0, 3)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(png.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += png.length
    return entry
  })

  return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)])
}

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL ?? 'msedge' })
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 })

  const outputs: [string, Buffer][] = [
    ['public/apple-touch-icon.png', await renderIcon(page, 180, { square: true })],
    ['public/icon-192.png', await renderIcon(page, 192)],
    ['public/icon-512.png', await renderIcon(page, 512)],
    ['public/icon-maskable-512.png', await renderIcon(page, 512, { square: true, scale: 0.8 })],
  ]

  const icoSizes = [16, 32, 48]
  const icoImages = []
  for (const size of icoSizes) icoImages.push({ size, png: await renderIcon(page, size) })
  outputs.push(['public/favicon.ico', buildIco(icoImages)])

  for (const [path, data] of outputs) {
    await writeFile(fromRoot(path), data)
    console.log(`✓ ${path} (${Math.round(data.length / 1024)} KB)`)
  }
} finally {
  await browser.close()
}
