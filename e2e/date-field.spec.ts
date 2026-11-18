import { expect, test, type Locator, type Page } from '@playwright/test'

/**
 * Campo de fecha con el ícono "calendar-today" del sitio (Input type="date"), en el verificador de disponibilidad y
 * en el formulario de cotización. Se compara con la flecha del Select del mismo formulario:
 * - el ícono es decorativo y tiene el mismo tamaño y lugar que la flecha, también con error (borde de 2 px);
 * - el indicador nativo queda transparente (sin display: none), del tamaño del ícono y justo encima de él;
 * - el padding derecho de la fecha es el del Select.
 * Corre en Chromium; el comportamiento de Firefox (sin ícono propio) se revisa a mano.
 */

type Box = { left: number; right: number; top: number; bottom: number; width: number; height: number }

const FORMS = [
  { name: 'verificador de disponibilidad', form: 'form:has(input[type="date"]):not(:has(#quote-date))' },
  { name: 'formulario de cotización', form: 'form:has(#quote-date)' },
] as const

async function box(locator: Locator): Promise<Box> {
  const rect = await locator.evaluate((el) => el.getBoundingClientRect().toJSON() as DOMRect)
  return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height }
}

type CdpNode = {
  nodeId: number
  attributes?: string[]
  children?: CdpNode[]
  shadowRoots?: CdpNode[]
}

/** Busca en el árbol (con shadow roots) el primer nodo con ese atributo y valor. */
function findNode(node: CdpNode, name: string, value: string): CdpNode | undefined {
  const attrs = node.attributes ?? []
  for (let i = 0; i < attrs.length; i += 2) if (attrs[i] === name && attrs[i + 1] === value) return node
  for (const child of [...(node.shadowRoots ?? []), ...(node.children ?? [])]) {
    const found = findNode(child, name, value)
    if (found) return found
  }
  return undefined
}

/**
 * Indicador nativo real, leído por CDP en el shadow DOM del navegador (getComputedStyle no lee ese pseudoelemento):
 * su caja en pantalla, display, opacity y position.
 */
async function indicatorBox(page: Page, inputId: string) {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('DOM.enable')
  await cdp.send('CSS.enable')
  const { root } = (await cdp.send('DOM.getDocument', { depth: -1, pierce: true })) as { root: CdpNode }
  const input = findNode(root, 'id', inputId)
  const indicator = input && findNode(input, 'pseudo', '-webkit-calendar-picker-indicator')
  if (!indicator) throw new Error('No se encontró el indicador nativo')
  const { computedStyle } = (await cdp.send('CSS.getComputedStyleForNode', { nodeId: indicator.nodeId })) as {
    computedStyle: { name: string; value: string }[]
  }
  const style = (name: string) => computedStyle.find((p) => p.name === name)?.value
  const display = style('display')
  // Con display: none no hay caja (getBoxModel falla): la prueba lo reporta con la aserción de display
  let box: Box | undefined
  if (display !== 'none') {
    const { model } = (await cdp.send('DOM.getBoxModel', { nodeId: indicator.nodeId })) as { model: { border: number[] } }
    const [x1, y1, x2, , , y3] = model.border
    box = { left: x1, right: x2, top: y1, bottom: y3, width: x2 - x1, height: y3 - y1 }
  }
  await cdp.detach()
  return { display, opacity: style('opacity'), position: style('position'), box }
}

async function fields(page: Page, formSelector: string) {
  const form = page.locator(formSelector).first()
  await form.scrollIntoViewIfNeeded()
  const date = form.locator('input[type="date"]')
  const select = form.locator('select').first()
  return {
    date,
    select,
    dateIcon: date.locator('xpath=following-sibling::*[local-name()="svg"]'),
    selectIcon: select.locator('xpath=following-sibling::*[local-name()="svg"]'),
  }
}

function expectSameBox(actual: Box, expected: Box, what: string) {
  for (const key of ['width', 'height', 'right', 'top'] as const) {
    expect(Math.abs(actual[key] - expected[key]), `${what}: ${key}`).toBeLessThanOrEqual(0.5)
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
})

for (const { name, form } of FORMS) {
  test.describe(name, () => {
    test('el ícono de la fecha es decorativo y no recibe clics', async ({ page }) => {
      const { dateIcon } = await fields(page, form)
      await expect(dateIcon).toHaveCount(1)
      await expect(dateIcon).toBeVisible()
      await expect(dateIcon).toHaveAttribute('aria-hidden', 'true')
      await expect(dateIcon).toHaveAttribute('focusable', 'false')
      await expect(dateIcon).toHaveAttribute('data-field-icon', 'calendar-today')
      await expect(dateIcon).toHaveCSS('pointer-events', 'none')
      await expect(dateIcon.locator('use')).toHaveAttribute('href', /#calendar-today$/)
    })

    for (const invalid of [false, true]) {
      test(`ícono e indicador en el lugar de la flecha del Select${invalid ? ', con error' : ''}`, async ({ page }) => {
        const { date, select, dateIcon, selectIcon } = await fields(page, form)
        if (invalid) {
          // Solo la fecha con error: la flecha del Select (sin error) es la referencia que no se mueve
          await date.evaluate((el) => el.setAttribute('aria-invalid', 'true'))
          await expect(date).toHaveCSS('border-right-width', '2px')
        }

        const dateBox = await box(date)
        const selectBox = await box(select)
        const iconBox = await box(dateIcon)
        const arrowBox = await box(selectIcon)

        // Mismo tamaño que la flecha y a la misma distancia del borde derecho, centrado en el campo
        const relative = (icon: Box, field: Box): Box => ({
          ...icon,
          right: field.right - icon.right,
          top: icon.top + icon.height / 2 - (field.top + field.height / 2),
        })
        expectSameBox(relative(iconBox, dateBox), relative(arrowBox, selectBox), 'ícono frente a la flecha')

        // Indicador nativo: transparente, presente (sin display: none) y justo encima del ícono
        const indicator = await indicatorBox(page, await date.getAttribute('id') ?? '')
        expect(indicator.display).not.toBe('none')
        expect(indicator.opacity).toBe('0')
        expect(indicator.position).toBe('absolute')
        expectSameBox(indicator.box!, iconBox, 'indicador frente al ícono')

        // Mismo padding derecho que el Select
        const paddingRight = await select.evaluate((el) => getComputedStyle(el).paddingRight)
        await expect(date).toHaveCSS('padding-right', paddingRight)
      })
    }
  })
}

test('ningún campo tiene un interlineado menor a 1.2 veces su fuente', async ({ page }) => {
  const tight = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('input:not([type="checkbox"], [type="radio"], [type="hidden"]), select, textarea')]
      .map((el) => {
        const style = getComputedStyle(el)
        const fontSize = parseFloat(style.fontSize)
        // "normal" ronda 1.2 o más según la fuente: solo falla un valor explícito menor
        const lineHeight = style.lineHeight === 'normal' ? fontSize * 1.2 : parseFloat(style.lineHeight)
        return { id: el.id || el.tagName, ratio: lineHeight / fontSize }
      })
      .filter(({ ratio }) => ratio < 1.2),
  )
  expect(tight).toEqual([])
})
