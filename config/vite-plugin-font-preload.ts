import type { HtmlTagDescriptor, Plugin } from 'vite'

/**
 * Precarga en el build la fuente del LCP en móvil (el párrafo del hero, Manrope 400).
 * Los nombres llevan hash, así que se busca en el bundle por su prefijo de @fontsource.
 *
 * Medido con Lighthouse (throttling real, mediana de 5, 360 y 1440 px):
 * - precargar las 4 fuentes del hero (Garamond 400 normal e itálica, Manrope 400 y 600, ~76 KB)
 *   retrasó el FCP/LCP móvil de 2.61 a 2.92 s: compiten con el JS, que es quien pinta la página
 * - precargar solo Manrope 400 (14 KB) queda igual que no precargar (2.61 s) y adelanta la fuente
 *   en visitas con el JS en caché
 * El salto de layout (CLS) lo evitan las fuentes de respaldo con métricas ajustadas (fonts.css), no la precarga.
 */
const PRELOADED_FONTS = ['manrope-latin-400-normal'] as const

export function fontPreloadPlugin(): Plugin {
  return {
    name: 'casa-alcanfor-font-preload',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        // Solo en build: en dev no hay bundle ni nombres con hash
        if (!ctx.bundle) return
        const fileNames = Object.keys(ctx.bundle)
        const tags: HtmlTagDescriptor[] = PRELOADED_FONTS.map((prefix) => {
          const fileName = fileNames.find((name) => name.startsWith(`assets/${prefix}-`) && name.endsWith('.woff2'))
          if (!fileName) throw new Error(`Fuente a precargar sin archivo en el bundle: ${prefix}`)
          return {
            tag: 'link',
            attrs: { rel: 'preload', href: `/${fileName}`, as: 'font', type: 'font/woff2', crossorigin: '' },
            injectTo: 'head-prepend',
          }
        })
        return tags
      },
    },
  }
}
