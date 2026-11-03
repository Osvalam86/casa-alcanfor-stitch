import type { HtmlTagDescriptor, Plugin } from 'vite'
import { brand, business, seo } from '../src/content/site.ts'
import { buildJsonLd } from '../src/lib/seo/jsonld.ts'

/**
 * Metadatos de la sección 8 del CLAUDE.md, generados desde content/:
 * description, theme-color, íconos, manifest, Open Graph, Twitter Card y JSON-LD.
 * Lo que depende del dominio (canonical, og:url, URLs absolutas, sitemap) usa
 * VITE_SITE_URL; si está vacía, se omite.
 */
export function seoPlugin(rawSiteUrl: string | undefined): Plugin {
  const siteUrl = rawSiteUrl?.trim().replace(/\/+$/, '') || undefined

  const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'meta', attrs, injectTo: 'head' })
  const link = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'link', attrs, injectTo: 'head' })

  function headTags(): HtmlTagDescriptor[] {
    const tags: HtmlTagDescriptor[] = [
      meta({ name: 'description', content: seo.description }),
      meta({ name: 'theme-color', content: seo.themeColor }),
      link({ rel: 'icon', href: '/favicon.ico', sizes: '32x32' }),
      link({ rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' }),
      link({ rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }),
      link({ rel: 'manifest', href: '/site.webmanifest' }),
      meta({ property: 'og:type', content: 'website' }),
      meta({ property: 'og:locale', content: seo.locale }),
      meta({ property: 'og:site_name', content: brand.name }),
      meta({ property: 'og:title', content: seo.title }),
      meta({ property: 'og:description', content: seo.description }),
      meta({ name: 'twitter:card', content: 'summary_large_image' }),
      meta({ name: 'twitter:title', content: seo.title }),
      meta({ name: 'twitter:description', content: seo.description }),
    ]

    if (siteUrl) {
      const image = `${siteUrl}${seo.ogImage.path}`
      tags.push(
        link({ rel: 'canonical', href: `${siteUrl}/` }),
        meta({ property: 'og:url', content: `${siteUrl}/` }),
        meta({ property: 'og:image', content: image }),
        meta({ property: 'og:image:width', content: String(seo.ogImage.width) }),
        meta({ property: 'og:image:height', content: String(seo.ogImage.height) }),
        meta({ property: 'og:image:alt', content: seo.ogImage.alt }),
        meta({ name: 'twitter:image', content: image }),
        meta({ name: 'twitter:image:alt', content: seo.ogImage.alt }),
      )
    }

    tags.push({
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      children: JSON.stringify(buildJsonLd(business, { siteUrl, imagePath: seo.ogImage.path })),
      injectTo: 'head',
    })

    return tags
  }

  return {
    name: 'casa-alcanfor-seo',
    transformIndexHtml() {
      return headTags()
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /']
      if (siteUrl) {
        robots.push(`Sitemap: ${siteUrl}/sitemap.xml`)
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            `  <url><loc>${siteUrl}/</loc></url>`,
            '</urlset>',
            '',
          ].join('\n'),
        })
      }
      // Las páginas internas (/design-system) llevan noindex; no se bloquean aquí
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots.join('\n')}\n` })
    },
  }
}
