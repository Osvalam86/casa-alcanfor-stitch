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
 * - galería: fotos generadas ya a la proporción de su celda. Las verticales (3:4) cubren su celda
 *   3:4 desde md y, recortadas al centro por object-cover, la cuadrada de móvil; se ven completas a lo
 *   ancho en ambas, así que solo se ajustan a 3:4 exacto (896×1200 → 896×1195). Las cuadradas, 1:1.
 * - eventos, espacios y mapa: su caja cambia de proporción con el ancho y en algún ancho se ve la foto
 *   completa (o casi: eventos dejan fuera ≤ 1.5 %, por debajo del umbral de 5 % que se considera), así que no se recortan.
 * - eventos, además: miniatura cuadrada de la tarjeta compacta (móvil) → recorte 1:1 aparte (`-square`).
 */
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const WIDTHS = [320, 480, 640, 960, 1280]
const AVIF = { quality: 55, effort: 6 } as const

/** `name`: nombre de salida cuando una misma foto se recorta a más de una proporción */
type Source = { file: string; name?: string; aspect?: [number, number] }

/** Eventos: la foto completa (tarjeta vertical) y un recorte 1:1 (miniatura de la tarjeta compacta en móvil) */
const EVENT_FILES = ['event-weddings', 'event-xv', 'event-baptisms', 'event-birthdays', 'event-corporate', 'event-showers']

const SOURCES: Source[] = [
  { file: 'hero-vertical.png', aspect: [4, 5] },
  ...EVENT_FILES.flatMap((name): Source[] => [
    { file: `${name}.webp` },
    { file: `${name}.webp`, name: `${name}-square`, aspect: [1, 1] },
  ]),
  { file: 'space-garden.webp' },
  { file: 'space-salon.webp' },
  { file: 'space-terrace.webp' },
  // Galería (Stitch, 896×1200 y 1024×1024): verticales 3:4 y cuadradas 1:1
  { file: 'gallery-cocktail-bar.png', aspect: [3, 4] },
  { file: 'gallery-table-setting.png', aspect: [3, 4] },
  { file: 'gallery-wedding-entrance.png', aspect: [3, 4] },
  { file: 'gallery-garden-ceremony.png', aspect: [1, 1] },
  { file: 'gallery-garden-night.png', aspect: [1, 1] },
  { file: 'gallery-xv-dance.png', aspect: [1, 1] },
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
  const name = source.name ?? baseName(source.file)
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
