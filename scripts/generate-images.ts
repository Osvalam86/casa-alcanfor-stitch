/**
 * pnpm images — genera las variantes AVIF de las fotos y su manifiesto tipado.
 *
 * Fuentes: src/assets/images/ (las fotos originales, que no se importan directo en la app).
 * Salida:  src/assets/images/generated/ — un AVIF por ancho y manifest.ts con src, srcSet,
 *          width y height de cada foto. Se versiona: el build no depende de sharp.
 *
 * Anchos: 320, 480, 640, 960 y 1280, sin superar nunca el ancho del original;
 * si el original es menor que 1280, se agrega su propio ancho como variante mayor.
 * `aspect` recorta al centro a la proporción de la caja donde se pinta (object-cover centrado).
 * Criterio: se recorta solo lo que no se ve en ningún ancho de 320 a 1440 px, medido en el build:
 * - hero: caja 4:5 en la landing → 4:5.
 * - galería: celdas de 0.75:1 (vertical) a 1:1 (cuadrada); de la foto (≈1.84:1) solo se ve el 54.5 %
 *   central del ancho en cualquier celda → 1:1, que es la unión de lo visible.
 * - eventos, espacios y mapa: su caja cambia de proporción con el ancho y en algún ancho se ve la foto
 *   completa (o casi: eventos dejan fuera ≤ 1.5 %, por debajo del umbral de 5 % que se considera), así que no se recortan.
 */
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const WIDTHS = [320, 480, 640, 960, 1280]
const AVIF = { quality: 55, effort: 6 } as const

type Source = { file: string; aspect?: [number, number] }

const SOURCES: Source[] = [
  { file: 'hero-vertical.png', aspect: [4, 5] },
  { file: 'event-weddings.webp' },
  { file: 'event-xv.webp' },
  { file: 'event-baptisms.webp' },
  { file: 'event-birthdays.webp' },
  { file: 'event-corporate.webp' },
  { file: 'event-showers.webp' },
  { file: 'space-garden.webp' },
  { file: 'space-salon.webp' },
  { file: 'space-terrace.webp' },
  { file: 'gallery-cocktail-bar.webp', aspect: [1, 1] },
  { file: 'gallery-garden-ceremony.webp', aspect: [1, 1] },
  { file: 'gallery-garden-night.webp', aspect: [1, 1] },
  { file: 'gallery-table-setting.webp', aspect: [1, 1] },
  { file: 'gallery-wedding-entrance.webp', aspect: [1, 1] },
  { file: 'gallery-xv-dance.webp', aspect: [1, 1] },
  { file: 'map.jpg' },
]

const sourceDir = fileURLToPath(new URL('../src/assets/images/', import.meta.url))
const outDir = fileURLToPath(new URL('../src/assets/images/generated/', import.meta.url))

const baseName = (file: string) => file.replace(/\.[^.]+$/, '')
const camel = (name: string) => name.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase())

/** Anchos a generar: los de la escala que caben en el original, más el original si queda entre medias. */
function widthsFor(originalWidth: number) {
  const widths = WIDTHS.filter((width) => width <= originalWidth)
  if (originalWidth < WIDTHS[WIDTHS.length - 1] && !widths.includes(originalWidth)) widths.push(originalWidth)
  return widths
}

// Salida limpia: solo lo que corresponde a las fuentes actuales
await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })

const imports: string[] = []
const entries: string[] = []

for (const source of SOURCES) {
  const name = baseName(source.file)
  const id = camel(name)
  const input = sharp(`${sourceDir}${source.file}`)
  const meta = await input.metadata()
  if (!meta.width || !meta.height) throw new Error(`Sin dimensiones: ${source.file}`)

  // Recorte central a la proporción pedida (sin escalar todavía)
  let cropWidth = meta.width
  let cropHeight = meta.height
  if (source.aspect) {
    const [ratioW, ratioH] = source.aspect
    if (meta.width / meta.height > ratioW / ratioH) cropWidth = Math.round((meta.height * ratioW) / ratioH)
    else cropHeight = Math.round((meta.width * ratioH) / ratioW)
  }
  const crop = {
    left: Math.floor((meta.width - cropWidth) / 2),
    top: Math.floor((meta.height - cropHeight) / 2),
    width: cropWidth,
    height: cropHeight,
  }

  const variants: { width: number; varName: string }[] = []
  for (const width of widthsFor(cropWidth)) {
    const fileName = `${name}-${width}.avif`
    await sharp(`${sourceDir}${source.file}`).extract(crop).resize({ width }).avif(AVIF).toFile(`${outDir}${fileName}`)
    const varName = `${id}${width}`
    imports.push(`import ${varName} from './${fileName}'`)
    variants.push({ width, varName })
  }

  // src de respaldo: la variante de 640 o la mayor disponible por debajo
  const fallback = [...variants].reverse().find((variant) => variant.width <= 640) ?? variants[0]
  const srcSet = variants.map((variant) => `\${${variant.varName}} ${variant.width}w`).join(', ')
  entries.push(`  ${id}: { src: ${fallback.varName}, srcSet: \`${srcSet}\`, width: ${cropWidth}, height: ${cropHeight} },`)
  console.log(`${source.file} → ${variants.map((variant) => variant.width).join(', ')} (${cropWidth}×${cropHeight})`)
}

const manifest = [
  '// Generado por scripts/generate-images.ts (pnpm images). No editar a mano.',
  ...imports,
  '',
  '/** Variantes AVIF de cada foto: src de respaldo, srcSet por ancho y dimensiones intrínsecas (ya recortadas). */',
  'export const images = {',
  ...entries,
  '} as const',
  '',
].join('\n')

await writeFile(`${outDir}manifest.ts`, manifest)
console.log(`Listo: ${SOURCES.length} fotos en src/assets/images/generated/`)
