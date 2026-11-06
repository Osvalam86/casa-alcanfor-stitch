import { expect, test } from '@playwright/test'
import { business, seo } from '../src/content/site.ts'
import { buildJsonLd } from '../src/lib/seo/jsonld.ts'

/**
 * JSON-LD del negocio: la imagen representa el lugar (la foto del hero en JPG, generada por pnpm images),
 * no la imagen Open Graph, que es una maqueta. Las pruebas corren sin VITE_SITE_URL: aquí se arma el
 * JSON-LD con y sin dominio, y se comprueba que el build sirve la foto.
 */

test('con dominio, la imagen del JSON-LD es la foto del hero con URL absoluta', () => {
  const data = buildJsonLd(business, { siteUrl: 'https://casa-alcanfor.test/' })
  expect(data.image).toBe('https://casa-alcanfor.test/images/hero.jpg')
  expect(data.image).not.toContain(seo.ogImage.path)
  expect(data.url).toBe('https://casa-alcanfor.test/')
})

test('sin dominio, el JSON-LD omite imagen y URL', () => {
  const data = buildJsonLd(business, {})
  expect(data).not.toHaveProperty('image')
  expect(data).not.toHaveProperty('url')
})

test('el build sirve la foto del lugar en JPG', async ({ request }) => {
  const response = await request.get(business.image.path)
  expect(response.ok()).toBe(true)
  expect(response.headers()['content-type']).toContain('image/jpeg')
})
