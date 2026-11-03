/**
 * pnpm icons — genera favicon, íconos y la imagen Open Graph (D17: con Playwright).
 * Fuentes: public/icon.svg (monograma), EB Garamond/Manrope de @fontsource y la foto del hero.
 * Usa el navegador del sistema (Edge por defecto; PW_CHANNEL=chrome para cambiarlo).
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium, type Page } from '@playwright/test'
import { brand, seo } from '../src/content/site.ts'

const root = fileURLToPath(new URL('..', import.meta.url))
const fromRoot = (path: string) => `${root}${path}`

const toBase64 = async (path: string) => (await readFile(fromRoot(path))).toString('base64')

const garamond = await toBase64('node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-400-italic.woff2')
const garamondRegular = await toBase64('node_modules/@fontsource/eb-garamond/files/eb-garamond-latin-400-normal.woff2')
const manrope = await toBase64('node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2')
const heroImage = await toBase64('src/assets/images/hero-wedding.webp')
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

async function renderOgImage(page: Page) {
  const [, subtitle = ''] = seo.title.split(' · ')
  await page.setViewportSize({ width: 1200, height: 630 })
  await page.setContent(`<!doctype html><html lang="es-MX"><head><style>${fontFaces}
    body { width: 1200px; height: 630px; display: grid; grid-template-columns: 1fr 1fr; background: #2f3e36; }
    .copy { padding: 72px 64px; display: flex; flex-direction: column; justify-content: center; gap: 24px; }
    .eyebrow { font-family: 'Manrope'; font-weight: 600; font-size: 20px; letter-spacing: .15em; text-transform: uppercase; color: #e7c08b; }
    h1 { font-family: 'EB Garamond'; font-weight: 400; font-size: 96px; line-height: 1; color: #fef9f1; }
    p { font-family: 'EB Garamond'; font-style: italic; font-size: 40px; line-height: 1.2; color: #ece8e0; }
    .photo { position: relative; margin: 48px 48px 0 0; border-radius: 9999px 9999px 0 0; overflow: hidden; border: 6px solid #e7c08b; border-bottom: 0; }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
  </style></head><body>
    <div class="copy">
      <span class="eyebrow">${brand.tagline}</span>
      <h1>${brand.name}</h1>
      <p>${subtitle}</p>
    </div>
    <div class="photo"><img alt="" src="data:image/webp;base64,${heroImage}"></div>
  </body></html>`)
  await page.evaluate(() => document.fonts.ready)
  await page.locator('img').evaluate((img: HTMLImageElement) => img.decode())
  return page.screenshot({ type: 'jpeg', quality: 85 })
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

  outputs.push(['public/og-image.jpg', await renderOgImage(page)])

  for (const [path, data] of outputs) {
    await writeFile(fromRoot(path), data)
    console.log(`✓ ${path} (${Math.round(data.length / 1024)} KB)`)
  }
} finally {
  await browser.close()
}
