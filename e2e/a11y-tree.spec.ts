import { expect, test, type CDPSession, type Page } from '@playwright/test'

/**
 * Árbol de accesibilidad de Chrome (CDP), lo que leen NVDA y JAWS, aprendido con NVDA en la otra
 * versión del proyecto:
 * - Texto oculto (sr-only): va en posición absoluta, así que un espacio normal en su borde se colapsa
 *   y el árbol lo pierde; NVDA en modo exploración junta las palabras («Ver detalles y fotosde bodas»).
 *   El separador debe sobrevivir en el árbol (espacio de no separación).
 * - Campos obligatorios: con `required` nativo, Chrome expone invalid=true desde la carga en select e
 *   input de fecha vacíos, y NVDA anuncia «entrada inválida» antes de escribir. Nada es inválido al cargar.
 */

type AXNode = {
  nodeId: string
  ignored: boolean
  role?: { value: string }
  name?: { value: string }
  properties?: { name: string; value: { value: unknown } }[]
  backendDOMNodeId?: number
}
type DOMNode = { nodeType: number; backendNodeId: number; children?: DOMNode[] }

/** Espacio de no separación (U+00A0); `\s` de las expresiones de abajo ya lo incluye */
const NBSP = String.fromCharCode(160)
const SEPARATOR_START = /^[\s,.;:)]/
const SEPARATOR_END = /[\s(]$/

async function axTree(cdp: CDPSession) {
  const { nodes } = (await cdp.send('Accessibility.getFullAXTree')) as { nodes: AXNode[] }
  return nodes
}

/** Texto que el árbol expone para un subárbol del DOM: los StaticText de sus nodos de texto, en orden. */
async function axTextOf(cdp: CDPSession, selector: string, nodes: AXNode[]) {
  const { root } = (await cdp.send('DOM.getDocument', { depth: 0 })) as { root: { nodeId: number } }
  const { nodeId } = (await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector })) as { nodeId: number }
  const { node } = (await cdp.send('DOM.describeNode', { nodeId, depth: -1 })) as { node: DOMNode }
  const textIds: number[] = []
  const walk = (current: DOMNode) => {
    if (current.nodeType === 3) textIds.push(current.backendNodeId)
    for (const child of current.children ?? []) walk(child)
  }
  walk(node)
  const staticText = new Map(
    nodes.filter((ax) => ax.role?.value === 'StaticText' && !ax.ignored).map((ax) => [ax.backendDOMNodeId, ax.name?.value ?? '']),
  )
  return textIds.map((id) => staticText.get(id) ?? '').join('')
}

/**
 * Marca cada texto oculto que toca texto (visible u oculto) dentro de su contenedor (enlace, botón,
 * término, valor, etiqueta…) y devuelve el texto vecino de cada lado tal como está en el DOM.
 */
async function hiddenTextNeighbours(page: Page) {
  return page.evaluate(() => {
    const CONTAINER = 'a, button, p, dt, dd, label, li, h1, h2, h3, h4, figcaption, [role="tab"], [role="status"]'
    const texts = (container: Element) => {
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
      const list: Text[] = []
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.parentElement?.closest('[aria-hidden="true"]')) list.push(node as Text)
      }
      return list
    }
    return Array.from(document.querySelectorAll('.sr-only'))
      .map((element, index) => {
        const container = element.parentElement?.closest(CONTAINER)
        // Sin contenedor, vacío o sin pintar (p. ej. un panel de pestañas oculto): no está en el árbol
        if (!container || !element.textContent?.trim() || !container.getClientRects().length) return null
        const all = texts(container)
        const inside = all.filter((node) => element.contains(node))
        const before = all
          .slice(0, all.indexOf(inside[0]))
          .map((node) => node.textContent)
          .join('')
        const after = all
          .slice(all.indexOf(inside[inside.length - 1]) + 1)
          .map((node) => node.textContent)
          .join('')
        element.setAttribute('data-sr-check', String(index))
        return { index, before, after, where: container.textContent!.trim().slice(0, 60) }
      })
      .filter((item) => item !== null)
  })
}

for (const path of ['/', '/design-system', '/404.html']) {
  test(`texto oculto con sus separadores en el árbol de accesibilidad (${path})`, async ({ page }) => {
    await page.goto(path)
    const cdp = await page.context().newCDPSession(page)
    const pieces = await hiddenTextNeighbours(page)
    expect(pieces.length, 'hay textos ocultos junto a texto').toBeGreaterThan(0)
    const nodes = await axTree(cdp)

    const glued: string[] = []
    for (const piece of pieces) {
      const exposed = await axTextOf(cdp, `[data-sr-check="${piece.index}"]`, nodes)
      if (piece.before.trim() && !SEPARATOR_START.test(exposed)) glued.push(`«${piece.before.trim().slice(-20)}» + «${exposed}» en «${piece.where}»`)
      if (piece.after.trim() && !SEPARATOR_END.test(exposed) && !SEPARATOR_START.test(piece.after)) {
        glued.push(`«${exposed}» + «${piece.after.trim().slice(0, 20)}» en «${piece.where}»`)
      }
    }
    expect(glued, 'palabras que NVDA juntaría').toEqual([])
  })
}

test('textos armados con piezas: se exponen con sus espacios', async ({ page }) => {
  await page.goto('/')
  const cdp = await page.context().newCDPSession(page)
  const nodes = await axTree(cdp)
  const read = async (selector: string) => (await axTextOf(cdp, selector, nodes)).replaceAll(NBSP, ' ')

  // Enlace de la marca: nombre visible + destino oculto
  expect(await read('header a[href="#inicio"]')).toMatch(/Casa Alcanfor.*, ir al inicio$/)
  // Tarjetas de eventos: «Ver detalles y fotos» + el evento
  expect(await read('#eventos a[href*="galeria"]')).toMatch(/^Ver detalles y fotos \S/)
  // Paquetes y pestañas de espacios: botón repetido + su contexto
  expect(await read('#paquetes a')).toMatch(/^\S.* \S/)
  expect(await read('#espacios [role="tabpanel"]:not([hidden]) a')).toMatch(/^\S.* \S/)
  // WhatsApp: nombre + aviso de pestaña nueva
  expect(await read('a[href*="wa.me"]:has(.sr-only)')).toMatch(/WhatsApp \(se abre en una pestaña nueva\)$/)
  // Calificación de los testimonios y cifra de la barra de confianza
  expect(await read('figure p:has(.sr-only)')).toMatch(/^Calificación: \d de 5$/)
  expect(await read('dd:has(.sr-only)')).toBe('4.9 de 5 estrellas')
})

test('al cargar, ningún campo es inválido y los obligatorios se exponen como required', async ({ page }) => {
  await page.goto('/')
  const cdp = await page.context().newCDPSession(page)
  const nodes = await axTree(cdp)
  const invalid = nodes.filter((node) => node.properties?.some((property) => property.name === 'invalid' && property.value.value !== 'false'))
  expect(
    invalid.map((node) => `${node.role?.value} «${node.name?.value}»`),
    'invalid=true al cargar',
  ).toEqual([])

  /*
   * El `required` nativo se cambió por aria-required: siguen anunciándose como obligatorios.
   * Chrome no expone aria-required en un <select> de una línea (combobox), en el input de fecha ni en
   * la casilla (ARIA 1.2 no lo admite en checkbox; 1.3 sí), medido en Chromium de Playwright: ahí lo
   * comunica el nombre, que incluye el indicador visible «Requerido» de la etiqueta (como en todos).
   */
  // Puede haber más de un campo con el mismo nombre (el calculador también tiene «Fecha tentativa»)
  const fields = (name: string) =>
    nodes.filter(
      (node) =>
        node.role?.value !== 'StaticText' &&
        node.role?.value !== 'InlineTextBox' &&
        node.name?.value?.toLowerCase().startsWith(name.toLowerCase()),
    )
  const isRequired = (node: AXNode) => node.properties?.some((property) => property.name === 'required' && property.value.value === true)
  for (const name of ['Nombre completo', 'WhatsApp', 'Correo']) {
    expect(fields(name).some(isRequired), `${name}: required`).toBe(true)
  }
  for (const name of ['Tipo de evento', 'Fecha tentativa', 'Acepto el aviso de privacidad']) {
    expect(fields(name).some((node) => /Requerido/.test(node.name?.value ?? '')), `${name}: «Requerido» en el nombre`).toBe(true)
  }
  // Sin `required` nativo en ningún control de la página
  await expect(page.locator('[required]')).toHaveCount(0)
})
